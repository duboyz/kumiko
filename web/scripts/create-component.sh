#!/bin/bash

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Kumiko Component Generator          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Get component name
read -p "Component name (e.g., MyFeature): " COMPONENT_NAME

if [ -z "$COMPONENT_NAME" ]; then
  echo -e "${YELLOW}Component name cannot be empty${NC}"
  exit 1
fi

# Get component type
echo ""
echo "Select component type:"
echo "1) Component (small, reusable)"
echo "2) Organism (complex, business logic)"
echo "3) Page (full page layout)"
read -p "Choice [1-3]: " TYPE_CHOICE

case $TYPE_CHOICE in
  1)
    DIR="src/stories/components"
    TYPE="component"
    ;;
  2)
    DIR="src/stories/organisms"
    TYPE="organism"
    ;;
  3)
    DIR="src/stories/pages"
    TYPE="page"
    ;;
  *)
    echo -e "${YELLOW}Invalid choice${NC}"
    exit 1
    ;;
esac

TARGET_DIR="$DIR/$COMPONENT_NAME"

# Check if component already exists
if [ -d "$TARGET_DIR" ]; then
  echo -e "${YELLOW}Component $COMPONENT_NAME already exists in $DIR${NC}"
  exit 1
fi

# Create directory
mkdir -p "$TARGET_DIR"

echo -e "${GREEN}✓ Created directory: $TARGET_DIR${NC}"

# Create component file
cat > "$TARGET_DIR/$COMPONENT_NAME.tsx" << 'EOF'
'use client'
import { useState } from 'react'
import type { YourDataType } from '@shared/types'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'

interface COMPONENT_NAMEProps {
  data?: YourDataType[]
  isLoading?: boolean
  error?: Error | null
}

export const COMPONENT_NAME = ({
  data: dataProp,
  isLoading: isLoadingProp,
  error: errorProp,
}: COMPONENT_NAMEProps = {}) => {
  // TODO: Add your hook here
  // const { data: dataFromHook, isLoading: isLoadingHook, error: errorHook } = useYourHook(
  //   !dataProp ? 'someId' : undefined
  // )
  
  const data = dataProp // ?? dataFromHook
  const isLoading = isLoadingProp // ?? isLoadingHook
  const error = errorProp // ?? errorHook
  
  if (isLoading) return <LoadingState />
  if (error) return <ErrorState title="Error" message={error.message} />
  if (!data || data.length === 0) return <EmptyState icon={null} title="No data" description="No data available" />
  
  return (
    <div>
      <h1>COMPONENT_NAME</h1>
      {/* TODO: Implement your component */}
    </div>
  )
}
EOF

# Replace COMPONENT_NAME placeholders
sed -i.bak "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$TARGET_DIR/$COMPONENT_NAME.tsx"
rm "$TARGET_DIR/$COMPONENT_NAME.tsx.bak"

echo -e "${GREEN}✓ Created component: $COMPONENT_NAME.tsx${NC}"

# Create story file
cat > "$TARGET_DIR/$COMPONENT_NAME.stories.tsx" << 'EOF'
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { COMPONENT_NAME } from './COMPONENT_NAME'
// TODO: Import your mock data
// import { mockData, emptyData } from '@/stories/__mocks__'

const meta = {
  component: COMPONENT_NAME,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof COMPONENT_NAME>

export default meta

type Story = StoryObj<typeof COMPONENT_NAME>

export const Default: Story = {
  args: {
    // TODO: Add your mock data
    // data: mockData,
  },
}

export const Empty: Story = {
  args: {
    data: [],
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const ErrorState: Story = {
  args: {
    error: new Error('Something went wrong'),
  },
}
EOF

# Replace COMPONENT_NAME placeholders
sed -i.bak "s/COMPONENT_NAME/$COMPONENT_NAME/g" "$TARGET_DIR/$COMPONENT_NAME.stories.tsx"
rm "$TARGET_DIR/$COMPONENT_NAME.stories.tsx.bak"

echo -e "${GREEN}✓ Created stories: $COMPONENT_NAME.stories.tsx${NC}"

echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Next Steps:                          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "1. Update types in ${GREEN}$COMPONENT_NAME.tsx${NC}"
echo -e "2. Add your hook and data fetching logic"
echo -e "3. Create mock data in ${GREEN}src/stories/__mocks__/${NC}"
echo -e "4. Update stories with real mock data"
echo -e "5. Implement your component UI"
echo ""
echo -e "${GREEN}✨ Component created successfully!${NC}"
echo -e "Location: ${BLUE}$TARGET_DIR${NC}"

