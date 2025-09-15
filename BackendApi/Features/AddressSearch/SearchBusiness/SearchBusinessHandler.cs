using BackendApi.Models.Address;
using BackendApi.Shared.Contracts;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace BackendApi.Features.AddressSearch.SearchBusiness;

public class SearchBusinessHandler(
    HttpClient httpClient,
    IConfiguration configuration,
    ILogger<SearchBusinessHandler> logger) : IQueryHandler<SearchBusinessCommand, SearchBusinessResult>
{
    private const string TextSearchUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json";
    private const string DetailsUrl = "https://maps.googleapis.com/maps/api/place/details/json";
    private const string NearbySearchUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

    public async Task<SearchBusinessResult> Handle(SearchBusinessCommand request, CancellationToken cancellationToken)
    {
        var results = await SearchBusinessAsync(request.Request);
        return new SearchBusinessResult(results);
    }

    private async Task<List<ResponseBusinessDetails>> SearchBusinessAsync(RequestSearchAddress request)
    {
        logger.LogInformation("Searching for business: {Query}", request.Query);

        var apiKey = configuration["GooglePlaces:ApiKey"];
        if (string.IsNullOrEmpty(apiKey))
        {
            throw new InvalidOperationException("Google Places API key not configured");
        }

        if (string.IsNullOrWhiteSpace(request.Query) || request.Query.Length < 2)
        {
            return new List<ResponseBusinessDetails>();
        }

        try
        {
            // Use Text Search API to find businesses
            var textSearchUrl = $"{TextSearchUrl}?query={Uri.EscapeDataString(request.Query)}&key={apiKey}&language=no&region=no&types=establishment";

            var response = await httpClient.GetAsync(textSearchUrl);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            logger.LogInformation("Google Places Text Search response: {Response}", json.Substring(0, Math.Min(500, json.Length)));

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var textSearchResponse = JsonSerializer.Deserialize<GoogleTextSearchResponse>(json, options);

            var results = new List<ResponseBusinessDetails>();

            if (textSearchResponse?.Results != null && textSearchResponse.Results.Any())
            {
                logger.LogInformation("Text search found {Count} results", textSearchResponse.Results.Count);

                foreach (var business in textSearchResponse.Results.Take(request.Limit))
                {
                    // Get detailed information about the business
                    var businessDetails = await GetBusinessDetailsAsync(business.PlaceId, apiKey);
                    if (businessDetails != null)
                    {
                        results.Add(businessDetails);
                    }
                }
            }
            else
            {
                logger.LogWarning("No businesses found from Google Places API for query: {Query}", request.Query);
            }

            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error searching for business: {Query}", request.Query);
            return new List<ResponseBusinessDetails>();
        }
    }

    private async Task<ResponseBusinessDetails?> GetBusinessDetailsAsync(string placeId, string apiKey)
    {
        try
        {
            var detailsUrl = $"{DetailsUrl}?place_id={placeId}&fields=place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,business_status,types,rating,user_ratings_total,price_level,vicinity,opening_hours,geometry,photos,reviews&key={apiKey}";

            var response = await httpClient.GetAsync(detailsUrl);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            logger.LogDebug("Business details response for {PlaceId}: {Response}", placeId, json.Substring(0, Math.Min(500, json.Length)));

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsResponse = JsonSerializer.Deserialize<GoogleBusinessDetailsResponse>(json, options);

            if (detailsResponse?.Result != null)
            {
                var business = detailsResponse.Result;
                return new ResponseBusinessDetails
                {
                    PlaceId = business.PlaceId,
                    Name = business.Name,
                    FormattedAddress = business.FormattedAddress,
                    FormattedPhoneNumber = business.FormattedPhoneNumber ?? string.Empty,
                    InternationalPhoneNumber = business.InternationalPhoneNumber ?? string.Empty,
                    Website = business.Website ?? string.Empty,
                    BusinessStatus = business.BusinessStatus ?? string.Empty,
                    Types = business.Types ?? new List<string>(),
                    Rating = business.Rating,
                    UserRatingsTotal = business.UserRatingsTotal,
                    PriceLevel = business.PriceLevel,
                    Vicinity = business.Vicinity ?? string.Empty,
                    OpeningHours = business.OpeningHours != null ? new BusinessOpeningHours
                    {
                        OpenNow = business.OpeningHours.OpenNow,
                        WeekdayText = business.OpeningHours.WeekdayText ?? new List<string>()
                    } : null,
                    Geometry = business.Geometry != null ? new BusinessGeometry
                    {
                        Location = new BusinessLocation
                        {
                            Lat = business.Geometry.Location.Lat,
                            Lng = business.Geometry.Location.Lng
                        }
                    } : new BusinessGeometry(),
                    Photos = business.Photos?.Select(p => new BusinessPhoto
                    {
                        PhotoReference = p.PhotoReference,
                        Height = p.Height,
                        Width = p.Width
                    }).ToList() ?? new List<BusinessPhoto>(),
                    Reviews = business.Reviews?.Select(r => new BusinessReview
                    {
                        AuthorName = r.AuthorName,
                        Rating = r.Rating,
                        Text = r.Text,
                        Time = r.Time
                    }).ToList() ?? new List<BusinessReview>()
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting business details for place_id: {PlaceId}", placeId);
            return null;
        }
    }

    // DTOs for Google Places API responses
    private class GoogleTextSearchResponse
    {
        [JsonPropertyName("results")]
        public List<GoogleTextSearchResult> Results { get; set; } = new();

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
    }

    private class GoogleTextSearchResult
    {
        [JsonPropertyName("place_id")]
        public string PlaceId { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("formatted_address")]
        public string FormattedAddress { get; set; } = string.Empty;

        [JsonPropertyName("vicinity")]
        public string Vicinity { get; set; } = string.Empty;

        [JsonPropertyName("types")]
        public List<string> Types { get; set; } = new();
    }

    private class GoogleBusinessDetailsResponse
    {
        [JsonPropertyName("result")]
        public GoogleBusinessDetails? Result { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;
    }

    private class GoogleBusinessDetails
    {
        [JsonPropertyName("place_id")]
        public string PlaceId { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("formatted_address")]
        public string FormattedAddress { get; set; } = string.Empty;

        [JsonPropertyName("formatted_phone_number")]
        public string? FormattedPhoneNumber { get; set; }

        [JsonPropertyName("international_phone_number")]
        public string? InternationalPhoneNumber { get; set; }

        [JsonPropertyName("website")]
        public string? Website { get; set; }

        [JsonPropertyName("business_status")]
        public string? BusinessStatus { get; set; }

        [JsonPropertyName("types")]
        public List<string>? Types { get; set; }

        [JsonPropertyName("rating")]
        public double? Rating { get; set; }

        [JsonPropertyName("user_ratings_total")]
        public int? UserRatingsTotal { get; set; }

        [JsonPropertyName("price_level")]
        public int? PriceLevel { get; set; }

        [JsonPropertyName("vicinity")]
        public string? Vicinity { get; set; }

        [JsonPropertyName("opening_hours")]
        public GoogleOpeningHours? OpeningHours { get; set; }

        [JsonPropertyName("geometry")]
        public GoogleBusinessGeometry? Geometry { get; set; }

        [JsonPropertyName("photos")]
        public List<GooglePhoto>? Photos { get; set; }

        [JsonPropertyName("reviews")]
        public List<GoogleReview>? Reviews { get; set; }
    }

    private class GoogleOpeningHours
    {
        [JsonPropertyName("open_now")]
        public bool OpenNow { get; set; }

        [JsonPropertyName("weekday_text")]
        public List<string>? WeekdayText { get; set; }
    }

    private class GoogleBusinessGeometry
    {
        [JsonPropertyName("location")]
        public GoogleLocation Location { get; set; } = new();
    }

    private class GoogleLocation
    {
        [JsonPropertyName("lat")]
        public double Lat { get; set; }

        [JsonPropertyName("lng")]
        public double Lng { get; set; }
    }

    private class GooglePhoto
    {
        [JsonPropertyName("photo_reference")]
        public string PhotoReference { get; set; } = string.Empty;

        [JsonPropertyName("height")]
        public int Height { get; set; }

        [JsonPropertyName("width")]
        public int Width { get; set; }
    }

    private class GoogleReview
    {
        [JsonPropertyName("author_name")]
        public string AuthorName { get; set; } = string.Empty;

        [JsonPropertyName("rating")]
        public int Rating { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;

        [JsonPropertyName("time")]
        public long Time { get; set; }
    }
}
