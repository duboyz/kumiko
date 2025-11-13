using BackendApi.Models.Address;
using BackendApi.Shared.Contracts;
using BackendApi.Services;
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
            var textSearchUrl = $"{TextSearchUrl}?query={Uri.EscapeDataString(request.Query)}&key={apiKey}&languageCode=no&region=no&types=establishment";

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
            var detailsUrl = $"{DetailsUrl}?place_id={placeId}&fields=place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,business_status,types,rating,user_ratings_total,price_level,vicinity,opening_hours,geometry,photos,reviews,address_components&key={apiKey}";

            var response = await httpClient.GetAsync(detailsUrl);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            logger.LogDebug("Business details response for {PlaceId}: {Response}", placeId, json.Substring(0, Math.Min(500, json.Length)));

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            var detailsResponse = JsonSerializer.Deserialize<GoogleBusinessDetailsResponse>(json, options);

            if (detailsResponse?.Result != null)
            {
                var business = detailsResponse.Result;
                
                // Parse address components
                var addressDetails = ParseAddressComponents(business.AddressComponents);
                
                // Parse business hours if available
                string? parsedBusinessHours = null;
                if (business.OpeningHours?.WeekdayText != null && business.OpeningHours.WeekdayText.Any())
                {
                    logger.LogInformation("Parsing business hours for {PlaceId}", placeId);
                    parsedBusinessHours = BusinessHoursParser.ParseBusinessHours(business.OpeningHours.WeekdayText);
                    logger.LogInformation("Parsed business hours: {ParsedHours}", parsedBusinessHours);
                }
                
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
                    ParsedBusinessHours = parsedBusinessHours,
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
                    }).ToList() ?? new List<BusinessReview>(),
                    // Parsed address components
                    Street = addressDetails.Street,
                    City = addressDetails.City,
                    State = addressDetails.State,
                    PostalCode = addressDetails.PostalCode,
                    Country = addressDetails.Country
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

    private AddressDetails ParseAddressComponents(List<GoogleAddressComponent>? addressComponents)
    {
        var streetNumber = "";
        var streetName = "";
        var postalCode = "";
        var locality = "";
        var postalTown = "";
        var sublocalityLevel1 = "";
        var sublocality = "";
        var adminLevel2 = "";
        var state = "";
        var country = "";

        if (addressComponents != null)
        {
            logger.LogDebug("Parsing address components");
            
            // First pass: collect all components
            foreach (var component in addressComponents)
            {
                var types = component.Types ?? new List<string>();
                var longName = component.LongName ?? "";
                var shortName = component.ShortName ?? "";

                logger.LogDebug("  Types: {Types}, Long: {LongName}, Short: {ShortName}", 
                    string.Join(", ", types), longName, shortName);

                if (types.Contains("street_number"))
                {
                    streetNumber = longName;
                }
                else if (types.Contains("route"))
                {
                    streetName = longName;
                }
                else if (types.Contains("postal_code"))
                {
                    postalCode = longName;
                }
                else if (types.Contains("postal_town"))
                {
                    postalTown = longName;
                }
                else if (types.Contains("locality"))
                {
                    locality = longName;
                }
                else if (types.Contains("sublocality_level_1"))
                {
                    sublocalityLevel1 = longName;
                }
                else if (types.Contains("sublocality"))
                {
                    sublocality = longName;
                }
                else if (types.Contains("administrative_area_level_2"))
                {
                    adminLevel2 = longName;
                }
                else if (types.Contains("administrative_area_level_1"))
                {
                    state = longName;
                }
                else if (types.Contains("country"))
                {
                    country = longName;
                }
            }

            // Determine city with proper priority
            // Priority: postal_town > locality > administrative_area_level_2 > sublocality_level_1 > sublocality
            var city = "";
            if (!string.IsNullOrEmpty(postalTown))
            {
                city = postalTown;
            }
            else if (!string.IsNullOrEmpty(locality))
            {
                city = locality;
            }
            else if (!string.IsNullOrEmpty(adminLevel2))
            {
                city = adminLevel2;
            }
            else if (!string.IsNullOrEmpty(sublocalityLevel1))
            {
                city = sublocalityLevel1;
            }
            else if (!string.IsNullOrEmpty(sublocality))
            {
                city = sublocality;
            }

            logger.LogDebug("City candidates - PostalTown: '{PostalTown}', Locality: '{Locality}', AdminLevel2: '{AdminLevel2}', Sublocality1: '{Sublocality1}', Sublocality: '{Sublocality}' -> Selected: '{City}'",
                postalTown, locality, adminLevel2, sublocalityLevel1, sublocality, city);

            logger.LogDebug("Final mapping - Street: '{StreetName} {StreetNumber}', City: '{City}', State: '{State}', PostalCode: '{PostalCode}', Country: '{Country}'",
                streetName, streetNumber, city, state, postalCode, country);

            // Combine street name and number
            var street = streetName;
            if (!string.IsNullOrEmpty(streetNumber))
            {
                street = $"{streetName} {streetNumber}";
            }

            return new AddressDetails
            {
                Street = street,
                City = city,
                State = state,
                PostalCode = postalCode,
                Country = country
            };
        }

        return new AddressDetails();
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

        [JsonPropertyName("address_components")]
        public List<GoogleAddressComponent>? AddressComponents { get; set; }
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

    private class GoogleAddressComponent
    {
        [JsonPropertyName("long_name")]
        public string LongName { get; set; } = string.Empty;

        [JsonPropertyName("short_name")]
        public string ShortName { get; set; } = string.Empty;

        [JsonPropertyName("types")]
        public List<string> Types { get; set; } = new();
    }

    private class AddressDetails
    {
        public string Street { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string PostalCode { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
    }
}
