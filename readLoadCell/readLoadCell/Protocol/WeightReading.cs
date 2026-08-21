namespace readLoadCell.Protocol
{
    public class WeightReading
    {
        public DateTime Timestamp { get; set; }
        public decimal Weight { get; set; }
        public string Unit { get; set; } = string.Empty;
        public bool IsStable { get; set; }
        public string Mode { get; set; } = string.Empty;  // GS (Gross) / NT (Net)
        public string RawFrame { get; set; } = string.Empty;

        public override string ToString()
        {
            return $"[{Timestamp:HH:mm:ss.fff}] {Weight} {Unit} ({Mode}) Stable={IsStable}";
        }
    }
}
