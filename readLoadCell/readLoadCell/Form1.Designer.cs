using readLoadCell.Charting;

namespace readLoadCell;

partial class MainForm
{
    private System.ComponentModel.IContainer components = null;

    // MenuStrip
    private MenuStrip menuStrip;
    private ToolStripMenuItem mnuFile;
    private ToolStripMenuItem mnuExit;
    private ToolStripMenuItem mnuSetup;
    private ToolStripMenuItem mnuSetupFocus;
    private ToolStripMenuItem mnuHelp;
    private ToolStripMenuItem mnuHelpAbout;

    // 상단: 세션정보 GroupBox (Y=10, X=10)
    private GroupBox gbSessionInfo;
    private Label lblCustomer;
    private TextBox txtCustomer;
    private Label lblProduct;
    private TextBox txtProduct;
    private Label lblLotNumber;
    private TextBox txtLotNumber;
    private Label lblOperator;
    private TextBox txtOperator;

    // 상단: 측정설정 GroupBox (Y=10, X=540)
    private GroupBox gbTestSetting;
    private Label lblMaxLimit;
    private NumericUpDown nudMaxLimit;
    private Label lblMinLimit;
    private NumericUpDown nudMinLimit;
    private Label lblX1;
    private NumericUpDown nudX1;
    private Label lblX2;
    private NumericUpDown nudX2;
    private Button btnStartTest;
    private Button btnStopTest;
    private Label lblTestStatus;

    // 상단: 결과통계 GroupBox (Y=10, X=950)
    private GroupBox gbTestResult;
    private Label lblResultMax;
    private Label lblResultAvg;
    private Label lblResultMin;
    private Label lblPassFail;

    // 차트 (Y=130)
    private TrendChartControl chartTrend;

    // 기존 연결 그룹 (Y=520)
    private GroupBox gbConnection;
    private Label lblPort;
    private ComboBox cbPortName;
    private Button btnRefreshPorts;
    private Label lblBaudRate;
    private ComboBox cbBaudRate;
    private Button btnConnect;
    private Label lblStatus;

    // 기존 무게 표시 그룹 (Y=520)
    private GroupBox gbWeight;
    private Label lblWeightValue;
    private Label lblUnit;
    private Label lblStability;
    private Button btnZero;

    // 기존 Alarm 그룹 (Y=520)
    private GroupBox gbAlarm;
    private CheckBox chkAlarmEnabled;
    private Label lblUpperLimit;
    private NumericUpDown nudUpperLimit;
    private Label lblLowerLimit;
    private NumericUpDown nudLowerLimit;
    private Label lblAlarmState;

    // 기존 로깅 그룹 (Y=520)
    private GroupBox gbLogging;
    private CheckBox chkLoggingEnabled;
    private Label lblLoggingInterval;
    private NumericUpDown nudLoggingInterval;
    private Button btnOpenLogFolder;

    // 기존 진단 그룹 (Y=670)
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
        this.ClientSize = new System.Drawing.Size(1400, 950);
        this.Text = "로드셀 리더 (CAS 인디케이터) - DF-2000 스타일";
        this.Font = new System.Drawing.Font("Segoe UI", 11);

        // MenuStrip
        menuStrip = new MenuStrip();
        mnuFile = new ToolStripMenuItem { Text = "파일(&F)" };
        mnuExit = new ToolStripMenuItem { Text = "종료(&X)" };
        mnuFile.DropDownItems.Add(mnuExit);

        mnuSetup = new ToolStripMenuItem { Text = "설정(&S)" };
        mnuSetupFocus = new ToolStripMenuItem { Text = "측정 설정 포커스(&M)" };
        mnuSetup.DropDownItems.Add(mnuSetupFocus);

        mnuHelp = new ToolStripMenuItem { Text = "도움말(&H)" };
        mnuHelpAbout = new ToolStripMenuItem { Text = "정보(&A)" };
        mnuHelp.DropDownItems.Add(mnuHelpAbout);

        menuStrip.Items.AddRange(new ToolStripItem[] { mnuFile, mnuSetup, mnuHelp });
        this.MainMenuStrip = menuStrip;
        this.Controls.Add(menuStrip);

        // 메인 패널 (스크롤 가능)
        var mainPanel = new Panel { Dock = DockStyle.Fill, AutoScroll = true };

        // ====== 상단 3개 GroupBox (Y=10) ======

        // gbSessionInfo (X=10, Y=10)
        gbSessionInfo = new GroupBox { Text = "세션 정보", Location = new Point(10, 10), Size = new Size(520, 110) };
        lblCustomer = new Label { Text = "고객:", Location = new Point(10, 25), Size = new Size(50, 25) };
        txtCustomer = new TextBox { Location = new Point(70, 25), Size = new Size(200, 25) };

