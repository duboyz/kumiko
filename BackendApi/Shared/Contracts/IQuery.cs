using MediatR;

namespace BackendApi.Shared.Contracts;

/// <summary>
/// Marker interface for queries that return data without side effects
/// </summary>
/// <typeparam name="TResult">The type of result returned by the query</typeparam>
public interface IQuery<out TResult> : IRequest<TResult> { }
