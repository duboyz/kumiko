#!/bin/bash

# Update Imports Script
# Automatically updates import paths after Phase 1 migration

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Updating Import Paths                             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to update imports in a file
update_file_imports() {
    local file=$1
    local changed=false
    
    # Update @/stories/organisms → @/stories/features
    if grep -q "@/stories/organisms" "$file"; then
        sed -i.bak 's|@/stories/organisms|@/stories/features|g' "$file"
        changed=true
    fi
    
    # Update @/stories/components → @/stories/shared
    if grep -q "@/stories/components" "$file"; then
        sed -i.bak 's|@/stories/components|@/stories/shared|g' "$file"
        changed=true
    fi
    
    # Update @/components/ (excluding ui) → @/stories/shared
    # This is trickier - need to exclude @/components/ui
    if grep -q "@/components/" "$file" && ! grep -q "@/components/ui" "$file"; then
        # For each specific component we moved
        sed -i.bak 's|@/components/ContentContainer|@/stories/shared/ContentContainer|g' "$file"
        sed -i.bak 's|@/components/EmptyState|@/stories/shared/EmptyState|g' "$file"
        sed -i.bak 's|@/components/ErrorState|@/stories/shared/ErrorState|g' "$file"
        sed -i.bak 's|@/components/FormField|@/stories/shared/FormField|g' "$file"
        sed -i.bak 's|@/components/LanguageSelector|@/stories/shared/LanguageSelector|g' "$file"
        sed -i.bak 's|@/components/LoadingState|@/stories/shared/LoadingState|g' "$file"
        sed -i.bak 's|@/components/PageHeader|@/stories/shared/PageHeader|g' "$file"
        sed -i.bak 's|@/components/SearchBusiness|@/stories/shared/SearchBusiness|g' "$file"
        changed=true
    fi
    
    # Clean up backup file
    if [ -f "$file.bak" ]; then
        rm "$file.bak"
    fi
    
    if [ "$changed" = true ]; then
        echo -e "  ${GREEN}✓${NC} Updated: $file"
    fi
}

echo -e "${YELLOW}Scanning files for import updates...${NC}\n"

# Update TypeScript/TSX files in src/
file_count=0
updated_count=0

while IFS= read -r -d '' file; do
    ((file_count++))
    if update_file_imports "$file"; then
        ((updated_count++))
    fi
done < <(find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" -print0)

echo ""
echo -e "${GREEN}Import update complete!${NC}"
echo -e "  Files scanned: $file_count"
echo -e "  Files updated: $updated_count"
echo ""
echo -e "${YELLOW}Next: Verify changes with:${NC}"
echo -e "  ${BLUE}git diff src/${NC}"
echo ""

