using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Hospitality.CreateHospitality;

public record CreateHospitalityCommand(
    string Name,
    string Address,
    string City,
    string State,
    string Zip,
    string Country,
    string? Latitude = null,
    string? Longitude = null,
    string? GooglePlaceId = null,
    string? Description = null
) : ICommand<CreateHospitalityResult>;

public record CreateHospitalityResult(
    Guid HospitalityId,
    string Name,
    string Address,
    string City,
    string State,
    string Zip,
    string Country,
    string? Description
);