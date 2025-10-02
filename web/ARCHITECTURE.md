# 🏗️ Kumiko Web Architecture

## 📋 Architecture Philosophy

**Core Principles:**

1. **Smart Components** - Components handle their own data fetching and state
2. **Dumb Pages** - Pages are just composition layers
3. **Single Source of Truth** - All components live in `src/stories/`
4. **Testability** - Every component has Storybook stories
5. **Maintainability** - Clear patterns, no duplication, easy to navigate

## 📁 New Directory Structure

```
src/
├── stories/                          # ALL BUSINESS COMPONENTS LIVE HERE
│   ├── __mocks__/                   # Centralized mock data
│   │   └── *.ts
│   ├── shared/                      # Shared, reusable components
│   │   ├── FormField/
│   │   ├── PageHeader/
│   │   ├── LoadingState/
│   │   ├── ErrorState/
│   │   ├── EmptyState/
│   │   ├── ContentContainer/
│   │   ├── LocationGuard/
│   │   └── ...
│   ├── features/                    # Feature-specific components
│   │   ├── MenuItemsTable/         # Smart: handles own data
│   │   ├── CreateMenuDialog/       # Smart: handles own mutations
│   │   ├── WebsitesList/           # Smart: handles own data
│   │   ├── RestaurantMenus/        # Smart: handles own data
│   │   └── ...
│   └── pages/                       # Full page components (smart)
│       ├── MenusPage/
│       ├── WebsitesPage/
│       ├── MenuItemsPage/
│       └── ...
│
├── app/                             # Next.js routing ONLY
│   ├── (protected)/
│   │   ├── menus/
│   │   │   └── page.tsx            # Just <MenusPage /> wrapper
│   │   ├── websites/
│   │   │   └── page.tsx            # Just <WebsitesPage /> wrapper
│   │   └── ...
│   └── ...
│
├── components/                      # shadcn/ui components (keep as-is)
│   └── ui/                          # Button, Card, Input, etc.
│       └── *.tsx
│
├── lib/                             # Utilities (keep)
├── hooks/                           # App-level hooks (keep)
└── middleware.ts                    # App-level (keep)
```

## 🎯 Component Hierarchy

### 1. shadcn/ui (Base UI - `src/components/ui/`)

- Use directly, no wrappers needed
- Stock components from shadcn
- Examples: Button, Input, Card, Badge, Dialog, etc.

### 2. Shared Components (`src/stories/shared/`)

- Combine shadcn components with light logic
- **Reusable across entire app**
- No data fetching
- Dumb/presentational
- Examples: FormField, PageHeader, LoadingState, ErrorState, EmptyState

### 3. Features (`src/stories/features/`)

- **SMART** - Handle own data fetching
- Complex business logic
- Feature-specific (not reused elsewhere)
- Examples: MenuItemsTable, CreateMenuDialog, WebsitesList, RestaurantMenus

### 4. Pages (`src/stories/pages/`)

- **SMART** - Compose features and shared components
- Handle page-level concerns (route guards, layout)
- Minimal logic (just composition)
- Examples: MenusPage, WebsitesPage, MenuItemsPage

## 🔄 Migration Plan

### Phase 1: Consolidate Base Components ✅ (Do This First)

1. Move `src/components/*` (except ui/) → `src/stories/shared/`
2. **Keep** `src/components/ui/*` (shadcn components stay)
3. Update all imports
4. Delete duplicates

### Phase 2: Extract Page Logic to Features (Next)

1. Create smart features from page logic
2. Move data fetching to features
3. Simplify pages to composition only
4. Add stories for all components

### Phase 3: Add Stories for Everything

1. Ensure every component has a story
2. Test all states (loading, error, empty, success)
3. Document with ArgTypes

### Phase 4: Final Cleanup

1. Remove duplication
2. Standardize naming
3. Update documentation
4. Remove unused code

## 📐 Component Patterns

### Pattern 1: Smart Feature (Data Fetching)

```typescript
// src/stories/features/MenuItemsTable/MenuItemsTable.tsx
'use client'
import { useAllRestaurantMenuItems, useLocationSelection } from '@shared'
import { LoadingState } from '@/stories/shared/LoadingState'
import { ErrorState } from '@/stories/shared/ErrorState'
import { EmptyState } from '@/stories/shared/EmptyState'

interface MenuItemsTableProps {
  // Optional props for Storybook
  menuItems?: MenuItemDto[]
  isLoading?: boolean
  error?: Error | null
  // Callbacks
  onItemClick?: (id: string) => void
}

export const MenuItemsTable = ({
  menuItems: menuItemsProp,
  isLoading: isLoadingProp,
  error: errorProp,
  onItemClick,
}: MenuItemsTableProps = {}) => {
  // Smart: Fetch data when props not provided
  const { selectedLocation } = useLocationSelection()
  const {
    data,
    isLoading: isLoadingHook,
    error: errorHook,
  } = useAllRestaurantMenuItems(
    !menuItemsProp ? selectedLocation?.id : undefined
  )

  const menuItems = menuItemsProp ?? data?.menuItems
  const isLoading = isLoadingProp ?? isLoadingHook
  const error = errorProp ?? errorHook

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!menuItems?.length) return <EmptyState icon={Package} title="No items" />

  return (
    <div>
      {/* Table implementation */}
    </div>
  )
}
```

