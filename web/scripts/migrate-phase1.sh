#!/bin/bash

# Phase 1: Setup New Structure
# This script automates the directory restructuring

set -e  # Exit on error

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Kumiko Architecture Migration - Phase 1          ║${NC}"
echo -e "${BLUE}║  Setup New Structure                               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Safety check
echo -e "${YELLOW}⚠️  This will reorganize your src/stories/ directory${NC}"
echo -e "${YELLOW}⚠️  Make sure you have committed your current changes!${NC}"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Migration cancelled${NC}"
    exit 1
fi

echo -e "\n${BLUE}Starting Phase 1 Migration...${NC}\n"

# Step 1: Create new directories
echo -e "${GREEN}Step 1: Creating new directories...${NC}"
mkdir -p src/stories/shared
mkdir -p src/stories/features
echo -e "  ✓ Created src/stories/shared/"
echo -e "  ✓ Created src/stories/features/"

# Step 2: Rename organisms → features
echo -e "\n${GREEN}Step 2: Renaming organisms/ → features/...${NC}"
if [ -d "src/stories/organisms" ]; then
    # Move contents from organisms to features
    mv src/stories/organisms/* src/stories/features/ 2>/dev/null || true
    rmdir src/stories/organisms 2>/dev/null || true
    echo -e "  ✓ Renamed organisms/ to features/"
else
    echo -e "  ℹ️  organisms/ directory doesn't exist, skipping"
fi

# Step 3: Move components from src/components/ to src/stories/shared/
echo -e "\n${GREEN}Step 3: Moving components to shared/...${NC}"

# List of components to move (excluding ui/)
COMPONENTS_TO_MOVE=(
    "ContentContainer.tsx"
    "EmptyState.tsx"
    "ErrorState.tsx"
    "FormField.tsx"
    "LanguageSelector.tsx"
    "LoadingState.tsx"
    "PageHeader.tsx"
    "SearchBusiness.tsx"
    "app-sidebar.tsx"
    "SidebarRestaurantSelector.tsx"
)

for component in "${COMPONENTS_TO_MOVE[@]}"; do
    if [ -f "src/components/$component" ]; then
        # Extract component name without extension
        name="${component%.tsx}"
        
        # Create directory for component
        mkdir -p "src/stories/shared/$name"
        
        # Move file and rename to match directory
        mv "src/components/$component" "src/stories/shared/$name/$name.tsx"
        echo -e "  ✓ Moved $component to shared/$name/"
    else
        echo -e "  ⊘ $component not found, skipping"
    fi
done

# Step 4: Merge existing story components to shared
echo -e "\n${GREEN}Step 4: Merging story components to shared/...${NC}"
if [ -d "src/stories/components" ]; then
    # Move each component directory
    for dir in src/stories/components/*/; do
        if [ -d "$dir" ]; then
            dirname=$(basename "$dir")
            if [ ! -d "src/stories/shared/$dirname" ]; then
                mv "$dir" "src/stories/shared/"
                echo -e "  ✓ Moved components/$dirname/ to shared/"
            else
                echo -e "  ⚠️  shared/$dirname/ already exists, manual merge needed"
            fi
        fi
    done
    
    # Remove old components directory if empty
    rmdir src/stories/components 2>/dev/null && echo -e "  ✓ Removed empty components/ directory" || echo -e "  ⚠️  components/ not empty, manual check needed"
else
    echo -e "  ℹ️  No src/stories/components/ directory found"
fi

# Step 5: Create index.ts export files
echo -e "\n${GREEN}Step 5: Creating export index files...${NC}"

# Create shared/index.ts
cat > src/stories/shared/index.ts << 'EOF'
/**
 * Shared Components
 * 
 * Reusable components used across the application.
 * These are dumb/presentational - no data fetching.
 */

// TODO: Add exports as components are migrated
// Example:
// export { PageHeader } from './PageHeader/PageHeader'
// export { LoadingState } from './LoadingState/LoadingState'
EOF
echo -e "  ✓ Created shared/index.ts"

# Create features/index.ts  
cat > src/stories/features/index.ts << 'EOF'
/**
 * Feature Components
 * 
 * Smart components that handle their own data fetching.
 * Feature-specific and not typically reused.
 */

// TODO: Add exports as features are created
// Example:
// export { MenuItemsTable } from './MenuItemsTable/MenuItemsTable'
// export { CreateMenuDialog } from './CreateMenuDialog/CreateMenuDialog'
EOF
echo -e "  ✓ Created features/index.ts"

# Update pages/index.ts if it doesn't exist
if [ ! -f "src/stories/pages/index.ts" ]; then
    cat > src/stories/pages/index.ts << 'EOF'
/**
 * Page Components
 * 
 * Full page compositions that combine features and shared components.
 */

// TODO: Add exports as pages are created
// Example:
// export { MenusPage } from './MenusPage/MenusPage'
// export { WebsitesPage } from './WebsitesPage/WebsitesPage'
EOF
    echo -e "  ✓ Created pages/index.ts"
fi

# Step 6: Create a migration notes file
echo -e "\n${GREEN}Step 6: Creating migration notes...${NC}"
cat > MIGRATION_NOTES.md << 'EOF'
# Migration Notes - Phase 1 Complete

## What Changed

### Directory Structure
- ✅ Created `src/stories/shared/` - For reusable components
- ✅ Created `src/stories/features/` - For smart, feature-specific components
- ✅ Renamed `src/stories/organisms/` → `src/stories/features/`
- ✅ Moved components from `src/components/` to `src/stories/shared/`
- ✅ Merged `src/stories/components/` into `src/stories/shared/`

### What Stayed the Same
- ✅ `src/components/ui/` - shadcn components (no changes)
- ✅ `src/stories/__mocks__/` - Mock data (no changes)
- ✅ `src/stories/pages/` - Page components (no changes yet)

## Next Steps

1. **Update Imports**: Run `./scripts/update-imports.sh`
2. **Add Exports**: Update index.ts files with actual exports
3. **Add Stories**: Ensure every component has a .stories.tsx file
4. **Test**: Verify Storybook works with `pnpm storybook`
5. **Continue to Phase 2**: Extract page logic into features

## Manual Tasks

- [ ] Review moved components for any issues
- [ ] Update any hardcoded import paths
- [ ] Add missing exports to index.ts files
- [ ] Verify all stories still work
- [ ] Update documentation references

## Rollback

If needed, git commands:
```bash
git checkout src/
```
EOF
echo -e "  ✓ Created MIGRATION_NOTES.md"

echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Phase 1 Complete! ✨                              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}New structure:${NC}"
echo -e "  src/stories/"
echo -e "  ├── shared/      ${YELLOW}(reusable components)${NC}"
echo -e "  ├── features/    ${YELLOW}(smart, feature-specific)${NC}"
echo -e "  └── pages/       ${YELLOW}(full page compositions)${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. Review moved files in src/stories/shared/"
echo -e "  2. Run: ${BLUE}./scripts/update-imports.sh${NC}"
echo -e "  3. Update export files (shared/index.ts, features/index.ts)"
echo -e "  4. Test Storybook: ${BLUE}pnpm storybook${NC}"
echo -e "  5. Read MIGRATION_NOTES.md for details"
echo ""

