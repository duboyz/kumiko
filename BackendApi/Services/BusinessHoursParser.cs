using System.Text.Json;
using System.Text.RegularExpressions;

namespace BackendApi.Services;

public class BusinessHoursParser
{
    private static readonly Dictionary<string, string> DayMapping = new()
    {
        { "monday", "monday" },
        { "tuesday", "tuesday" },
        { "wednesday", "wednesday" },
        { "thursday", "thursday" },
        { "friday", "friday" },
        { "saturday", "saturday" },
        { "sunday", "sunday" }
    };

    public static string? ParseBusinessHours(List<string> weekdayText)
    {
        if (weekdayText == null || !weekdayText.Any())
            return null;

        var parsedHours = new Dictionary<string, object?>();

        foreach (var dayText in weekdayText)
        {
            var (day, hours) = ParseDayHours(dayText);
            if (day != null)
            {
                parsedHours[day] = hours;
            }
        }

        return JsonSerializer.Serialize(parsedHours);
    }

    private static (string? day, object? hours) ParseDayHours(string dayText)
    {
        // Extract day name (case insensitive)
        var dayMatch = Regex.Match(dayText, @"^(\w+):", RegexOptions.IgnoreCase);
        if (!dayMatch.Success)
            return (null, null);

        var dayName = dayMatch.Groups[1].Value.ToLower();
        if (!DayMapping.ContainsKey(dayName))
            return (null, null);

        var day = DayMapping[dayName];

        // Check if closed
        if (dayText.Contains("Closed", StringComparison.OrdinalIgnoreCase))
        {
            return (day, null);
        }

        // Try to parse time range with AM/PM first (e.g., "11:00 AM – 8:00 PM")
        var timeMatchAMPM = Regex.Match(dayText, @"(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)", RegexOptions.IgnoreCase);
        if (timeMatchAMPM.Success)
        {
            var openHour = int.Parse(timeMatchAMPM.Groups[1].Value);
            var openMinute = int.Parse(timeMatchAMPM.Groups[2].Value);
            var openPeriod = timeMatchAMPM.Groups[3].Value.ToUpper();
            var closeHour = int.Parse(timeMatchAMPM.Groups[4].Value);
            var closeMinute = int.Parse(timeMatchAMPM.Groups[5].Value);
            var closePeriod = timeMatchAMPM.Groups[6].Value.ToUpper();

            // Convert to 24-hour format
            var openTime24 = ConvertTo24Hour(openHour, openMinute, openPeriod);
            var closeTime24 = ConvertTo24Hour(closeHour, closeMinute, closePeriod);

            return (day, new { open = openTime24, close = closeTime24 });
        }

        // Try to parse time range without AM/PM (e.g., "12:00 – 8:00 PM")
        var timeMatchNoAMPM = Regex.Match(dayText, @"(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)", RegexOptions.IgnoreCase);
        if (timeMatchNoAMPM.Success)
        {
            var openHour = int.Parse(timeMatchNoAMPM.Groups[1].Value);
            var openMinute = int.Parse(timeMatchNoAMPM.Groups[2].Value);
            var closeHour = int.Parse(timeMatchNoAMPM.Groups[3].Value);
            var closeMinute = int.Parse(timeMatchNoAMPM.Groups[4].Value);
            var closePeriod = timeMatchNoAMPM.Groups[5].Value.ToUpper();

            // Assume open time is in 24-hour format if no AM/PM
            var openTime24 = $"{openHour:D2}:{openMinute:D2}";
            var closeTime24 = ConvertTo24Hour(closeHour, closeMinute, closePeriod);

            return (day, new { open = openTime24, close = closeTime24 });
        }

        // Try to parse 24-hour format (e.g., "12:00 – 20:00")
        var timeMatch24Hour = Regex.Match(dayText, @"(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})", RegexOptions.IgnoreCase);
        if (timeMatch24Hour.Success)
        {
            var openHour = int.Parse(timeMatch24Hour.Groups[1].Value);
            var openMinute = int.Parse(timeMatch24Hour.Groups[2].Value);
            var closeHour = int.Parse(timeMatch24Hour.Groups[3].Value);
            var closeMinute = int.Parse(timeMatch24Hour.Groups[4].Value);

            var openTime24 = $"{openHour:D2}:{openMinute:D2}";
            var closeTime24 = $"{closeHour:D2}:{closeMinute:D2}";

            return (day, new { open = openTime24, close = closeTime24 });
        }

        return (day, null);
    }

    private static string ConvertTo24Hour(int hour, int minute, string period)
    {
        if (period == "AM")
        {
            if (hour == 12)
                hour = 0;
        }
        else if (period == "PM")
        {
            if (hour != 12)
                hour += 12;
        }

        return $"{hour:D2}:{minute:D2}";
    }

}