### Pattern 2: Dumb Page (Composition Only)

```typescript
// src/stories/pages/MenuItemsPage/MenuItemsPage.tsx
'use client'
import { ContentContainer } from '@/stories/shared/ContentContainer'
import { PageHeader } from '@/stories/shared/PageHeader'
import { MenuItemsTable } from '@/stories/features/MenuItemsTable'
import { CreateMenuItemDialog } from '@/stories/features/CreateMenuItemDialog'
import { LocationGuard } from '@/stories/shared/LocationGuard'

export const MenuItemsPage = () => {
  return (
    <LocationGuard requireRestaurant>
      <ContentContainer>
        <PageHeader
          title="Menu Items"
          action={<CreateMenuItemDialog />}
        />
        <MenuItemsTable />
      </ContentContainer>
    </LocationGuard>
  )
}
```

### Pattern 3: Next.js Page (Wrapper Only)

```typescript
// src/app/(protected)/menu-items/page.tsx
import { MenuItemsPage } from '@/stories/pages/MenuItemsPage/MenuItemsPage'

export default function Page() {
  return <MenuItemsPage />
}
```

## 🎨 Naming Conventions

### Files

- Component: `MenuItemsTable.tsx`
- Story: `MenuItemsTable.stories.tsx`
- Types: `MenuItemsTable.types.ts` (if complex)
- Hooks: `useMenuItemsTable.ts` (if needed)

### Components

- PascalCase: `MenuItemsTable`
- Descriptive names
- Feature-first naming

### Directories

- One component per directory
- Directory name = Component name
- Flat structure within type (shared/features/pages)

## 🔧 Import Aliases

```typescript
// Use these consistently
import { Button, Card, Input } from '@/components/ui' // shadcn components
import { PageHeader } from '@/stories/shared/PageHeader' // shared components
import { MenuItemsTable } from '@/stories/features/MenuItemsTable' // feature components
import { MenuItemsPage } from '@/stories/pages/MenuItemsPage' // pages
import { useMenuItems } from '@shared/hooks' // hooks
import { MenuItemDto } from '@shared/types' // types
```

## ✅ Component Checklist

Before considering a component "done":

- [ ] Lives in correct directory (shared/features/pages)
- [ ] Has optional props for Storybook
- [ ] Handles own data fetching (if feature/page)
- [ ] Has loading/error/empty states
- [ ] Has comprehensive stories
- [ ] Has proper TypeScript types
- [ ] Uses centralized mocks in stories
- [ ] Uses shadcn components directly (no wrappers)
- [ ] Exports from index.ts
- [ ] Documented with comments
- [ ] Works in light AND dark mode

## 📦 Exports

Each directory should have an `index.ts`:

```typescript
// src/stories/features/index.ts
export { MenuItemsTable } from './MenuItemsTable/MenuItemsTable'
export { CreateMenuDialog } from './CreateMenuDialog/CreateMenuDialog'
export { WebsitesList } from './WebsitesList/WebsitesList'
export { RestaurantMenus } from './RestaurantMenus/RestaurantMenus'
```

## 🚀 Benefits

### For Developers

- ✅ Clear where components live
- ✅ Easy to find components
- ✅ Consistent patterns
- ✅ Testable in isolation
- ✅ Fast development with stories

### For Maintainability

- ✅ Single source of truth
- ✅ No duplication
- ✅ Clear dependencies
- ✅ Easy refactoring
- ✅ Self-documenting

### For Testing

- ✅ Every component has stories
- ✅ Visual regression testing
- ✅ All states covered
- ✅ Easy to reproduce bugs
- ✅ Living documentation

## 🎯 Migration Priority

### High Priority (Do First)

1. MenuItemsPage - Most complex
2. WebsitesPage - Second most complex
3. MenusPage - Moderate complexity
4. Consolidate base components

### Medium Priority

5. Dashboard
6. Settings
7. Onboarding flows

### Low Priority

8. Public pages
9. Auth pages
10. Edge cases

## 📚 Documentation

- Architecture: `ARCHITECTURE.md` (this file)
- Quick Start: `QUICK_START.md`
- Component Guide: `src/stories/README.md`
- Template: `src/stories/COMPONENT_TEMPLATE.md`
- Bootstrap Info: `STORYBOOK_BOOTSTRAP.md`

## 🤝 Contributing

When adding a new feature:

1. **Create smart feature** in `src/stories/features/`
2. **Add comprehensive stories** (all states)
3. **Create page component** in `src/stories/pages/`
4. **Add Next.js route** (wrapper only)
5. **Update exports** in index.ts files
6. **Document** if complex

## 🔄 Next Steps

See `MIGRATION_PLAN.md` for step-by-step migration guide.