        lblProduct = new Label { Text = "제품:", Location = new Point(280, 25), Size = new Size(50, 25) };
        txtProduct = new TextBox { Location = new Point(340, 25), Size = new Size(160, 25) };

        lblLotNumber = new Label { Text = "LOT:", Location = new Point(10, 60), Size = new Size(50, 25) };
        txtLotNumber = new TextBox { Location = new Point(70, 60), Size = new Size(200, 25) };

        lblOperator = new Label { Text = "작업자:", Location = new Point(280, 60), Size = new Size(50, 25) };
        txtOperator = new TextBox { Location = new Point(340, 60), Size = new Size(160, 25) };

        gbSessionInfo.Controls.AddRange(new Control[] {
            lblCustomer, txtCustomer, lblProduct, txtProduct,
            lblLotNumber, txtLotNumber, lblOperator, txtOperator
        });
        mainPanel.Controls.Add(gbSessionInfo);

        // gbTestSetting (X=540, Y=10)
        gbTestSetting = new GroupBox { Text = "측정 설정", Location = new Point(540, 10), Size = new Size(400, 110) };

        lblMaxLimit = new Label { Text = "상한(kg):", Location = new Point(10, 25), Size = new Size(80, 25) };
        nudMaxLimit = new NumericUpDown { Location = new Point(100, 25), Size = new Size(80, 25), DecimalPlaces = 2, Minimum = 0, Maximum = 9999 };

        lblMinLimit = new Label { Text = "하한(kg):", Location = new Point(190, 25), Size = new Size(80, 25) };
        nudMinLimit = new NumericUpDown { Location = new Point(280, 25), Size = new Size(80, 25), DecimalPlaces = 2, Minimum = 0, Maximum = 9999 };

