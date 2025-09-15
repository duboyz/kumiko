# Backend API - Vertical Slice Architecture

This document outlines the vertical slice architecture implemented in this backend API project, providing a solid foundation for scalable development.

## 🏗️ Architecture Overview

This project uses **Vertical Slice Architecture** with **CQRS (Command Query Responsibility Segregation)** patterns, organized around business features rather than technical layers.

### Key Principles

1. **Feature-First Organization**: Code is organized by business features, not technical layers
2. **Clear Separation**: Commands (write operations) and Queries (read operations) are distinct
3. **Explicit Contracts**: Strong typing with clear interfaces and result patterns
4. **Consistent Error Handling**: Standardized result types and error responses
5. **Minimal Coupling**: Each feature is self-contained with minimal dependencies

## 📁 Project Structure

```
BackendApi/
├── Shared/                     # Cross-cutting concerns
│   ├── Contracts/             # Base interfaces
│   ├── Controllers/           # Base controller classes
│   └── Results/              # Result pattern implementation
├── Features/                  # Business features (vertical slices)
│   ├── Auth/
│   │   ├── Login/            # Login feature
│   │   ├── Register/         # Registration feature
│   │   ├── Logout/           # Logout feature
│   │   └── Me/              # Get current user feature
│   ├── User/
│   │   └── UpdateUser/      # Update user feature
│   └── AddressSearch/
│       ├── SearchAddress/   # Address search feature
│       └── SearchBusiness/  # Business search feature
├── Models/                   # Shared DTOs and models
├── Entities/                 # Domain entities
├── Repositories/             # Data access layer
└── Services/                 # Infrastructure services
```

## 🔧 Core Components

### 1. Shared Contracts

#### Base Interfaces
- **`IQuery<TResult>`**: Marker interface for read operations
- **`ICommand<TResult>`**: Marker interface for write operations with results
- **`ICommand`**: Marker interface for write operations without results
- **`IQueryHandler<TQuery, TResult>`**: Handler interface for queries
- **`ICommandHandler<TCommand, TResult>`**: Handler interface for commands

#### Result Pattern
```csharp
// Success result
var result = Result.Success(data);

// Failure result
var result = Result.Failure<DataType>("Error message");

// Check result
if (result.IsSuccess)
{
    // Use result.Data
}
else
{
    // Handle result.Error
}
```

### 2. Feature Structure

Each feature follows this consistent structure:

```
FeatureName/
├── FeatureCommand.cs     # Command/Query + Result definitions
├── FeatureHandler.cs     # Business logic implementation
└── FeatureController.cs  # HTTP endpoint
```

#### Example: Login Feature

**LoginCommand.cs**
```csharp
public record LoginCommand(
    string Email,
    string Password,
    ClientType? ClientType = ClientType.Web
) : ICommand<Result<LoginResult>>;

public record LoginResult(
    string? AccessToken,
    string? RefreshToken,
    DateTime? ExpiresAt
);
```

**LoginHandler.cs**
```csharp
public class LoginHandler : ICommandHandler<LoginCommand, Result<LoginResult>>
{
    public async Task<Result<LoginResult>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        // Business logic here
        return Result.Success(new LoginResult(...));
    }
}
```

**LoginController.cs**
```csharp
[Route("/api/auth")]
public class LoginController : BaseController
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResult>>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand(request.Email, request.Password, request.ClientType);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Login successful");
    }
}
```

### 3. Base Controller

The `BaseController` provides consistent response handling:

```csharp
// Automatically handles Result<T> to ApiResponse<T> conversion
return CreateResponse(result, ApiResponseStatusCode.Success, "Success message");
```

Features:
- Automatic error status code mapping
- Consistent response format
- Built-in error handling

## 🚀 Adding New Features

Follow these steps to add a new feature:

### 1. Create Feature Directory
```
Features/
└── YourFeature/
    └── DoSomething/
```

### 2. Define Command/Query and Result
```csharp
// For write operations (Commands)
public record DoSomethingCommand(
    string Parameter
) : ICommand<Result<DoSomethingResult>>;

// For read operations (Queries)
public record GetSomethingQuery(
    Guid Id
) : IQuery<Result<GetSomethingResult>>;

public record DoSomethingResult(
    string Value,
    DateTime Timestamp
);
```

