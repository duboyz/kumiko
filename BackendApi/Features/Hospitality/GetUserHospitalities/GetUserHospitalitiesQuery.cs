using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Hospitality.GetUserHospitalities;

public record GetUserHospitalitiesQuery() : IQuery<GetUserHospitalitiesResult>;

public record GetUserHospitalitiesResult(List<UserHospitalityDto> Hospitalities);

public record UserHospitalityDto(
    HospitalityBaseDto Hospitality,
    string Role
);

public record HospitalityBaseDto(
    Guid Id,
    string Name,
    string Address,
    string City,
    string State,
    string Zip,
    string Country,
    string? Description
);