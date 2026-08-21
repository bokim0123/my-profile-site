using readLoadCell.Communication;
using readLoadCell.Protocol;
using readLoadCell.Alarm;
using readLoadCell.Logging;
using readLoadCell.Settings;
using readLoadCell.Testing;
using readLoadCell.Charting;

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

    // 테스트 세션 및 차트
    private TestSession? _activeSession;
    private TestResult? _lastTestResult;

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

        // 이벤트 핸들러 등록 (기존)
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

        // 테스트 시작/종료 버튼
        btnStartTest.Click += BtnStartTest_Click;
        btnStopTest.Click += BtnStopTest_Click;

        // 메뉴 이벤트
        mnuExit.Click += (s, e) => Close();
        mnuSetupFocus.Click += (s, e) => gbTestSetting.Focus();
        mnuHelpAbout.Click += MnuHelpAbout_Click;

        // 임계값 동기화 (gbTestSetting ↔ gbAlarm)
        nudMaxLimit.ValueChanged += NudTestLimit_ValueChanged;
        nudMinLimit.ValueChanged += NudTestLimit_ValueChanged;

        // 설정값 UI에 반영
        cbPortName.SelectedItem = _settings?.PortName ?? "COM1";
        cbBaudRate.SelectedItem = _settings?.BaudRate ?? 38400;
        nudUpperLimit.Value = (decimal)(_alarmEvaluator?.UpperLimit ?? 100m);
        nudLowerLimit.Value = (decimal)(_alarmEvaluator?.LowerLimit ?? 0m);
        chkAlarmEnabled.Checked = _alarmEvaluator?.Enabled ?? false;
        nudLoggingInterval.Value = _settings?.LoggingIntervalSeconds ?? 5;
        chkLoggingEnabled.Checked = _settings?.LoggingEnabled ?? false;
        chkRawLogging.Checked = _settings?.RawFrameLoggingEnabled ?? true;

        // 테스트 설정 초기값
        nudMaxLimit.Value = 100m;
        nudMinLimit.Value = 0m;
        nudX1.Value = 0m;
        nudX2.Value = 10m;

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
            btnStartTest.Enabled = true;
        }
        else
        {
            lblStatus.Text = "상태: 연결 안됨";
            lblStatus.ForeColor = Color.Gray;
            btnZero.Enabled = false;
            btnStartTest.Enabled = false;
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

            // 차트 및 세션 업데이트 (측정 세션과 무관하게 차트는 항상 갱신)
            chartTrend.AddPoint(reading);
            if (_activeSession != null)
                _activeSession.AddSample(reading);

            // UI 업데이트
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
    }

    // ===== 테스트 세션 핸들러 =====

    private void BtnStartTest_Click(object? sender, EventArgs e)
    {
        if (_communication?.IsConnected ?? false)
        {
            // 세션 생성 및 설정값 스냅샷
            _activeSession = new TestSession(DateTime.Now)
            {
                Customer = txtCustomer.Text,
                Product = txtProduct.Text,
                LotNumber = txtLotNumber.Text,
                Operator = txtOperator.Text,
                MaxLimit = nudMaxLimit.Value > 0 ? nudMaxLimit.Value : null,
                MinLimit = nudMinLimit.Value > 0 ? nudMinLimit.Value : null,
                X1Seconds = nudX1.Value > 0 ? (double)nudX1.Value : null,
                X2Seconds = nudX2.Value > 0 ? (double)nudX2.Value : null
            };

            // 차트 초기화 및 설정
            chartTrend.StartNewSession(_activeSession.StartTime);
            chartTrend.SetLimits(_activeSession.MaxLimit, _activeSession.MinLimit);
            chartTrend.SetAnalysisWindow(_activeSession.X1Seconds, _activeSession.X2Seconds);

            // UI 상태 갱신
            btnStartTest.Enabled = false;
            btnStopTest.Enabled = true;
            lblTestStatus.Text = "측정 중...";
            lblPassFail.Text = "측정 중";
            lblPassFail.BackColor = Color.LightBlue;

            // 임계값도 불가능하게 (측정 중에는 변경 방지)
            nudMaxLimit.Enabled = false;
            nudMinLimit.Enabled = false;
            nudX1.Enabled = false;
            nudX2.Enabled = false;

            AppLogger.Info($"테스트 세션 시작: {_activeSession.Customer} / {_activeSession.Product}");
        }
    }

    private void BtnStopTest_Click(object? sender, EventArgs e)
    {
        if (_activeSession == null)
            return;

        // 세션 평가
        _lastTestResult = _activeSession.Evaluate();

        // 결과 로깅
        TestResultLogger.Log(_activeSession, _lastTestResult);

        // 결과 UI 업데이트
        lblResultMax.Text = $"Max: {_lastTestResult.Max:F2}";
        lblResultAvg.Text = $"Avg: {_lastTestResult.Avg:F2}";
        lblResultMin.Text = $"Min: {_lastTestResult.Min:F2}";

        if (_lastTestResult.Passed)
        {
            lblPassFail.Text = "✓ PASS";
            lblPassFail.BackColor = Color.LightGreen;
            lblPassFail.ForeColor = Color.DarkGreen;
        }
        else
        {
            lblPassFail.Text = $"✗ FAIL\n{_lastTestResult.FailReason}";
            lblPassFail.BackColor = Color.LightCoral;
            lblPassFail.ForeColor = Color.DarkRed;
        }

        // 상태 복구
        btnStartTest.Enabled = true;
        btnStopTest.Enabled = false;
        lblTestStatus.Text = "대기 중";

        nudMaxLimit.Enabled = true;
        nudMinLimit.Enabled = true;
        nudX1.Enabled = true;
        nudX2.Enabled = true;

        _activeSession = null;
        AppLogger.Info($"테스트 세션 종료: {(_lastTestResult.Passed ? "PASS" : "FAIL")}");
    }

    private void NudTestLimit_ValueChanged(object? sender, EventArgs e)
    {
        // 측정 세션 중에는 동기화하지 않음
        if (_activeSession != null)
            return;

        // gbTestSetting의 값으로 gbAlarm 업데이트
        if (nudMaxLimit.Value > 0)
            nudUpperLimit.Value = nudMaxLimit.Value;
        if (nudMinLimit.Value > 0)
            nudLowerLimit.Value = nudMinLimit.Value;
    }

    private void MnuHelpAbout_Click(object? sender, EventArgs e)
    {
        MessageBox.Show(
            "로드셀 리더 (CAS 인디케이터)\n" +
            "DF-2000 스타일 UI\n\n" +
            "Version: 2.0\n" +
            "© 2026 Industrial Automation",
            "정보",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information);
    }
}
