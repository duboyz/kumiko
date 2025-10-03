---
description: Code quality and best practices
globs: ["**/*"]
alwaysApply: true
---

# Code Quality Rules

## General Principles

1. **Keep solutions short and concise**
   - Avoid over-engineering
   - Follow existing patterns

2. **Never duplicate code**
   - Extract shared logic
   - Reuse existing components/utilities

3. **Always prefer editing over creating**
   - Edit existing files when possible
   - Only create new files when absolutely necessary

4. **Follow existing patterns**
   - Check similar files in the codebase
   - Match the established structure

## Frontend Specific

### Package Management
- **Use pnpm** (NOT npm or yarn)
  ```bash
  cd web && pnpm install
  cd web && pnpm add <package>
  ```

### UI Components
- **Use Shadcn UI** components
- Don't create custom components when Shadcn has them
- Check `web/src/components/ui/` for available components

### React Patterns
- Functional components only
- Use hooks from `web/shared/hooks/`
- Server state with Tanstack Query
- UI state with Zustand (`web/shared/stores/`)

### File Organization
```
web/
├── shared/
│   ├── types/       # TypeScript types
│   ├── api/         # API client functions
│   ├── hooks/       # Tanstack Query hooks
│   ├── stores/      # Zustand stores
│   └── utils/       # Utility functions
├── src/
│   ├── app/         # Next.js pages
│   └── components/  # React components
```

## Backend Specific

### Result Pattern
- All operations return `Result<T>`
- Use `CreateResponse()` in controllers
- Handle errors gracefully

### Database
- Use Entity Framework Core migrations
- Never modify migrations after creation
- Always test migrations locally first

### Dependencies
- Use dependency injection
- Register services in `Program.cs`
- Follow SOLID principles

## Commands Reference

### Backend
```bash
cd BackendApi && dotnet build
cd BackendApi && dotnet run
cd BackendApi && dotnet ef database update
cd BackendApi && dotnet ef migrations add <Name>
```

### Frontend
```bash
cd web && pnpm dev
cd web && pnpm build
cd web && pnpm lint
cd web && npx tsc --noEmit
```
