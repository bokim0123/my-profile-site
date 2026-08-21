namespace readLoadCell.Alarm
{
    public enum AlarmState
    {
        Normal,
        OverUpperLimit,
        UnderLowerLimit,
        Unknown
    }

    public class AlarmEvaluator
    {
        public decimal UpperLimit { get; set; } = 100.0m;
        public decimal LowerLimit { get; set; } = 0.0m;
        public bool Enabled { get; set; } = false;

        public AlarmState Evaluate(decimal? weight)
        {
            if (!Enabled || weight == null)
                return AlarmState.Unknown;

            if (weight > UpperLimit)
                return AlarmState.OverUpperLimit;

            if (weight < LowerLimit)
                return AlarmState.UnderLowerLimit;

            return AlarmState.Normal;
        }

        public string GetAlarmMessage(AlarmState state, decimal? weight = null)
        {
            return state switch
            {
                AlarmState.Normal => "정상",
                AlarmState.OverUpperLimit => $"상한 초과 ({weight} / {UpperLimit})",
                AlarmState.UnderLowerLimit => $"하한 미달 ({weight} / {LowerLimit})",
                AlarmState.Unknown => "데이터 없음",
                _ => "알 수 없음"
            };
        }
    }
}
