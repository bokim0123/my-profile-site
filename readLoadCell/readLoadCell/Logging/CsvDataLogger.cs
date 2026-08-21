using readLoadCell.Alarm;
using readLoadCell.Protocol;

namespace readLoadCell.Logging
{
    public class CsvDataLogger : IDisposable
    {
        private readonly string _logDirectory;
        private DateTime _lastLogTime = DateTime.MinValue;
        private readonly int _intervalSeconds;
        private readonly object _lockObj = new object();

        public CsvDataLogger(int intervalSeconds = 5)
        {
            _intervalSeconds = intervalSeconds;
            _logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");

            if (!Directory.Exists(_logDirectory))
                Directory.CreateDirectory(_logDirectory);
        }

        public void LogIfDue(WeightReading reading, AlarmState alarmState)
        {
            if (reading == null)
                return;

            var now = DateTime.Now;
            if ((now - _lastLogTime).TotalSeconds < _intervalSeconds)
                return;

            _lastLogTime = now;
            Log(reading, alarmState);
        }

        private void Log(WeightReading reading, AlarmState alarmState)
        {
            try
            {
                lock (_lockObj)
                {
                    var logFile = Path.Combine(_logDirectory, $"weightlog_{DateTime.Now:yyyyMMdd}.csv");
                    var isNewFile = !File.Exists(logFile);

                    using (var writer = new StreamWriter(logFile, append: true))
                    {
                        if (isNewFile)
                        {
                            writer.WriteLine("Timestamp,RawWeight,Unit,Mode,IsStable,AlarmState,RawFrame");
                        }

                        var escapedFrame = EscapeCsvField(reading.RawFrame);
                        var logEntry = $"{reading.Timestamp:yyyy-MM-dd HH:mm:ss.fff}," +
                                      $"{reading.Weight}," +
                                      $"{reading.Unit}," +
                                      $"{reading.Mode}," +
                                      $"{reading.IsStable}," +
                                      $"{alarmState}," +
                                      $"{escapedFrame}";

                        writer.WriteLine(logEntry);
                    }
                }
            }
            catch (Exception ex)
            {
                AppLogger.Error("CSV 로깅 실패", ex);
            }
        }

        private static string EscapeCsvField(string field)
        {
            if (string.IsNullOrEmpty(field))
                return "\"\"";

            if (field.Contains(",") || field.Contains("\"") || field.Contains("\n"))
            {
                return $"\"{field.Replace("\"", "\"\"")}\"";
            }

            return field;
        }

        public void Dispose()
        {
            // 리소스 정리 필요 시
        }
    }
}
