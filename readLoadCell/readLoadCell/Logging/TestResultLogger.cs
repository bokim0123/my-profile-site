using System;
using System.IO;
using readLoadCell.Testing;

namespace readLoadCell.Logging
{
    public static class TestResultLogger
    {
        private static readonly object _lockObj = new object();

        public static void Log(TestSession session, TestResult result)
        {
            try
            {
                lock (_lockObj)
                {
                    var dir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!Directory.Exists(dir))
                        Directory.CreateDirectory(dir);

                    var file = Path.Combine(dir, $"testresults_{DateTime.Now:yyyyMMdd}.csv");
                    var isNew = !File.Exists(file);

                    using (var writer = new StreamWriter(file, append: true))
                    {
                        if (isNew)
                            writer.WriteLine("Timestamp,Customer,Product,LotNumber,Operator,Max,Min,Avg,SampleCount,DurationSeconds,Result");

                        writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss}," +
                            $"{EscapeCsv(session.Customer)}," +
                            $"{EscapeCsv(session.Product)}," +
                            $"{EscapeCsv(session.LotNumber)}," +
                            $"{EscapeCsv(session.Operator)}," +
                            $"{result.Max:F2}," +
                            $"{result.Min:F2}," +
                            $"{result.Avg:F2}," +
                            $"{result.SampleCount}," +
                            $"{result.DurationSeconds:F1}," +
                            $"{(result.Passed ? "Pass" : "Fail")}");
                    }
                }
            }
            catch (Exception ex)
            {
                AppLogger.Error("테스트 결과 로깅 실패", ex);
            }
        }

        private static string EscapeCsv(string value)
        {
            if (string.IsNullOrEmpty(value))
                return string.Empty;

            if (value.Contains(",") || value.Contains("\"") || value.Contains("\n"))
                return $"\"{value.Replace("\"", "\"\"")}\"";

            return value;
        }
    }
}
