namespace readLoadCell;

partial class MainForm
{
    private System.ComponentModel.IContainer components = null;

    // 연결 그룹
    private GroupBox gbConnection;
    private Label lblPort;
    private ComboBox cbPortName;
    private Button btnRefreshPorts;
    private Label lblBaudRate;
    private ComboBox cbBaudRate;
    private Button btnConnect;
    private Label lblStatus;

    // 무게 표시 그룹
    private GroupBox gbWeight;
    private Label lblWeightValue;
    private Label lblUnit;
    private Label lblStability;
    private Button btnZero;

    // Alarm 그룹
    private GroupBox gbAlarm;
    private CheckBox chkAlarmEnabled;
    private Label lblUpperLimit;
    private NumericUpDown nudUpperLimit;
    private Label lblLowerLimit;
    private NumericUpDown nudLowerLimit;
    private Label lblAlarmState;

    // 로깅 그룹
    private GroupBox gbLogging;
    private CheckBox chkLoggingEnabled;
    private Label lblLoggingInterval;
    private NumericUpDown nudLoggingInterval;
    private Button btnOpenLogFolder;

    // 진단 그룹
    private GroupBox gbDiagnostics;
    private TextBox txtRawFrames;
    private CheckBox chkRawLogging;

    // 상태바
    private StatusStrip statusStrip;
    private ToolStripStatusLabel lblLastReceived;
    private ToolStripStatusLabel lblFrameCount;
    private ToolStripStatusLabel lblParseErrors;

    protected override void Dispose(bool disposing)
    {
        if (disposing && (components != null))
        {
            components.Dispose();
        }
        base.Dispose(disposing);
    }

    #region Windows Form Designer generated code

