using BackendApi.Repositories;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Hospitality.UpdateHospitalitySettings;

public class UpdateHospitalitySettingsHandler(IHospitalityRepository hospitalityRepository) : ICommandHandler<UpdateHospitalitySettingsCommand>
{
    public async Task Handle(UpdateHospitalitySettingsCommand request, CancellationToken cancellationToken)
    {
        var hospitality = await hospitalityRepository.GetByIdAsync(request.HospitalityId);
        if (hospitality == null)
        {
            throw new KeyNotFoundException("Hospitality not found");
        }

        hospitality.Currency = request.Currency;
        hospitality.UpdatedAt = DateTime.UtcNow;
        await hospitalityRepository.UpdateAsync(hospitality);
    }
}