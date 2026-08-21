namespace readLoadCell.Testing
{
    public class TestResult
    {
        public decimal Max { get; init; }
        public decimal Min { get; init; }
        public decimal Avg { get; init; }
        public int SampleCount { get; init; }
        public double DurationSeconds { get; init; }
        public bool Passed { get; init; }
        public string FailReason { get; init; } = string.Empty;
    }
}
