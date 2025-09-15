namespace BackendApi.Shared.Results;

/// <summary>
/// Represents the result of an operation that can succeed or fail
/// </summary>
public class Result
{
    protected Result(bool isSuccess, string? error = null)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string? Error { get; }

    public static Result Success() => new(true);
    public static Result Failure(string error) => new(false, error);

    public static Result<T> Success<T>(T data) => new(true, data);
    public static Result<T> Failure<T>(string error) => new(false, default, error);
}

/// <summary>
/// Represents the result of an operation that can succeed or fail and returns data
/// </summary>
/// <typeparam name="T">The type of data returned on success</typeparam>
public class Result<T> : Result
{
    internal Result(bool isSuccess, T? data, string? error = null) : base(isSuccess, error)
    {
        Data = data;
    }

    public T? Data { get; }
}
