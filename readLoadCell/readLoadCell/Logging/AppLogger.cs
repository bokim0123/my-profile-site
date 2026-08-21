namespace readLoadCell.Logging
{
    public static class AppLogger
    {
        private static readonly string LogDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
        private static readonly object LockObj = new object();

        static AppLogger()
        {
            if (!Directory.Exists(LogDirectory))
                Directory.CreateDirectory(LogDirectory);
        }

        public static void Info(string message)
        {
            Log("INFO", message);
        }

        public static void Error(string message, Exception? ex = null)
        {
            var fullMessage = ex != null ? $"{message} | {ex.Message}" : message;
            Log("ERROR", fullMessage);
        }

        public static void Warning(string message)
        {
            Log("WARN", message);
        }

        private static void Log(string level, string message)
        {
            try
            {
                lock (LockObj)
                {
                    var logFile = Path.Combine(LogDirectory, $"app_{DateTime.Now:yyyyMMdd}.log");
                    var logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] [{level}] {message}";

                    File.AppendAllText(logFile, logEntry + Environment.NewLine);
                }
            }
            catch
            {
                // Logging 실패는 조용히 무시 (앱이 죽으면 안 됨)
            }
        }
    }
}
