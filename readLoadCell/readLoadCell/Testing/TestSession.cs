using System;
using System.Collections.Generic;
using System.Linq;
using readLoadCell.Protocol;

namespace readLoadCell.Testing
{
    public class TestSession
    {
        public string Customer { get; set; } = string.Empty;
        public string Product { get; set; } = string.Empty;
        public string LotNumber { get; set; } = string.Empty;
        public string Operator { get; set; } = string.Empty;

        public DateTime StartTime { get; }
        public decimal? MaxLimit { get; set; }
        public decimal? MinLimit { get; set; }
        public double? X1Seconds { get; set; }
        public double? X2Seconds { get; set; }

        private readonly List<WeightReading> _samples = new();
        public IReadOnlyList<WeightReading> Samples => _samples.AsReadOnly();

        public TestSession(DateTime startTime) => StartTime = startTime;

        public void AddSample(WeightReading reading) => _samples.Add(reading);

        public TestResult Evaluate()
        {
            // X1~X2 구간(경과초 기준) 내 샘플만 분석 대상
            var windowed = _samples.Where(s =>
            {
                var elapsed = (s.Timestamp - StartTime).TotalSeconds;
                if (X1Seconds.HasValue && elapsed < X1Seconds.Value) return false;
                if (X2Seconds.HasValue && elapsed > X2Seconds.Value) return false;
                return true;
            }).ToList();

            if (windowed.Count == 0)
            {
                return new TestResult { Passed = false, FailReason = "분석 구간 내 샘플 없음" };
            }

            var max = windowed.Max(s => s.Weight);
            var min = windowed.Min(s => s.Weight);
            var avg = windowed.Average(s => s.Weight);
            var duration = (windowed.Last().Timestamp - windowed.First().Timestamp).TotalSeconds;

            // Pass 조건: 구간 내 모든 샘플이 [MinLimit, MaxLimit] 범위 안
            bool passed = true;
            string reason = string.Empty;

            if (MaxLimit.HasValue && max > MaxLimit.Value)
            {
                passed = false;
                reason = $"Max({max:F2}) > MaxLimit({MaxLimit:F2})";
            }

            if (MinLimit.HasValue && min < MinLimit.Value)
            {
                passed = false;
                if (reason.Length > 0) reason += "; ";
                reason += $"Min({min:F2}) < MinLimit({MinLimit:F2})";
            }

            return new TestResult
            {
                Max = max,
                Min = min,
                Avg = avg,
                SampleCount = windowed.Count,
                DurationSeconds = duration,
                Passed = passed,
                FailReason = reason
            };
        }
    }
}
