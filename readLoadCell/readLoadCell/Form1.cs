using readLoadCell.Communication;
using readLoadCell.Protocol;
using readLoadCell.Alarm;
using readLoadCell.Logging;
using readLoadCell.Settings;

namespace readLoadCell;

public partial class MainForm : Form
{
    private LoadCellCommunication? _communication;
    private ICasFrameParser? _parser;
    private CsvDataLogger? _csvLogger;
    private AlarmEvaluator? _alarmEvaluator;
    private AppSettings? _settings;
    private WeightReading? _lastReading;
    private AlarmState _lastAlarmState = AlarmState.Unknown;
    private DateTime _lastFrameTime = DateTime.MinValue;
    private int _totalFramesReceived;
    private int _parseFailures;

    public MainForm()
    {
        InitializeComponent();
        Text = "로드셀 리더 (CAS 인디케이터)";
    }

    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);

        // 설정 로드
        _settings = AppSettings.Load();
        _parser = new CasProtocolParser();
        _csvLogger = new CsvDataLogger(_settings.LoggingIntervalSeconds);
        _alarmEvaluator = new AlarmEvaluator
        {
            UpperLimit = _settings.AlarmUpperLimit,
            LowerLimit = _settings.AlarmLowerLimit,
            Enabled = _settings.AlarmEnabled
        };

        // UI 초기화
        InitializeUI();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        _communication?.Close();
        _csvLogger?.Dispose();

        if (_settings != null)
        {
            _settings.AlarmUpperLimit = _alarmEvaluator?.UpperLimit ?? 100m;
            _settings.AlarmLowerLimit = _alarmEvaluator?.LowerLimit ?? 0m;
            _settings.AlarmEnabled = _alarmEvaluator?.Enabled ?? false;
            _settings.LoggingEnabled = _csvLogger != null;
            _settings.Save();
        }

        base.OnFormClosing(e);
    }

    private void InitializeUI()
    {
        // COM 포트 목록 갱신
        RefreshAvailablePorts();

        // 이벤트 핸들러 등록
        btnRefreshPorts.Click += BtnRefreshPorts_Click;
        btnConnect.Click += BtnConnect_Click;
        btnZero.Click += BtnZero_Click;
        btnOpenLogFolder.Click += BtnOpenLogFolder_Click;
        chkAlarmEnabled.CheckedChanged += ChkAlarmEnabled_CheckedChanged;
        nudUpperLimit.ValueChanged += NudAlarmLimit_ValueChanged;
        nudLowerLimit.ValueChanged += NudAlarmLimit_ValueChanged;
        chkLoggingEnabled.CheckedChanged += ChkLoggingEnabled_CheckedChanged;
        nudLoggingInterval.ValueChanged += NudLoggingInterval_ValueChanged;
        chkRawLogging.CheckedChanged += ChkRawLogging_CheckedChanged;

        // 설정값 UI에 반영
        cbPortName.SelectedItem = _settings?.PortName ?? "COM1";
        cbBaudRate.SelectedItem = _settings?.BaudRate ?? 38400;
        nudUpperLimit.Value = (decimal)(_alarmEvaluator?.UpperLimit ?? 100m);
        nudLowerLimit.Value = (decimal)(_alarmEvaluator?.LowerLimit ?? 0m);
        chkAlarmEnabled.Checked = _alarmEvaluator?.Enabled ?? false;
        nudLoggingInterval.Value = _settings?.LoggingIntervalSeconds ?? 5;
        chkLoggingEnabled.Checked = _settings?.LoggingEnabled ?? false;
        chkRawLogging.Checked = _settings?.RawFrameLoggingEnabled ?? true;

        // UI 상태 초기화
        UpdateConnectionStatus(false);
        UpdateWeightDisplay(null, AlarmState.Unknown);
    }

    private void RefreshAvailablePorts()
    {
        cbPortName.Items.Clear();
        var ports = System.IO.Ports.SerialPort.GetPortNames();
        foreach (var port in ports)
            cbPortName.Items.Add(port);

        if (cbPortName.Items.Count > 0)
            cbPortName.SelectedIndex = 0;
    }

    private void BtnRefreshPorts_Click(object? sender, EventArgs e)
    {
        RefreshAvailablePorts();
    }

    private void BtnConnect_Click(object? sender, EventArgs e)
    {
        if (_communication?.IsConnected ?? false)
        {
            _communication?.Close();
            UpdateConnectionStatus(false);
            btnConnect.Text = "연결";
        }
        else
        {
            try
            {
                var portName = cbPortName.SelectedItem?.ToString() ?? "COM1";
                if (!int.TryParse(cbBaudRate.SelectedItem?.ToString() ?? "38400", out var baudRate))
                    baudRate = 38400;

                var settings = new SerialPortSettings(portName, baudRate);
                _communication = new LoadCellCommunication();
                _communication.RawFrameReceived += OnRawFrameReceived;
                _communication.CommunicationError += OnCommunicationError;
                _communication.Disconnected += (s, e) => UpdateConnectionStatus(false);

                _communication.Open(settings);
                UpdateConnectionStatus(true);
                btnConnect.Text = "연결 해제";

                // 포트/속도 선택 비활성화
                cbPortName.Enabled = false;
                cbBaudRate.Enabled = false;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"연결 실패: {ex.Message}", "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }

    private void BtnZero_Click(object? sender, EventArgs e)
    {
        if (_communication?.IsConnected ?? false)
        {
            btnZero.Enabled = false;
            if (_communication.SendCommand("Z"))
            {
                AppLogger.Info("Zero 명령 송신");
            }
            else
            {
                MessageBox.Show("Zero 명령 송신 실패", "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }

            Task.Delay(1000).ContinueWith(t =>
            {
                if (InvokeRequired)
                    BeginInvoke(new Action(() => btnZero.Enabled = true));
                else
                    btnZero.Enabled = true;
            });
        }
    }

    private void BtnOpenLogFolder_Click(object? sender, EventArgs e)
    {
        var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
        if (!Directory.Exists(logPath))
            Directory.CreateDirectory(logPath);

        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(logPath) { UseShellExecute = true });
    }

    private void ChkAlarmEnabled_CheckedChanged(object? sender, EventArgs e)
    {
        if (_alarmEvaluator != null)
            _alarmEvaluator.Enabled = chkAlarmEnabled.Checked;
    }

    private void NudAlarmLimit_ValueChanged(object? sender, EventArgs e)
    {
        if (_alarmEvaluator != null)
        {
            _alarmEvaluator.UpperLimit = nudUpperLimit.Value;
            _alarmEvaluator.LowerLimit = nudLowerLimit.Value;
        }
    }

    private void ChkLoggingEnabled_CheckedChanged(object? sender, EventArgs e)
    {
        if (_settings != null)
            _settings.LoggingEnabled = chkLoggingEnabled.Checked;
    }

    private void NudLoggingInterval_ValueChanged(object? sender, EventArgs e)
    {
        if (_settings != null)
            _settings.LoggingIntervalSeconds = (int)nudLoggingInterval.Value;

        if (_csvLogger != null)
            _csvLogger = new CsvDataLogger((int)nudLoggingInterval.Value);
    }

    private void ChkRawLogging_CheckedChanged(object? sender, EventArgs e)
    {
        if (_settings != null)
            _settings.RawFrameLoggingEnabled = chkRawLogging.Checked;
    }

    private void UpdateConnectionStatus(bool isConnected)
    {
        if (isConnected)
        {
            lblStatus.Text = "상태: 연결됨";
            lblStatus.ForeColor = Color.Green;
            btnZero.Enabled = true;
            nudUpperLimit.Enabled = true;
            nudLowerLimit.Enabled = true;
        }
        else
        {
            lblStatus.Text = "상태: 연결 안됨";
            lblStatus.ForeColor = Color.Gray;
            btnZero.Enabled = false;
            cbPortName.Enabled = true;
            cbBaudRate.Enabled = true;
            UpdateWeightDisplay(null, AlarmState.Unknown);
        }
    }

    private void UpdateWeightDisplay(WeightReading? reading, AlarmState alarmState)
    {
        if (reading != null)
        {
            lblWeightValue.Text = $"{reading.Weight:F1}";
            lblUnit.Text = reading.Unit;
            lblStability.Text = reading.IsStable ? "안정" : "불안정";
            lblStability.ForeColor = reading.IsStable ? Color.Green : Color.Red;
            lblLastReceived.Text = $"마지막 수신: {reading.Timestamp:HH:mm:ss}";
        }
        else
        {
            lblWeightValue.Text = "0.0";
            lblUnit.Text = "--";
            lblStability.Text = "불안정";
            lblStability.ForeColor = Color.Gray;
        }

        // Alarm 상태 표시
        switch (alarmState)
        {
            case AlarmState.Normal:
                lblAlarmState.Text = "정상";
                lblAlarmState.BackColor = Color.LightGreen;
                lblAlarmState.ForeColor = Color.Black;
                break;
            case AlarmState.OverUpperLimit:
                lblAlarmState.Text = $"상한 초과 ({reading?.Weight:F1})";
                lblAlarmState.BackColor = Color.Red;
                lblAlarmState.ForeColor = Color.White;
                break;
            case AlarmState.UnderLowerLimit:
                lblAlarmState.Text = $"하한 미달 ({reading?.Weight:F1})";
                lblAlarmState.BackColor = Color.Orange;
                lblAlarmState.ForeColor = Color.Black;
                break;
            case AlarmState.Unknown:
                lblAlarmState.Text = "데이터 없음";
                lblAlarmState.BackColor = Color.LightGray;
                lblAlarmState.ForeColor = Color.Black;
                break;
        }

        lblFrameCount.Text = $"프레임: {_totalFramesReceived}";
        lblParseErrors.Text = $"오류: {_parseFailures}";
    }

    private void AppendRawFrame(string frame)
    {
        if (txtRawFrames.Lines.Length > 100)
        {
            // 오래된 줄들 제거
            var lines = txtRawFrames.Lines.ToList();
            lines.RemoveRange(0, 20);
            txtRawFrames.Lines = lines.ToArray();
        }

        txtRawFrames.AppendText($"[{DateTime.Now:HH:mm:ss.fff}] {frame}\r\n");
        txtRawFrames.Select(txtRawFrames.Text.Length, 0);
        txtRawFrames.ScrollToCaret();
    }

    private void OnRawFrameReceived(object? sender, string rawFrame)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => OnRawFrameReceived(sender, rawFrame)));
            return;
        }

        _lastFrameTime = DateTime.Now;
        _totalFramesReceived++;

        // Raw 프레임 로깅
        if (_settings?.RawFrameLoggingEnabled ?? true)
        {
            RawFrameLogger.Append(rawFrame);
        }

        // 파싱
        string parseError = string.Empty;
        if (_parser != null && _parser.TryParse(rawFrame, out var reading, out parseError))
        {
            _lastReading = reading;

            // Alarm 평가
            var alarmState = _alarmEvaluator?.Evaluate(reading.Weight) ?? AlarmState.Unknown;

            // 상태 전이 로깅
            if (alarmState != _lastAlarmState)
            {
                _lastAlarmState = alarmState;
                var msg = _alarmEvaluator?.GetAlarmMessage(alarmState, reading.Weight) ?? "Unknown";
                AppLogger.Info($"Alarm 상태 변경: {msg}");
            }

            // CSV 로깅
            if (_csvLogger != null && (_settings?.LoggingEnabled ?? false))
            {
                _csvLogger.LogIfDue(reading, alarmState);
            }

            // UI 업데이트 (TODO: 실제 컨트롤 연결)
            UpdateUI(reading, alarmState);
        }
        else
        {
            _parseFailures++;
            AppLogger.Warning($"파싱 실패: {parseError}");
        }
    }

    private void UpdateUI(WeightReading reading, AlarmState alarmState)
    {
        UpdateWeightDisplay(reading, alarmState);
        AppendRawFrame(reading.RawFrame);
    }

    private void OnCommunicationError(object? sender, Exception ex)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => OnCommunicationError(sender, ex)));
            return;
        }

        AppLogger.Error("통신 오류", ex);
        // TODO: UI에 오류 상태 표시
    }
}
