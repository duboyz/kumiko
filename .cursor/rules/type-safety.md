---
description: TypeScript type safety rules
globs: ["web/**/*.ts", "web/**/*.tsx"]
alwaysApply: true
---

# Type Safety Rules

## Critical Rules

1. **NO `any` or `unknown` types**
   - Create proper types instead
   - If unsure, ask for file paths to see existing patterns

2. **Frontend types MUST match backend exactly**
   - Same naming: `CreateRestaurantCommand`, `UpdateRestaurantCommand`
   - Same field names and types
   - Check the corresponding C# file when creating types

3. **Always type check after changes**
   ```bash
   cd web && npx tsc --noEmit
   ```

## Naming Conventions

### Backend (.NET)
- Commands: `{Feature}Command` (e.g., `CreateRestaurantCommand`)
- Queries: `{Feature}Query` (e.g., `GetUserRestaurantsQuery`)
- Results: `{Feature}Result` (e.g., `CreateRestaurantResult`)
- DTOs: `{Entity}Dto` (e.g., `RestaurantBaseDto`)

### Frontend (TypeScript)
- **Types**: MUST match backend (e.g., `CreateRestaurantCommand`, `CreateRestaurantResult`)
- **API functions**: camelCase (e.g., `createRestaurant`, `getUserRestaurants`)
- **Hooks**: `use{Feature}` (e.g., `useCreateRestaurant`, `useUserRestaurants`)

## Type Organization

- One file per domain in each layer
- Import from barrel exports (`@shared`)
- Group related types together

Example structure:
```typescript
// web/shared/types/restaurant.types.ts
export interface CreateRestaurantCommand { ... }
export interface CreateRestaurantResult { ... }
export interface UpdateRestaurantCommand { ... }
export interface RestaurantBaseDto { ... }

// web/shared/types/index.ts
export * from './restaurant.types'
export * from './auth.types'
// ...
```
