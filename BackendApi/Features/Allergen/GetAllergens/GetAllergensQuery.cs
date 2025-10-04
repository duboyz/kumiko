using BackendApi.Shared.Contracts;

namespace BackendApi.Features.Allergen.GetAllergens;

public record GetAllergensQuery() : IQuery<GetAllergensResult>;

public record GetAllergensResult(List<AllergenDto> Allergens);

public record AllergenDto(
    Guid Id,
    string Name,
    string Description
);

