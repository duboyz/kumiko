using BackendApi.Models.Address;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.AddressSearch.SearchBusiness;

public record SearchBusinessCommand(
    RequestSearchAddress Request
) : IQuery<SearchBusinessResult>;

public record SearchBusinessResult(
    List<ResponseBusinessDetails> Businesses
);
