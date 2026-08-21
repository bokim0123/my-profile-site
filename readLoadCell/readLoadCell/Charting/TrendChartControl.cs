using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Windows.Forms;
using readLoadCell.Protocol;

namespace readLoadCell.Charting
{
    public class TrendChartControl : Panel
    {
        // 데이터
        private readonly List<(double ElapsedSeconds, decimal Weight)> _points = new();
        private DateTime? _sessionStartTime;

        // 임계선 (측정 설정 GroupBox와 바인딩)
        public decimal? MaxLimit { get; set; }
        public decimal? MinLimit { get; set; }
        public double? X1Seconds { get; set; }
        public double? X2Seconds { get; set; }

        // 축 스케일 (자동 스케일링)
        private double _xMin, _xMax = 10;
        private decimal _yMin, _yMax = 10m;

        // 그리기 여백 (좌: Y축 라벨, 하: X축 라벨)
        private readonly Padding _plotMargin = new Padding(60, 20, 20, 40);

        // 마우스 크로스헤어
        private Point? _mousePosition;

        public TrendChartControl()
        {
            DoubleBuffered = true;
            BackColor = Color.White;

            MouseMove += (s, e) =>
            {
                _mousePosition = e.Location;
                Invalidate();
            };
            MouseLeave += (s, e) =>
            {
                _mousePosition = null;
                Invalidate();
            };
        }

        public void AddPoint(WeightReading reading)
        {
            if (_sessionStartTime == null)
                _sessionStartTime = reading.Timestamp;

            var elapsed = (reading.Timestamp - _sessionStartTime.Value).TotalSeconds;
            _points.Add((elapsed, reading.Weight));

            RescaleIfNeeded();
            Invalidate();
        }

        public void StartNewSession(DateTime startTime)
        {
            _points.Clear();
            _sessionStartTime = startTime;
            _xMin = 0;
            _xMax = 10;
            _yMin = 0;
            _yMax = 10m;
            Invalidate();
        }

        public void Clear()
        {
            _points.Clear();
            _sessionStartTime = null;
            _xMin = 0;
            _xMax = 10;
            _yMin = 0;
            _yMax = 10m;
            Invalidate();
        }

        public void SetLimits(decimal? max, decimal? min)
        {
            MaxLimit = max;
            MinLimit = min;
            RescaleIfNeeded();
            Invalidate();
        }

        public void SetAnalysisWindow(double? x1, double? x2)
        {
            X1Seconds = x1;
            X2Seconds = x2;
            Invalidate();
        }

        private void RescaleIfNeeded()
        {
            if (_points.Count == 0)
            {
                _xMax = 10;
                _yMin = 0;
                _yMax = 10m;
                return;
            }

            var maxElapsed = _points.Max(p => p.ElapsedSeconds);
            var maxWeight = _points.Max(p => p.Weight);
            var minWeight = _points.Min(p => p.Weight);

            // X축 확장 (마지막 포인트가 범위 내에 들어오도록)
            if (maxElapsed > _xMax * 0.9)
                _xMax = maxElapsed * 1.1;

            // Y축 확장 (Max/Min Limit 포함)
            decimal yMax = maxWeight;
            if (MaxLimit.HasValue && MaxLimit.Value > yMax)
                yMax = MaxLimit.Value;
            decimal yMin = minWeight;
            if (MinLimit.HasValue && MinLimit.Value < yMin)
                yMin = MinLimit.Value;

            _yMax = yMax + (yMax - yMin) * 0.1m;
            _yMin = yMin - (yMax - yMin) * 0.1m;

            if (_yMax == _yMin)
                _yMax = _yMin + 10m;
        }

        private Rectangle GetPlotRect()
        {
            int plotLeft = _plotMargin.Left;
            int plotTop = _plotMargin.Top;
            int plotWidth = ClientSize.Width - _plotMargin.Left - _plotMargin.Right;
            int plotHeight = ClientSize.Height - _plotMargin.Top - _plotMargin.Bottom;
            return new Rectangle(plotLeft, plotTop, plotWidth, plotHeight);
        }

        private PointF ToPixel(double elapsedSeconds, decimal weight)
        {
            var rect = GetPlotRect();
            double xRange = _xMax - _xMin;
            double yRange = (double)(_yMax - _yMin);

            if (xRange <= 0) xRange = 1;
            if (yRange <= 0) yRange = 1;

            float pixelX = rect.Left + (float)((elapsedSeconds - _xMin) / xRange * rect.Width);
            float pixelY = rect.Top + (float)((double)(_yMax - weight) / yRange * rect.Height);

            return new PointF(pixelX, pixelY);
        }

