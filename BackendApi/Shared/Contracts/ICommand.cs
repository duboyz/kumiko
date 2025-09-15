using MediatR;

namespace BackendApi.Shared.Contracts;

/// <summary>
/// Marker interface for commands that perform operations with side effects
/// </summary>
/// <typeparam name="TResult">The type of result returned by the command</typeparam>
public interface ICommand<out TResult> : IRequest<TResult>
{
}

/// <summary>
/// Marker interface for commands that don't return data
/// </summary>
public interface ICommand : IRequest
{
}
