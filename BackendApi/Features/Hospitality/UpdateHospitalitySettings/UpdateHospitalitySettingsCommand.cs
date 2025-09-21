using BackendApi.Entities;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Hospitality.UpdateHospitalitySettings;

public record UpdateHospitalitySettingsCommand(
    Guid HospitalityId,
    Currency Currency
) : ICommand;