using System.IO.Ports;
using System.Text.Json;
using readLoadCell.Logging;

namespace readLoadCell.Settings
{
    public class AppSettings
    {
        private static readonly string SettingsPath = Path.Combine(
            AppDomain.CurrentDomain.BaseDirectory,
            "appsettings.json"
        );

        public string PortName { get; set; } = "COM1";
        public int BaudRate { get; set; } = 38400;
        public int DataBits { get; set; } = 8;
        public StopBits StopBits { get; set; } = StopBits.One;
        public Parity Parity { get; set; } = Parity.None;

        public decimal AlarmUpperLimit { get; set; } = 100.0m;
        public decimal AlarmLowerLimit { get; set; } = 0.0m;
        public bool AlarmEnabled { get; set; } = false;

        public int LoggingIntervalSeconds { get; set; } = 5;
        public bool LoggingEnabled { get; set; } = false;
        public bool RawFrameLoggingEnabled { get; set; } = true;

        public static AppSettings Load()
        {
            var settings = new AppSettings();

            try
            {
                if (!File.Exists(SettingsPath))
                {
                    AppLogger.Info("appsettings.json 파일이 없어서 기본값 사용");
                    return settings;
                }

                var json = File.ReadAllText(SettingsPath);
                using var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                // SerialPort 설정
                if (root.TryGetProperty("SerialPort", out var spElement))
                {
                    if (spElement.TryGetProperty("PortName", out var portNameElement))
                        settings.PortName = portNameElement.GetString() ?? "COM1";

                    if (spElement.TryGetProperty("BaudRate", out var baudRateElement) &&
                        baudRateElement.TryGetInt32(out var baudRate))
                        settings.BaudRate = baudRate;

                    if (spElement.TryGetProperty("DataBits", out var dataBitsElement) &&
                        dataBitsElement.TryGetInt32(out var dataBits))
                        settings.DataBits = dataBits;
                }

                // Alarm 설정
                if (root.TryGetProperty("Alarm", out var alarmElement))
                {
                    if (alarmElement.TryGetProperty("Enabled", out var enabledElement))
                        settings.AlarmEnabled = enabledElement.GetBoolean();

                    if (alarmElement.TryGetProperty("UpperLimit", out var upperElement))
                        settings.AlarmUpperLimit = (decimal)upperElement.GetDouble();

                    if (alarmElement.TryGetProperty("LowerLimit", out var lowerElement))
                        settings.AlarmLowerLimit = (decimal)lowerElement.GetDouble();
                }

                // Logging 설정
                if (root.TryGetProperty("Logging", out var loggingElement))
                {
                    if (loggingElement.TryGetProperty("Enabled", out var logEnabledElement))
                        settings.LoggingEnabled = logEnabledElement.GetBoolean();

                    if (loggingElement.TryGetProperty("IntervalSeconds", out var intervalElement) &&
                        intervalElement.TryGetInt32(out var interval))
                        settings.LoggingIntervalSeconds = interval;

                    if (loggingElement.TryGetProperty("RawFrameLoggingEnabled", out var rawElement))
                        settings.RawFrameLoggingEnabled = rawElement.GetBoolean();
                }

                AppLogger.Info("appsettings.json 로드 완료");
            }
            catch (Exception ex)
            {
                AppLogger.Error("설정 로드 중 오류, 기본값 사용", ex);
            }

            return settings;
        }

        public void Save()
        {
            try
            {
                var settings = new
                {
                    SerialPort = new
                    {
                        PortName,
                        BaudRate,
                        DataBits,
                        StopBits = "1",
                        Parity = "None"
                    },
                    Alarm = new
                    {
                        Enabled = AlarmEnabled,
                        UpperLimit = AlarmUpperLimit,
                        LowerLimit = AlarmLowerLimit
                    },
                    Logging = new
                    {
                        Enabled = LoggingEnabled,
                        IntervalSeconds = LoggingIntervalSeconds,
                        RawFrameLoggingEnabled
                    }
                };

                var options = new JsonSerializerOptions { WriteIndented = true };
                var json = JsonSerializer.Serialize(settings, options);
                File.WriteAllText(SettingsPath, json);

                AppLogger.Info("설정 저장 완료");
            }
            catch (Exception ex)
            {
                AppLogger.Error("설정 저장 실패", ex);
            }
        }
    }
}
