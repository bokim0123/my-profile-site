using System.Text.RegularExpressions;

namespace readLoadCell.Protocol
{
    public class CasProtocolParser : ICasFrameParser
    {
        // 추정 포맷: "ST,GS,+  1234.5,kg\r\n"
        // 필드: Status(ST/US), Mode(GS/NT), Sign+Weight, Unit
        // 실측 후 이 정규식/파싱 로직만 교체하면 됨

        private static readonly Regex EstimatedFormatRegex = new Regex(
            @"^(ST|US|US1|US2),\s*([A-Z]+),\s*([+\-]?\s*[\d.]+),\s*([A-Za-z]+)$",
            RegexOptions.Compiled
        );

        public bool TryParse(string rawFrame, out WeightReading reading, out string parseError)
        {
            reading = new WeightReading { RawFrame = rawFrame, Timestamp = DateTime.Now };
            parseError = string.Empty;

            if (string.IsNullOrWhiteSpace(rawFrame))
            {
                parseError = "Frame is empty";
                return false;
            }

            var trimmed = rawFrame.Trim();

            // 시도 1: 정규식 기반 파싱 (추정 포맷)
            var match = EstimatedFormatRegex.Match(trimmed);
            if (match.Success)
            {
                try
                {
                    var statusStr = match.Groups[1].Value;
                    var modeStr = match.Groups[2].Value;
                    var weightStr = match.Groups[3].Value.Replace(" ", "");
                    var unitStr = match.Groups[4].Value;

                    if (!decimal.TryParse(weightStr, out var weight))
                    {
                        parseError = $"Failed to parse weight: '{weightStr}'";
                        return false;
                    }

                    reading.IsStable = statusStr == "ST";
                    reading.Mode = modeStr;
                    reading.Weight = weight;
                    reading.Unit = unitStr;
                    return true;
                }
                catch (Exception ex)
                {
                    parseError = $"Exception during parsing: {ex.Message}";
                    return false;
                }
            }

            // 시도 2: 콤마 구분 간단 파싱 (형식이 약간 다른 경우)
            var parts = trimmed.Split(',');
            if (parts.Length >= 3)
            {
                try
                {
                    reading.IsStable = parts[0].Contains("ST");
                    reading.Mode = parts.Length > 1 ? parts[1].Trim() : "?";

                    var weightPart = parts[2].Trim();
                    weightPart = new Regex(@"[+\-]?\s*[\d.]+").Match(weightPart).Value.Replace(" ", "");

                    if (decimal.TryParse(weightPart, out var weight))
                    {
                        reading.Weight = weight;
                        if (parts.Length > 3)
                            reading.Unit = parts[3].Trim();
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    parseError = $"Fallback parsing failed: {ex.Message}";
                    return false;
                }
            }

            parseError = $"Unrecognized format: '{trimmed}'";
            return false;
        }
    }
}
