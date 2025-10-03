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

The frontend follows a **strict three-layer pattern** for API integration. Every backend feature MUST have corresponding files in all three layers:

#### Three-Layer Architecture (MANDATORY):

1. **Type Layer** (`web/shared/types/`)
   - Define TypeScript types matching backend Commands, Queries, and Results **exactly**
   - **IMPORTANT**: TypeScript types MUST use the same naming convention as backend C# types
   - Naming convention: `{Feature}Command`, `{Feature}Query`, `{Feature}Result`
   - Example: `CreateRestaurantCommand`, `UpdateRestaurantCommand`, `GetUserRestaurantsResult`
   - Each domain should have its own types file (e.g., `auth.types.ts`, `restaurant.types.ts`)

2. **API Layer** (`web/shared/api/`)
   - One file per backend feature domain (e.g., `auth.api.ts`, `restaurant.api.ts`)
   - Export an object containing all API functions for that domain
   - Each function handles one endpoint, wraps it in proper error handling
   - Uses the shared `apiClient` from `client.ts` (Axios with interceptors)
   - Pattern: `export const {domain}Api = { functionName: async (params) => { ... } }`

3. **Hook Layer** (`web/shared/hooks/`)
   - One file per backend feature domain (e.g., `auth.hooks.ts`, `restaurant.hooks.ts`)
   - Uses Tanstack Query (`useQuery` for reads, `useMutation` for writes)
   - Each hook wraps one API function
   - Handles query invalidation, optimistic updates, and error states
   - Pattern: `export const use{Feature} = () => { ... }`

#### Example Implementation Flow:

**Backend**: `Features/Restaurant/CreateRestaurant/`
- `CreateRestaurantCommand.cs` → `CreateRestaurantHandler.cs` → `CreateRestaurantController.cs`

**Frontend**:
1. **Types** (`web/shared/types/restaurant.types.ts`):
   ```typescript
   // MUST match backend CreateRestaurantCommand.cs
   export interface CreateRestaurantCommand {
     name: string
     address: string
     city: string
     // ... other fields
   }

   // MUST match backend CreateRestaurantResult.cs
   export interface CreateRestaurantResult {
     id: string
     name: string
     // ... other fields
   }
   ```

2. **API** (`web/shared/api/restaurant.api.ts`):
   ```typescript
   export const restaurantApi = {
     createRestaurant: async (data: CreateRestaurantCommand): Promise<ResponseData<CreateRestaurantResult>> => {
       const { data: response } = await apiClient.post<ApiResponse<CreateRestaurantResult>>('/api/restaurants', data)
       if (!response.success) throw new Error(response.message || 'Failed to create restaurant')
       return response.data
     },
   }
   ```

3. **Hook** (`web/shared/hooks/restaurant.hooks.ts`):
   ```typescript
   export const useCreateRestaurant = () => {
     const queryClient = useQueryClient()

     return useMutation({
       mutationFn: (data: CreateRestaurantCommand) => restaurantApi.createRestaurant(data),
       onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['restaurants'] })
       },
     })
   }
   ```

#### Key Directories:
- `web/shared/types/` - TypeScript type definitions (Commands, Queries, Results)
- `web/shared/api/` - Axios-based API client functions
- `web/shared/hooks/` - Tanstack Query hooks
- `web/shared/stores/` - Zustand state management (for UI state, not server state)
- `web/src/app/` - Next.js app router pages
- `web/src/components/` - React components (using Shadcn UI)

## Development Rules

### Type Safety
- **No `any` or `unknown` types** - Create proper types or request file paths
- All backend commands/results must have corresponding TypeScript types in `web/shared/types/`

### Backend Development Flow
1. Create feature in `BackendApi/Features/{Domain}/{Feature}/`
   - `{Feature}Command.cs` (or `{Feature}Query.cs`)
   - `{Feature}Handler.cs`
   - `{Feature}Controller.cs`
2. Run `dotnet build` and fix all errors before proceeding
3. Create matching TypeScript types in `web/shared/types/{domain}.types.ts`
   - Type names MUST exactly match backend Command/Query/Result names
4. Create API client function in `web/shared/api/{domain}.api.ts`
   - Add function to existing `{domain}Api` object
5. Create React Query hook in `web/shared/hooks/{domain}.hooks.ts`
   - Use `useMutation` for commands (POST/PUT/DELETE)
   - Use `useQuery` for queries (GET)

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