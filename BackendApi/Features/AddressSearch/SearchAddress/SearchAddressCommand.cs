using BackendApi.Models.Address;
using BackendApi.Shared.Contracts;

namespace BackendApi.Features.AddressSearch.SearchAddress;

public record SearchAddressCommand(
    RequestSearchAddress Request
) : IQuery<SearchAddressResult>;

public record SearchAddressResult(
    List<ResponseAddressSearch> Addresses
);