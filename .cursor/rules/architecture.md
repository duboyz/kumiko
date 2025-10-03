---
description: Core architecture patterns and mandatory conventions
globs: ["**/*.cs", "**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Architecture Rules

## Backend: Vertical Slice Architecture + CQRS

Every feature follows this structure in `BackendApi/Features/{Domain}/{Feature}/`:
- `{Feature}Command.cs` or `{Feature}Query.cs` - Request and Result types
- `{Feature}Handler.cs` - Business logic (implements `IRequestHandler`)
- `{Feature}Controller.cs` - HTTP endpoint

**Pattern**: Command/Query → Handler → Controller → Result

Example:
```
Features/Restaurant/CreateRestaurant/
├── CreateRestaurantCommand.cs
├── CreateRestaurantHandler.cs
└── CreateRestaurantController.cs
```

## Frontend: Three-Layer Architecture (MANDATORY)

**CRITICAL**: Every backend feature MUST have corresponding files in ALL three layers.

### 1. Type Layer (`web/shared/types/`)
- Type names MUST exactly match backend C# names
- Convention: `{Feature}Command`, `{Feature}Query`, `{Feature}Result`
- One file per domain: `{domain}.types.ts`

Example:
```typescript
// web/shared/types/restaurant.types.ts

// MUST match CreateRestaurantCommand.cs
export interface CreateRestaurantCommand {
  name: string
  address: string
  // ... all backend fields
}

// MUST match CreateRestaurantResult.cs
export interface CreateRestaurantResult {
  id: string
  name: string
  // ... all backend fields
}
```

### 2. API Layer (`web/shared/api/`)
- One file per domain: `{domain}.api.ts`
- Export object pattern: `export const {domain}Api = { ... }`
- Use shared `apiClient` from `client.ts`

Example:
```typescript
// web/shared/api/restaurant.api.ts
import { CreateRestaurantCommand, CreateRestaurantResult } from '../types'
import apiClient from './client'

export const restaurantApi = {
  createRestaurant: async (data: CreateRestaurantCommand): Promise<ResponseData<CreateRestaurantResult>> => {
    const { data: response } = await apiClient.post<ApiResponse<CreateRestaurantResult>>('/api/restaurants', data)
    if (!response.success) throw new Error(response.message || 'Failed')
    return response.data
  },
}
```

### 3. Hook Layer (`web/shared/hooks/`)
- One file per domain: `{domain}.hooks.ts`
- Use Tanstack Query:
  - `useMutation` for commands (POST/PUT/DELETE)
  - `useQuery` for queries (GET)
- Always handle query invalidation

Example:
```typescript
// web/shared/hooks/restaurant.hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { restaurantApi } from '../api'

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

## Complete Feature Workflow

When adding a new feature:

1. **Backend** (`BackendApi/Features/{Domain}/{Feature}/`)
   - Create Command/Query, Handler, Controller
   - Run `cd BackendApi && dotnet build`
   - Fix all errors before proceeding

2. **Frontend Types** (`web/shared/types/{domain}.types.ts`)
   - Add types matching backend exactly
   - Same names as C# types

3. **Frontend API** (`web/shared/api/{domain}.api.ts`)
   - Add function to `{domain}Api` object

4. **Frontend Hook** (`web/shared/hooks/{domain}.hooks.ts`)
   - Create hook wrapping API function

5. **Type Check**
   - Run `cd web && npx tsc --noEmit`
   - Fix all type errors
