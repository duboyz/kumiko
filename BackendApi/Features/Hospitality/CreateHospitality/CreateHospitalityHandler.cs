using BackendApi.Extensions;
using BackendApi.Repositories;
using BackendApi.Shared.Contracts;
using BackendApi.Entities;

namespace BackendApi.Features.Hospitality.CreateHospitality;

public class CreateHospitalityHandler(
    IHospitalityRepository hospitalityRepository,
    IUserHospitalityRepository userHospitalityRepository,
    IHttpContextAccessor httpContextAccessor
) : ICommandHandler<CreateHospitalityCommand, CreateHospitalityResult>
{
    public async Task<CreateHospitalityResult> Handle(CreateHospitalityCommand request, CancellationToken cancellationToken)
    {
        var userId = httpContextAccessor.GetCurrentUserId();

        var hospitality = await hospitalityRepository.AddAsync(new Entities.Hospitality
        {
            Name = request.Name,
            Address = request.Address,
            City = request.City,
            State = request.State,
            Zip = request.Zip,
            Country = request.Country,
            Latitude = request.Latitude ?? string.Empty,
            Longitude = request.Longitude ?? string.Empty,
            GooglePlaceId = request.GooglePlaceId ?? string.Empty,
            Description = request.Description
        });

        // Create UserHospitality relationship with Owner role
        await userHospitalityRepository.AddAsync(new UserHospitality
        {
            UserId = userId,
            HospitalityId = hospitality.Id,
            Role = UserRole.Owner
        });

        await hospitalityRepository.SaveChangesAsync();

        return new CreateHospitalityResult(
            hospitality.Id,
            hospitality.Name,
            hospitality.Address,
            hospitality.City,
            hospitality.State,
            hospitality.Zip,
            hospitality.Country,
            hospitality.Description
        );
    }
}