### 3. Implement Handler
```csharp
public class DoSomethingHandler : ICommandHandler<DoSomethingCommand, Result<DoSomethingResult>>
{
    // Inject dependencies via constructor
    public DoSomethingHandler(IDependency dependency) { }

    public async Task<Result<DoSomethingResult>> Handle(DoSomethingCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Business logic here
            var result = new DoSomethingResult("value", DateTime.UtcNow);
            return Result.Success(result);
        }
        catch (Exception ex)
        {
            return Result.Failure<DoSomethingResult>(ex.Message);
        }
    }
}
```

### 4. Create Controller
```csharp
[Route("/api/your-feature")]
public class DoSomethingController : BaseController
{
    public DoSomethingController(IMediator mediator) : base(mediator) { }

    [HttpPost("do-something")]
    public async Task<ActionResult<ApiResponse<DoSomethingResult>>> DoSomething([FromBody] DoSomethingRequest request)
    {
        var command = new DoSomethingCommand(request.Parameter);
        var result = await Mediator.Send(command);
        return CreateResponse(result, ApiResponseStatusCode.Success, "Operation completed");
    }
}

public record DoSomethingRequest(string Parameter);
```

## 📋 Naming Conventions

### ✅ Do Use
- **Commands**: `{Verb}{Noun}Command` (e.g., `CreateUserCommand`, `UpdateOrderCommand`)
- **Queries**: `{Get|Find|Search}{Noun}Query` (e.g., `GetUserQuery`, `SearchOrdersQuery`)
- **Results**: `{Feature}Result` (e.g., `LoginResult`, `CreateUserResult`)
- **Handlers**: `{Feature}Handler` (e.g., `LoginHandler`, `CreateUserHandler`)
- **Controllers**: `{Feature}Controller` (e.g., `LoginController`, `CreateUserController`)
- **Requests**: `{Feature}Request` (e.g., `LoginRequest`, `CreateUserRequest`)

### ❌ Don't Use
- ~~`LoginRdto`, `UserSdto`~~ (Old naming convention)
- ~~Generic names like `Handler`, `Controller`~~
- ~~Technical suffixes like `Service`, `Manager` for business logic~~

## 🔄 Migration from Old Architecture

The project has been migrated from:
- **Old**: `Rdto`/`Sdto` naming → **New**: `Request`/`Result` naming
- **Old**: Mixed success/error handling → **New**: Consistent `Result<T>` pattern
- **Old**: Manual response creation → **New**: `BaseController.CreateResponse()`

## 🛠️ Best Practices

### 1. Feature Independence
- Each feature should be self-contained
- Avoid cross-feature dependencies
- Use shared models in the `Models/` folder for DTOs used across features

### 2. Error Handling
- Always use the `Result<T>` pattern
- Provide meaningful error messages
- Let the base controller handle status code mapping

### 3. Validation
- Validate input at the controller level
- Use data annotations on request models
- Handle validation errors consistently

### 4. Testing
- Test handlers independently of controllers
- Mock dependencies using interfaces
- Test both success and failure scenarios

### 5. Performance
- Use async/await consistently
- Consider caching for read operations
- Use appropriate HTTP status codes

## 🔧 Configuration

The architecture relies on:
- **MediatR**: For CQRS pattern implementation
- **Dependency Injection**: For service registration
- **Entity Framework**: For data access (via repositories)

Make sure these are properly configured in your `Program.cs` and dependency injection setup.

## 📚 Examples in Codebase

Study these implemented features as examples:
- **Authentication**: `Features/Auth/Login/`, `Features/Auth/Register/`
- **User Management**: `Features/Auth/Me/`, `Features/User/UpdateUser/`
- **External APIs**: `Features/AddressSearch/SearchAddress/`

Each demonstrates different aspects of the architecture and can serve as templates for new features.

---

This architecture provides a solid, scalable foundation that grows with your application while maintaining clean separation of concerns and consistent patterns.