        private (double sec, decimal weight) ToData(Point pixel)
        {
            var rect = GetPlotRect();
            double xRange = _xMax - _xMin;
            double yRange = (double)(_yMax - _yMin);

            if (xRange <= 0) xRange = 1;
            if (yRange <= 0) yRange = 1;

            double elapsed = _xMin + (pixel.X - rect.Left) / (double)rect.Width * xRange;
            decimal weight = _yMax - (decimal)((pixel.Y - rect.Top) / (double)rect.Height * yRange);

            return (elapsed, weight);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            base.OnPaint(e);

            var g = e.Graphics;
            g.SmoothingMode = SmoothingMode.AntiAlias;
            var rect = GetPlotRect();

            // 1. 배경 + 그리드
            DrawGrid(g, rect);

            // 2. X1/X2 구간 밖 회색 음영
            DrawOutOfWindowShading(g, rect);

            // 3. 축 눈금 + 라벨
            DrawAxes(g, rect);

            // 4. Max/Min Limit 가로 점선
            DrawHorizontalDashedLine(g, MaxLimit, Color.Red, rect, "Max");
            DrawHorizontalDashedLine(g, MinLimit, Color.Red, rect, "Min");

            // 5. Avg 가로 점선
            if (_points.Count > 0)
            {
                var avg = _points.Average(p => p.Weight);
                DrawHorizontalDashedLine(g, (decimal)avg, Color.Blue, rect, "Avg");
            }

            // 6. X1/X2 세로 점선
            DrawVerticalDashedLine(g, X1Seconds, Color.Gray, rect);
            DrawVerticalDashedLine(g, X2Seconds, Color.Gray, rect);

            // 7. 측정 곡선
            DrawTrendLine(g, rect);

            // 8. 마우스 크로스헤어 + 좌표
            DrawCrosshair(g, rect);
        }

        private void DrawGrid(Graphics g, Rectangle rect)
        {
            g.FillRectangle(Brushes.White, rect);
            g.DrawRectangle(Pens.Black, rect);

            // Y축 그리드 (수평선)
            using (var gridPen = new Pen(Color.LightGray) { DashStyle = DashStyle.Dash })
            {
                int gridLines = 5;
                for (int i = 1; i < gridLines; i++)
                {
                    int y = rect.Top + (int)(i * rect.Height / (double)gridLines);
                    g.DrawLine(gridPen, rect.Left, y, rect.Right, y);
                }
            }

            // X축 그리드 (수직선)
            using (var gridPen = new Pen(Color.LightGray) { DashStyle = DashStyle.Dash })
            {
                int gridLines = 5;
                for (int i = 1; i < gridLines; i++)
                {
                    int x = rect.Left + (int)(i * rect.Width / (double)gridLines);
                    g.DrawLine(gridPen, x, rect.Top, x, rect.Bottom);
                }
            }
        }

        private void DrawOutOfWindowShading(Graphics g, Rectangle rect)
        {
            if (!X1Seconds.HasValue || !X2Seconds.HasValue)
                return;

            var p1 = ToPixel(X1Seconds.Value, _yMin);
            var p2 = ToPixel(X2Seconds.Value, _yMin);

            // X1 이전
            if (p1.X > rect.Left)
            {
                g.FillRectangle(new SolidBrush(Color.FromArgb(40, Color.Gray)),
                    rect.Left, rect.Top, (int)(p1.X - rect.Left), rect.Height);
            }

            // X2 이후
            if (p2.X < rect.Right)
            {
                g.FillRectangle(new SolidBrush(Color.FromArgb(40, Color.Gray)),
                    (int)p2.X, rect.Top, (int)(rect.Right - p2.X), rect.Height);
            }
        }