    private void InitializeComponent()
    {
        this.components = new System.ComponentModel.Container();
        this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
        this.ClientSize = new System.Drawing.Size(1200, 900);
        this.Text = "로드셀 리더 (CAS 인디케이터)";
        this.Font = new System.Drawing.Font("Segoe UI", 11);
        this.Padding = new Padding(10);

        // 메인 패널 (스크롤 가능)
        var mainPanel = new Panel { Dock = DockStyle.Fill, AutoScroll = true };

        // 연결 그룹박스
        gbConnection = new GroupBox { Text = "연결", Location = new Point(10, 10), Size = new Size(400, 150) };
        lblPort = new Label { Text = "포트:", Location = new Point(10, 25), Size = new Size(80, 25) };
        cbPortName = new ComboBox { Location = new Point(100, 25), Size = new Size(100, 25), DropDownStyle = ComboBoxStyle.DropDownList };
        btnRefreshPorts = new Button { Text = "새로고침", Location = new Point(210, 25), Size = new Size(80, 25) };

        lblBaudRate = new Label { Text = "속도:", Location = new Point(10, 60), Size = new Size(80, 25) };
        cbBaudRate = new ComboBox { Location = new Point(100, 60), Size = new Size(100, 25), DropDownStyle = ComboBoxStyle.DropDownList };

        btnConnect = new Button { Text = "연결", Location = new Point(210, 60), Size = new Size(80, 25) };

        lblStatus = new Label { Text = "상태: 연결 안됨", Location = new Point(10, 95), Size = new Size(300, 30),
            ForeColor = Color.Gray, AutoSize = false, Font = new Font("Segoe UI", 10, FontStyle.Bold) };

        gbConnection.Controls.AddRange(new Control[] { lblPort, cbPortName, btnRefreshPorts, lblBaudRate, cbBaudRate, btnConnect, lblStatus });
        mainPanel.Controls.Add(gbConnection);

        // 무게 표시 그룹박스
        gbWeight = new GroupBox { Text = "무게", Location = new Point(430, 10), Size = new Size(350, 150) };
        lblWeightValue = new Label { Text = "0.0", Location = new Point(10, 25), Size = new Size(320, 60),
            Font = new Font("Segoe UI", 40, FontStyle.Bold), TextAlign = ContentAlignment.MiddleRight };
        lblUnit = new Label { Text = "kg", Location = new Point(10, 85), Size = new Size(100, 25), Font = new Font("Segoe UI", 12) };
        lblStability = new Label { Text = "불안정", Location = new Point(120, 85), Size = new Size(100, 25), ForeColor = Color.Red };
        btnZero = new Button { Text = "Zero", Location = new Point(230, 85), Size = new Size(100, 40) };

        gbWeight.Controls.AddRange(new Control[] { lblWeightValue, lblUnit, lblStability, btnZero });
        mainPanel.Controls.Add(gbWeight);

        // Alarm 그룹박스
        gbAlarm = new GroupBox { Text = "임계값 / Alarm", Location = new Point(10, 170), Size = new Size(400, 150) };
        chkAlarmEnabled = new CheckBox { Text = "Alarm 사용", Location = new Point(10, 25), Size = new Size(150, 25) };

        lblUpperLimit = new Label { Text = "상한:", Location = new Point(10, 60), Size = new Size(80, 25) };
        nudUpperLimit = new NumericUpDown { Location = new Point(100, 60), Size = new Size(100, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 9999 };

        lblLowerLimit = new Label { Text = "하한:", Location = new Point(210, 60), Size = new Size(80, 25) };
        nudLowerLimit = new NumericUpDown { Location = new Point(290, 60), Size = new Size(100, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 9999 };

        lblAlarmState = new Label { Text = "정상", Location = new Point(10, 95), Size = new Size(380, 40),
            TextAlign = ContentAlignment.MiddleCenter, BackColor = Color.LightGray, Font = new Font("Segoe UI", 12, FontStyle.Bold) };

        gbAlarm.Controls.AddRange(new Control[] { chkAlarmEnabled, lblUpperLimit, nudUpperLimit, lblLowerLimit, nudLowerLimit, lblAlarmState });
        mainPanel.Controls.Add(gbAlarm);

        // 로깅 그룹박스
        gbLogging = new GroupBox { Text = "데이터 로깅", Location = new Point(430, 170), Size = new Size(350, 150) };
        chkLoggingEnabled = new CheckBox { Text = "로깅 사용", Location = new Point(10, 25), Size = new Size(150, 25) };

        lblLoggingInterval = new Label { Text = "주기 (초):", Location = new Point(10, 60), Size = new Size(80, 25) };
        nudLoggingInterval = new NumericUpDown { Location = new Point(100, 60), Size = new Size(80, 25), Minimum = 1, Maximum = 60, Value = 5 };

        btnOpenLogFolder = new Button { Text = "로그 폴더 열기", Location = new Point(190, 60), Size = new Size(150, 25) };

        gbLogging.Controls.AddRange(new Control[] { chkLoggingEnabled, lblLoggingInterval, nudLoggingInterval, btnOpenLogFolder });
        mainPanel.Controls.Add(gbLogging);

        // 진단 그룹박스
        gbDiagnostics = new GroupBox { Text = "진단 (Raw 프레임)", Location = new Point(10, 330), Size = new Size(770, 200) };
        txtRawFrames = new TextBox { Location = new Point(10, 25), Size = new Size(750, 140), Multiline = true,
            ReadOnly = true, ScrollBars = ScrollBars.Both, Font = new Font("Courier New", 9) };
        chkRawLogging = new CheckBox { Text = "Raw 프레임 파일 저장", Location = new Point(10, 170), Size = new Size(200, 25) };

        gbDiagnostics.Controls.AddRange(new Control[] { txtRawFrames, chkRawLogging });
        mainPanel.Controls.Add(gbDiagnostics);

        // 상태바
        statusStrip = new StatusStrip();
        lblLastReceived = new ToolStripStatusLabel { Text = "마지막 수신: --:--:--", AutoSize = false, Width = 200 };
        lblFrameCount = new ToolStripStatusLabel { Text = "프레임: 0", AutoSize = false, Width = 150 };
        lblParseErrors = new ToolStripStatusLabel { Text = "오류: 0", AutoSize = false, Width = 150 };
        statusStrip.Items.AddRange(new ToolStripItem[] { lblLastReceived, lblFrameCount, lblParseErrors });

        // 메인 폼에 추가
        this.Controls.Add(mainPanel);
        this.Controls.Add(statusStrip);

        // 콤보박스 초기값 설정
        foreach (var baudRate in new[] { 600, 1200, 2400, 4800, 9600, 19200, 38400 })
            cbBaudRate.Items.Add(baudRate);
        cbBaudRate.SelectedIndex = 6; // 38400 기본값
    }

    #endregion
}
