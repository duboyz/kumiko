# 🔄 Migration Plan: Complete Architecture Overhaul

## 🎯 Goal

Transform the codebase to follow clean architecture principles with smart components and dumb pages.

## 📊 Current State Analysis

### Problems

- ❌ Components scattered between `src/components` and `src/stories`
- ❌ Pages have 300+ lines of logic
- ❌ Duplicate components (LoadingSpinner vs LoadingState)
- ❌ No clear component hierarchy
- ❌ Inconsistent patterns
- ❌ Hard to test and maintain

### Target State

- ✅ All components in `src/stories/`
- ✅ Clear hierarchy: atoms → molecules → organisms → pages
- ✅ Smart components handle own data
- ✅ Pages are simple composition
- ✅ Every component has stories
- ✅ Zero duplication

## 🚀 Migration Steps

### PHASE 1: Setup New Structure ⚡ (30 min)

#### Step 1.1: Create New Directories

```bash
mkdir -p src/stories/atoms
mkdir -p src/stories/molecules
```

#### Step 1.2: Move shadcn/ui → atoms/

Move all from `src/components/ui/` to `src/stories/atoms/`

#### Step 1.3: Move base components → molecules/

Move from `src/components/` to `src/stories/molecules/`:

- ContentContainer
- EmptyState
- ErrorState
- FormField
- LanguageSelector
- LoadingState
- PageHeader
- SearchBusiness

#### Step 1.4: Create Export Files

- `src/stories/atoms/index.ts`
- `src/stories/molecules/index.ts`
- `src/stories/organisms/index.ts`
- `src/stories/pages/index.ts`

---

### PHASE 2: Extract MenuItemsPage Logic ⚡ (2 hours)

The most complex page - if we fix this, others will be easier.

#### Step 2.1: Create MenuItemsTable Organism

Extract table view logic into smart component

#### Step 2.2: Create CreateMenuItemDialog Organism

Extract create dialog logic

#### Step 2.3: Create BulkMenuItemActions Organism

Extract bulk operations

#### Step 2.4: Create MenuItemsPage Component

Simple composition

#### Step 2.5: Update Next.js page

Wrapper only

---

### PHASE 3: Extract WebsitesPage Logic ⚡ (1.5 hours)

#### Step 3.1: Create CreateWebsiteDialog Organism

Extract create dialog (currently in page)

#### Step 3.2: Update Websites Component

Make it fully smart

#### Step 3.3: Create WebsitesPage Component

Composition only

#### Step 3.4: Update Next.js page

Wrapper only

---

### PHASE 4: Update MenusPage ⚡ (30 min)

#### Step 4.1: Already has RestaurantMenus component

Just needs wrapper

#### Step 4.2: Create MenusPage Component

Add route guards

#### Step 4.3: Update Next.js page

Wrapper only

---

### PHASE 5: Create Shared Molecules ⚡ (1 hour)

#### Step 5.1: LocationGuard

Handles restaurant/hospitality/location checks

#### Step 5.2: RouteGuard

Auth and permission checks

#### Step 5.3: ContentLayout

Standard page layout wrapper

---

### PHASE 6: Update All Imports ⚡ (1 hour)

Run automated script to update imports:

- `@/components/*` → `@/stories/molecules/*`
- `@/components/ui/*` → `@/stories/atoms/*`

---

### PHASE 7: Add Missing Stories ⚡ (2 hours)

Every component needs stories:

- All molecules
- All atoms (if customized)
- Check organisms
- All pages

---

### PHASE 8: Cleanup ⚡ (30 min)

- Delete `src/components/` directory
- Remove unused imports
- Update tsconfig paths if needed
- Run linter and fix issues

---

## 📋 Detailed Component Breakdown

### Components to Create

#### New Organisms (in stories/organisms/)

1. **MenuItemsTable** - Smart table with data fetching
2. **CreateMenuItemDialog** - Dialog with mutation
3. **EditMenuItemDialog** - Dialog with mutation
4. **BulkMenuItemActions** - Bulk operations
5. **CreateWebsiteDialog** - Dialog with mutation (extract from page)
6. **WebsitesList** - If needed

#### New Molecules (in stories/molecules/)

1. **LocationGuard** - Route guard for location checks
2. **RouteGuard** - Auth guard
3. **ContentLayout** - Standard page layout
4. **ConfirmDialog** - Reusable confirm dialog

#### New Pages (in stories/pages/)

1. **MenuItemsPage/** - Composition of MenuItems organisms
2. **WebsitesPage/** - Composition of Website organisms
3. **MenusPage/** - Composition of Menus organisms
4. **DashboardPage/** - Simple dashboard
5. **SettingsPage/** - Settings page

### Components to Move

#### From src/components/ → stories/molecules/

- [x] ContentContainer
- [x] EmptyState
- [x] ErrorState
- [x] FormField
- [x] LanguageSelector
- [x] LoadingState
- [x] PageHeader
- [x] SearchBusiness
- [ ] app-sidebar
- [ ] SidebarRestaurantSelector

#### From src/components/ui/ → stories/atoms/

- [ ] All shadcn components (25 components)

---

## 🎯 Success Criteria

### Must Have

- ✅ All components in stories/
- ✅ src/components/ deleted
- ✅ Pages < 50 lines (composition only)
- ✅ Every component has stories
- ✅ Zero duplication
- ✅ Consistent naming

### Nice to Have

- ✅ All organisms fully tested
- ✅ Loading/error/empty states everywhere
- ✅ Dark mode tested
- ✅ Performance optimized
- ✅ Accessibility checked

---

## 📅 Timeline

**Total Estimated Time: 8-10 hours**

- Phase 1: 30 min
- Phase 2: 2 hours
- Phase 3: 1.5 hours
- Phase 4: 30 min
- Phase 5: 1 hour
- Phase 6: 1 hour
- Phase 7: 2 hours
- Phase 8: 30 min

**Recommendation:** Break into 2-3 sessions

---

## 🚦 Start Here

**Next Action:** Execute Phase 1 (Setup New Structure)

Run:

```bash
./scripts/start-migration.sh
```

Or manually follow steps in Phase 1.

---

## 📝 Notes

- Test after each phase
- Commit after each phase
- Keep Storybook running to verify
- Update documentation as you go
- Ask for help if stuck

---

## ✅ Progress Tracking

### Phase 1: Setup ⬜

- [ ] Create directories
- [ ] Move atoms
- [ ] Move molecules
- [ ] Create exports

### Phase 2: MenuItems ⬜

- [ ] MenuItemsTable organism
- [ ] CreateMenuItemDialog organism
- [ ] BulkActions organism
- [ ] MenuItemsPage component
- [ ] Update Next.js page

### Phase 3: Websites ⬜

- [ ] CreateWebsiteDialog organism
- [ ] Update Websites component
- [ ] WebsitesPage component
- [ ] Update Next.js page

### Phase 4: Menus ⬜

- [ ] MenusPage component
- [ ] Update Next.js page

### Phase 5: Shared ⬜

- [ ] LocationGuard
- [ ] RouteGuard
- [ ] ContentLayout

### Phase 6: Imports ⬜

- [ ] Update all imports
- [ ] Test everything

### Phase 7: Stories ⬜

- [ ] Add missing stories
- [ ] Test all states

### Phase 8: Cleanup ⬜

- [ ] Delete src/components
- [ ] Final cleanup
- [ ] Documentation

---

Ready to start? Let's do this! 🚀
