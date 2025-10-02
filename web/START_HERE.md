# 🚀 Start Here - Architecture Migration

## What's Happening?

We're reorganizing the entire `web/` folder to be:

- ✅ Maintainable
- ✅ Scalable
- ✅ Easy to understand

## 📖 Documentation

Before starting, read these (in order):

1. **ARCHITECTURE.md** - The new structure and patterns (5 min read)
2. **MIGRATION_PLAN.md** - Step-by-step plan (3 min read)
3. This file - How to execute

## 🎯 New Structure

```
src/stories/
├── shared/      # Reusable components (no data fetching)
├── features/    # Smart components (handle own data)
└── pages/       # Page compositions
```

**Key Concepts:**

- **shared** = Dumb, reusable everywhere (LoadingState, PageHeader)
- **features** = Smart, feature-specific (MenuItemsTable, CreateMenuDialog)
- **pages** = Composition only (MenusPage, WebsitesPage)
- **components/ui** = shadcn stays as-is (no changes)

## 🚦 Before You Start

### Prerequisites

✅ Read ARCHITECTURE.md
✅ Read MIGRATION_PLAN.md
✅ Commit all your current changes
✅ Make sure tests pass
✅ Close Storybook if running

### Safety First

```bash
# Create a backup branch
git checkout -b backup-before-migration

# Commit everything
git add .
git commit -m "Backup before architecture migration"

# Create migration branch
git checkout -b architecture-migration
```

## 🏃 Execute Migration

### Phase 1: Restructure Directories (30 min)

```bash
# Run the automated script
./scripts/migrate-phase1.sh
```

This will:

- Create `src/stories/shared/` and `src/stories/features/`
- Move components from `src/components/` to `src/stories/shared/`
- Rename `organisms` → `features`
- Merge `src/stories/components/` into `shared/`
- Keep `src/components/ui/` untouched

### Phase 2: Update Imports (5 min)

```bash
# Automatically update all import paths
./scripts/update-imports.sh
```

This updates:

- `@/stories/organisms` → `@/stories/features`
- `@/stories/components` → `@/stories/shared`
- `@/components/X` → `@/stories/shared/X` (except ui/)

### Phase 3: Manual Updates (30 min)

1. **Update Export Files**

   ```bash
   # Add exports to:
   - src/stories/shared/index.ts
   - src/stories/features/index.ts
   - src/stories/pages/index.ts
   ```

2. **Fix Any Import Issues**

   ```bash
   # Check for issues
   pnpm exec tsc --noEmit

   # Fix remaining imports manually
   ```

3. **Test Storybook**
   ```bash
   pnpm storybook
   ```

### Phase 4: Extract Page Logic (2-4 hours)

See MIGRATION_PLAN.md Phase 2-4 for detailed steps.

This is the main work:

- Extract logic from pages into features
- Create smart feature components
- Simplify pages to composition only

## 🔍 Verification

After each phase, verify:

```bash
# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Test Storybook
pnpm storybook

# Test app
pnpm dev
```

## 🐛 Troubleshooting

### Import errors after Phase 1

→ Run `./scripts/update-imports.sh` again
→ Manually check for edge cases

### TypeScript errors

→ Check export files (index.ts)
→ Verify moved components have correct paths

### Storybook breaks

→ Check story files import paths
→ Verify mocks are still accessible

### Want to rollback?

```bash
git checkout backup-before-migration
```

## 📝 Keep Track

Create a checklist as you go:

```markdown
## My Progress

### Phase 1: Restructure ⬜

- [ ] Run migrate-phase1.sh
- [ ] Verify file moves
- [ ] Check MIGRATION_NOTES.md

### Phase 2: Imports ⬜

- [ ] Run update-imports.sh
- [ ] Fix any remaining imports
- [ ] Type check passes

### Phase 3: Exports ⬜

- [ ] Update shared/index.ts
- [ ] Update features/index.ts
- [ ] Storybook works

### Phase 4: Extract Logic ⬜

- [ ] MenuItemsPage
- [ ] WebsitesPage
- [ ] MenusPage
```

## 💡 Tips

1. **Work in small commits** - Commit after each successful phase
2. **Test frequently** - Run `pnpm storybook` often
3. **Read the docs** - ARCHITECTURE.md has all the patterns
4. **Use the templates** - COMPONENT_TEMPLATE.md for new components
5. **Ask for help** - Check issues or ask team

## 🎉 When Done

After completing all phases:

1. **Final verification**

   ```bash
   pnpm exec tsc --noEmit
   pnpm lint
   pnpm storybook
   pnpm dev
   ```

2. **Update documentation**
   - Update README if needed
   - Add any learnings

3. **Merge**

   ```bash
   git add .
   git commit -m "Complete architecture migration"
   # Create PR and merge
   ```

4. **Celebrate** 🎉

## 📚 Quick Reference

- **Architecture**: `ARCHITECTURE.md`
- **Migration Plan**: `MIGRATION_PLAN.md`
- **Component Template**: `src/stories/COMPONENT_TEMPLATE.md`
- **Storybook Guide**: `src/stories/README.md`
- **Quick Start**: `QUICK_START.md`

## 🆘 Need Help?

1. Check ARCHITECTURE.md for patterns
2. Look at existing migrated components
3. Check MIGRATION_PLAN.md for specific steps
4. Review git history if something breaks

---

**Ready?** Start with Phase 1:

```bash
./scripts/migrate-phase1.sh
```

Good luck! 🚀