        private void DrawAxes(Graphics g, Rectangle rect)
        {
            using (var font = new Font("Arial", 9))
            {
                // Y축 (무게)
                int yLabels = 5;
                for (int i = 0; i <= yLabels; i++)
                {
                    decimal value = _yMin + ((_yMax - _yMin) / yLabels) * i;
                    var pt = ToPixel(0, value);
                    int y = (int)pt.Y;

                    g.DrawLine(Pens.Black, rect.Left - 5, y, rect.Left, y);
                    string label = value.ToString("F1");
                    var sz = g.MeasureString(label, font);
                    g.DrawString(label, font, Brushes.Black,
                        rect.Left - 10 - sz.Width, y - sz.Height / 2);
                }

                // X축 (시간)
                int xLabels = 5;
                for (int i = 0; i <= xLabels; i++)
                {
                    double value = _xMin + ((_xMax - _xMin) / xLabels) * i;
                    var pt = ToPixel(value, _yMin);
                    int x = (int)pt.X;

                    g.DrawLine(Pens.Black, x, rect.Bottom, x, rect.Bottom + 5);
                    string label = value.ToString("F1");
                    var sz = g.MeasureString(label, font);
                    g.DrawString(label, font, Brushes.Black,
                        x - sz.Width / 2, rect.Bottom + 5);
                }

                // 축 라벨
                using (var labelFont = new Font("Arial", 10, FontStyle.Bold))
                {
                    g.DrawString("무게(kg)", labelFont, Brushes.Black, 5, rect.Top);
                    g.DrawString("시간(초)", labelFont, Brushes.Black, rect.Right - 60, rect.Bottom + 25);
                }
            }
        }

        private void DrawHorizontalDashedLine(Graphics g, decimal? value, Color color, Rectangle rect, string label = "")
        {
            if (!value.HasValue)
                return;

            var pt = ToPixel(0, value.Value);
            int y = (int)pt.Y;

            if (y < rect.Top || y > rect.Bottom)
                return;

            using (var pen = new Pen(color) { DashStyle = DashStyle.Dash, Width = 2 })
            {
                g.DrawLine(pen, rect.Left, y, rect.Right, y);
            }

            if (!string.IsNullOrEmpty(label))
            {
                using (var font = new Font("Arial", 8))
                {
                    g.DrawString($"{label} {value:F2}", font, new SolidBrush(color),
                        rect.Right - 80, y - 10);
                }
            }
        }

        private void DrawVerticalDashedLine(Graphics g, double? value, Color color, Rectangle rect)
        {
            if (!value.HasValue)
                return;

            var pt = ToPixel(value.Value, _yMin);
            int x = (int)pt.X;

            if (x < rect.Left || x > rect.Right)
                return;

            using (var pen = new Pen(color) { DashStyle = DashStyle.Dash, Width = 1 })
            {
                g.DrawLine(pen, x, rect.Top, x, rect.Bottom);
            }
        }

        private void DrawTrendLine(Graphics g, Rectangle rect)
        {
            if (_points.Count < 2)
                return;

            var pixels = _points.Select(p => ToPixel(p.ElapsedSeconds, p.Weight)).ToArray();

            using (var pen = new Pen(Color.Blue, 2))
            {
                g.DrawLines(pen, pixels);
            }
        }

        private void DrawCrosshair(Graphics g, Rectangle rect)
        {
            if (!_mousePosition.HasValue)
                return;

            var pos = _mousePosition.Value;
            if (pos.X < rect.Left || pos.X > rect.Right || pos.Y < rect.Top || pos.Y > rect.Bottom)
                return;

            // 크로스헤어
            using (var pen = new Pen(Color.Black, 1) { DashStyle = DashStyle.Dot })
            {
                g.DrawLine(pen, pos.X, rect.Top, pos.X, rect.Bottom);
                g.DrawLine(pen, rect.Left, pos.Y, rect.Right, pos.Y);
            }

            // 좌표 텍스트
            var (elapsed, weight) = ToData(pos);
            string coordText = $"시간: {elapsed:F2}초, 무게: {weight:F2}kg";

            using (var font = new Font("Arial", 9))
            using (var brush = new SolidBrush(Color.Black))
            {
                var sz = g.MeasureString(coordText, font);
                int bgX = pos.X + 10;
                int bgY = pos.Y - (int)sz.Height - 5;

                // 배경
                g.FillRectangle(Brushes.White, bgX - 2, bgY - 2, (int)sz.Width + 4, (int)sz.Height + 4);
                g.DrawRectangle(Pens.Black, bgX - 2, bgY - 2, (int)sz.Width + 4, (int)sz.Height + 4);

                // 텍스트
                g.DrawString(coordText, font, brush, bgX, bgY);
            }
        }
    }
}
