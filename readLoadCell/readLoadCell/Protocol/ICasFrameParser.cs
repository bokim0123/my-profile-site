namespace readLoadCell.Protocol
{
    public interface ICasFrameParser
    {
        bool TryParse(string rawFrame, out WeightReading reading, out string parseError);
    }
}
