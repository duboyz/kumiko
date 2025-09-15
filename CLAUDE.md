# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Backend (.NET 8)
```bash
# Build the backend
cd BackendApi && dotnet build

# Run the backend
cd BackendApi && dotnet run

# Run database migrations
cd BackendApi && dotnet ef database update

# Create a new migration
cd BackendApi && dotnet ef migrations add <MigrationName>

# Start PostgreSQL database (Docker)
cd BackendApi && docker-compose up -d
```

### Frontend (Next.js 15 with Turbopack)
```bash
# Install dependencies
cd web && pnpm install

# Run development server
cd web && pnpm dev

# Build for production
cd web && pnpm build

# Run linting
cd web && pnpm lint

# Fix linting issues
cd web && pnpm lint:fix

# Format code
cd web && pnpm format

# Check TypeScript types
cd web && npx tsc --noEmit

# Setup Stripe webhook listener (for local development)
cd web && pnpm webhook
```

## Architecture

### Backend - Vertical Slice Architecture with CQRS

The backend uses **Vertical Slice Architecture** organized by business features:

- **Features/** - Each business feature is self-contained with Command/Query, Handler, and Controller
- **Pattern**: Command/Query → Handler → Controller → Result
- **Result Pattern**: All operations return `Result<T>` for consistent error handling
- **Base Controller**: Provides standardized API responses via `CreateResponse()`

#### Feature Structure:
```
Features/
├── Auth/
│   ├── Login/
│   │   ├── LoginCommand.cs      # Command definition + Result type
│   │   ├── LoginHandler.cs      # Business logic
│   │   └── LoginController.cs   # HTTP endpoint
│   ├── Register/
│   ├── Logout/
│   └── Me/
├── User/
│   └── UpdateUser/
└── Restaurant/
```

#### API Endpoints:
- `/api/auth/*` - Authentication (login, register, logout, me)
- `/api/users/*` - User management (profile updates)
- `/api/search/*` - Address and business search
- `/api/restaurant/*` - Restaurant management

### Frontend - Next.js with TypeScript

The frontend follows a structured pattern for API integration:

1. **Type Definition** (`web/shared/types/`) - Define command/result types matching backend
2. **API Client** (`web/shared/api/`) - Axios-based API calls
3. **React Query Hooks** (`web/shared/hooks/`) - Data fetching hooks using Tanstack Query

#### Key Directories:
- `web/shared/` - Shared utilities, types, API clients, and hooks
- `web/src/app/` - Next.js app router pages
- `web/src/components/` - React components (using Shadcn UI)

## Development Rules

### Type Safety
- **No `any` or `unknown` types** - Create proper types or request file paths
- All backend commands/results must have corresponding TypeScript types in `web/shared/types/`

### Backend Development Flow
1. Create feature in `BackendApi/Features/`
2. Run `dotnet build` and fix all errors before proceeding
3. Create TypeScript types in `web/shared/types/`
4. Create API client in `web/shared/api/`
5. Create React Query hook in `web/shared/hooks/`

### Frontend Development
- Use **pnpm** for package management
- Use **Shadcn UI** components
- Keep solutions short and concise
- Never duplicate code
- Check for TypeScript errors after each task: `cd web && npx tsc --noEmit`

### Authentication
- Uses httpOnly cookies for JWT tokens
- Backend sets cookies, frontend includes them automatically
- JWT configuration in `appsettings.json`
- Tokens include access (150 min) and refresh (7 days) tokens

## Database
- PostgreSQL running on port 5557
- Connection string in `appsettings.json`
- Entity Framework Core with migrations
- Database: `backendapi_db`
- User: `backendapi_user`

## External Services
- **Stripe**: Payment processing (keys in `appsettings.json`)
- **Google Places API**: Address/business search

## Environment Variables

### Backend (.NET)
Configuration in `appsettings.json` and `appsettings.Development.json`

### Frontend (Next.js)
```bash
# web/.env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:5157
```

## Testing
- Backend: No test framework currently configured
- Frontend: Run `pnpm lint` for code quality checks