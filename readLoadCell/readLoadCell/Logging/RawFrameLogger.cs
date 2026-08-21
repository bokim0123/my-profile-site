namespace readLoadCell.Logging
{
    public static class RawFrameLogger
    {
        private static readonly string LogDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
        private static readonly object LockObj = new object();

        static RawFrameLogger()
        {
            if (!Directory.Exists(LogDirectory))
                Directory.CreateDirectory(LogDirectory);
        }

        public static void Append(string rawFrame)
        {
            try
            {
                lock (LockObj)
                {
                    var logFile = Path.Combine(LogDirectory, $"rawlog_{DateTime.Now:yyyyMMdd}.txt");
                    var logEntry = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {rawFrame}";

                    File.AppendAllText(logFile, logEntry + Environment.NewLine);
                }
            }
            catch
            {
                // Raw 로그 실패도 조용히 무시
            }
        }
    }
}