        lblX1 = new Label { Text = "X1(초):", Location = new Point(10, 60), Size = new Size(80, 25) };
        nudX1 = new NumericUpDown { Location = new Point(100, 60), Size = new Size(80, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 3600 };

        lblX2 = new Label { Text = "X2(초):", Location = new Point(190, 60), Size = new Size(80, 25) };
        nudX2 = new NumericUpDown { Location = new Point(280, 60), Size = new Size(80, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 3600 };

        btnStartTest = new Button { Text = "측정 시작", Location = new Point(10, 75), Size = new Size(80, 25), Enabled = false };
        btnStopTest = new Button { Text = "측정 종료", Location = new Point(100, 75), Size = new Size(80, 25), Enabled = false };
        lblTestStatus = new Label { Text = "대기 중", Location = new Point(190, 75), Size = new Size(170, 25),
            TextAlign = ContentAlignment.MiddleLeft, AutoSize = false };

        gbTestSetting.Controls.AddRange(new Control[] {
            lblMaxLimit, nudMaxLimit, lblMinLimit, nudMinLimit,
            lblX1, nudX1, lblX2, nudX2,
            btnStartTest, btnStopTest, lblTestStatus
        });
        mainPanel.Controls.Add(gbTestSetting);

        // gbTestResult (X=950, Y=10)
        gbTestResult = new GroupBox { Text = "테스트 결과", Location = new Point(950, 10), Size = new Size(430, 110) };
        lblResultMax = new Label { Text = "Max: --", Location = new Point(10, 25), Size = new Size(130, 25) };
        lblResultAvg = new Label { Text = "Avg: --", Location = new Point(150, 25), Size = new Size(130, 25) };
        lblResultMin = new Label { Text = "Min: --", Location = new Point(290, 25), Size = new Size(120, 25) };

        lblPassFail = new Label { Text = "대기 중", Location = new Point(10, 60), Size = new Size(400, 30),
            TextAlign = ContentAlignment.MiddleCenter, Font = new Font("Segoe UI", 12, FontStyle.Bold),
            BackColor = Color.LightGray, AutoSize = false };

        gbTestResult.Controls.AddRange(new Control[] { lblResultMax, lblResultAvg, lblResultMin, lblPassFail });
        mainPanel.Controls.Add(gbTestResult);

        // ====== 차트 (Y=130) ======
        chartTrend = new TrendChartControl
        {
            Location = new Point(10, 130),
            Size = new Size(1370, 380),
            BackColor = Color.White
        };
        mainPanel.Controls.Add(chartTrend);

        // ====== 기존 4개 GroupBox (Y=520) ======

        // gbConnection (X=10, Y=520)
        gbConnection = new GroupBox { Text = "연결", Location = new Point(10, 520), Size = new Size(340, 140) };
        lblPort = new Label { Text = "포트:", Location = new Point(10, 25), Size = new Size(60, 25) };
        cbPortName = new ComboBox { Location = new Point(80, 25), Size = new Size(100, 25), DropDownStyle = ComboBoxStyle.DropDownList };
        btnRefreshPorts = new Button { Text = "새로고침", Location = new Point(190, 25), Size = new Size(70, 25) };

        lblBaudRate = new Label { Text = "속도:", Location = new Point(10, 60), Size = new Size(60, 25) };
        cbBaudRate = new ComboBox { Location = new Point(80, 60), Size = new Size(100, 25), DropDownStyle = ComboBoxStyle.DropDownList };
        btnConnect = new Button { Text = "연결", Location = new Point(190, 60), Size = new Size(70, 25) };

        lblStatus = new Label { Text = "상태: 연결 안됨", Location = new Point(10, 95), Size = new Size(280, 30),
            ForeColor = Color.Gray, AutoSize = false, Font = new Font("Segoe UI", 10, FontStyle.Bold) };

        gbConnection.Controls.AddRange(new Control[] {
            lblPort, cbPortName, btnRefreshPorts, lblBaudRate, cbBaudRate, btnConnect, lblStatus
        });
        mainPanel.Controls.Add(gbConnection);

        // gbWeight (X=360, Y=520)
        gbWeight = new GroupBox { Text = "무게", Location = new Point(360, 520), Size = new Size(300, 140) };
        lblWeightValue = new Label { Text = "0.0", Location = new Point(10, 25), Size = new Size(270, 60),
            Font = new Font("Segoe UI", 40, FontStyle.Bold), TextAlign = ContentAlignment.MiddleRight };
        lblUnit = new Label { Text = "kg", Location = new Point(10, 85), Size = new Size(100, 25), Font = new Font("Segoe UI", 12) };
        lblStability = new Label { Text = "불안정", Location = new Point(120, 85), Size = new Size(80, 25), ForeColor = Color.Red };
        btnZero = new Button { Text = "Zero", Location = new Point(210, 85), Size = new Size(70, 25) };

        gbWeight.Controls.AddRange(new Control[] { lblWeightValue, lblUnit, lblStability, btnZero });
        mainPanel.Controls.Add(gbWeight);

        // gbAlarm (X=670, Y=520)
        gbAlarm = new GroupBox { Text = "임계값 / Alarm", Location = new Point(670, 520), Size = new Size(340, 140) };
        chkAlarmEnabled = new CheckBox { Text = "Alarm 사용", Location = new Point(10, 25), Size = new Size(150, 25) };

        lblUpperLimit = new Label { Text = "상한:", Location = new Point(10, 60), Size = new Size(50, 25) };
        nudUpperLimit = new NumericUpDown { Location = new Point(70, 60), Size = new Size(80, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 9999 };

        lblLowerLimit = new Label { Text = "하한:", Location = new Point(160, 60), Size = new Size(50, 25) };
        nudLowerLimit = new NumericUpDown { Location = new Point(220, 60), Size = new Size(80, 25), DecimalPlaces = 1, Minimum = 0, Maximum = 9999 };

        lblAlarmState = new Label { Text = "정상", Location = new Point(10, 95), Size = new Size(310, 30),
            TextAlign = ContentAlignment.MiddleCenter, BackColor = Color.LightGray, Font = new Font("Segoe UI", 12, FontStyle.Bold) };

        gbAlarm.Controls.AddRange(new Control[] {
            chkAlarmEnabled, lblUpperLimit, nudUpperLimit, lblLowerLimit, nudLowerLimit, lblAlarmState
        });
        mainPanel.Controls.Add(gbAlarm);

        // gbLogging (X=1020, Y=520)
        gbLogging = new GroupBox { Text = "데이터 로깅", Location = new Point(1020, 520), Size = new Size(360, 140) };
        chkLoggingEnabled = new CheckBox { Text = "로깅 사용", Location = new Point(10, 25), Size = new Size(150, 25) };

        lblLoggingInterval = new Label { Text = "주기 (초):", Location = new Point(10, 60), Size = new Size(80, 25) };
        nudLoggingInterval = new NumericUpDown { Location = new Point(100, 60), Size = new Size(80, 25), Minimum = 1, Maximum = 60, Value = 5 };

        btnOpenLogFolder = new Button { Text = "로그 폴더 열기", Location = new Point(190, 60), Size = new Size(150, 25) };

        gbLogging.Controls.AddRange(new Control[] {
            chkLoggingEnabled, lblLoggingInterval, nudLoggingInterval, btnOpenLogFolder
        });
        mainPanel.Controls.Add(gbLogging);

        // ====== 진단 GroupBox (Y=670) ======
        gbDiagnostics = new GroupBox { Text = "진단 (Raw 프레임)", Location = new Point(10, 670), Size = new Size(1370, 200) };
        txtRawFrames = new TextBox { Location = new Point(10, 25), Size = new Size(1350, 140), Multiline = true,
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

        // 콤보박스 초기값
        foreach (var baudRate in new[] { 600, 1200, 2400, 4800, 9600, 19200, 38400 })
            cbBaudRate.Items.Add(baudRate);
        cbBaudRate.SelectedIndex = 6; // 38400 기본값
    }

    #endregion
}
