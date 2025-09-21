using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Hospitality.GetUserHospitalities;

public class GetUserHospitalitiesHandler(
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor) : IQueryHandler<GetUserHospitalitiesQuery, GetUserHospitalitiesResult>
{
    public async Task<GetUserHospitalitiesResult> Handle(GetUserHospitalitiesQuery request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        var userHospitalities = await userHospitalityRepository.FindAsync(uh => uh.UserId == userId);

        var hospitalities = userHospitalities
            .Where(uh => uh.Hospitality != null)
            .Select(uh => new UserHospitalityDto(
                new HospitalityBaseDto(
                    uh.Hospitality!.Id,
                    uh.Hospitality.Name,
                    uh.Hospitality.Address,
                    uh.Hospitality.City,
                    uh.Hospitality.State,
                    uh.Hospitality.Zip,
                    uh.Hospitality.Country,
                    uh.Hospitality.Description,
                    uh.Hospitality.Currency
                ),
                uh.Role.ToString()
            )).ToList();

        return new GetUserHospitalitiesResult(hospitalities);
    }
}