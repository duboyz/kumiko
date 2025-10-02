# Storybook Development Guide

## Overview

This guide will help you create components and stories following our best practices. All components go into the `stories/` directory with corresponding story files.

## 📁 Project Structure

```
stories/
├── __mocks__/              # Centralized mock data
│   ├── index.ts            # Re-exports all mocks
│   ├── mockMenus.ts        # Menu-related mocks
│   ├── mockWebsites.ts     # Website-related mocks
│   ├── mockLocations.ts    # Location-related mocks
│   └── mockRestaurants.ts  # Restaurant-related mocks
├── components/             # Small, reusable UI components
├── organisms/              # Larger, complex components
└── pages/                  # Full page components
```

## 🎯 Best Practices

### 1. Component Design Pattern

All components that fetch data should follow this pattern:

```typescript
interface MyComponentProps {
  // Optional props for Storybook
  data?: MyDataType[]
  isLoading?: boolean
  error?: Error | null
  // Other props
  locationName?: string
}

export const MyComponent = ({
  data: dataProp,
  isLoading: isLoadingProp,
  error: errorProp,
  locationName,
}: MyComponentProps = {}) => {
  // Use hooks only when props are NOT provided
  const { data: dataFromHook, isLoading: isLoadingHook, error: errorHook } = useMyQuery(!dataProp ? someId : undefined)

  // Use props if provided, otherwise use hook data
  const data = dataProp ?? dataFromHook
  const isLoading = isLoadingProp ?? isLoadingHook
  const error = errorProp ?? errorHook

  // Rest of component logic...
}
```

**Why this pattern?**

- ✅ Works in production with real data (hooks)
- ✅ Works in Storybook with mock data (props)
- ✅ No cache pollution between stories
- ✅ Easy to test different states

### 2. Creating Stories

#### Step 1: Import centralized mocks

```typescript
import { mockMenus, emptyMenus } from '@/stories/__mocks__'
```

#### Step 2: Define meta configuration

```typescript
const meta = {
  component: MyComponent,
  parameters: {
    layout: 'padded', // or 'centered', 'fullscreen'
  },
  tags: ['autodocs'],
  argTypes: {
    onAction: { action: 'actionName' }, // For callbacks
  },
} satisfies Meta<typeof MyComponent>
```

#### Step 3: Create multiple stories for different states

```typescript
export const WithData: Story = {
  args: {
    data: mockData,
    locationName: 'Bella Vista Restaurant',
  },
}

export const Empty: Story = {
  args: {
    data: [],
    locationName: 'New Restaurant',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const Error: Story = {
  args: {
    error: new Error('Failed to load data'),
  },
}
```

### 3. Mock Data Guidelines

**DO:**

- ✅ Use centralized mocks from `__mocks__/` directory
- ✅ Create reusable mock data
- ✅ Add realistic data with proper types
- ✅ Export variants (single, multiple, empty)

**DON'T:**

- ❌ Create inline mock data in story files
- ❌ Duplicate mock data across stories
- ❌ Use production data in stories

#### Adding New Mock Data

1. Create a new file in `stories/__mocks__/`
2. Export the mock data with proper types
3. Add to `__mocks__/index.ts`

```typescript
// mockNewFeature.ts
import type { FeatureDto } from '@shared/types'

export const mockFeatures: FeatureDto[] = [
  {
    id: 'feature-1',
    name: 'Feature Name',
    // ... other properties
  },
]

export const singleFeature = [mockFeatures[0]]
export const emptyFeatures: FeatureDto[] = []
```

```typescript
// __mocks__/index.ts
export * from './mockNewFeature'
```

### 4. Component Organization

#### Small Components → `stories/components/`

- Single responsibility
- Reusable across pages
- Example: Button, Card, Input

#### Complex Components → `stories/organisms/`

- Multiple sub-components
- Business logic
- Example: CreateMenuDialog, MenuItemTableView

#### Page Components → `stories/pages/`

- Full page layouts
- Composed of organisms and components
- Example: RestaurantMenus, Websites

### 5. Type Safety

Always import types from shared types:

```typescript
import type { RestaurantMenuDto, WebsiteDto } from '@shared/types'
```

Use proper type annotations for props:

```typescript
interface MyComponentProps {
  data?: MyDataType[] // Optional for Storybook
  onAction?: (id: string) => void // Optional callbacks
  required: string // Required props
}
```

## 🚀 Quick Start Template

```typescript
// MyComponent.tsx
'use client'
import { useMyHook } from '@shared/hooks'
import type { MyDataType } from '@shared/types'

interface MyComponentProps {
  data?: MyDataType[]
  isLoading?: boolean
  error?: Error | null
}

export const MyComponent = ({
  data: dataProp,
  isLoading: isLoadingProp,
  error: errorProp,
}: MyComponentProps = {}) => {
  const { data: dataFromHook, isLoading: isLoadingHook, error: errorHook } = useMyHook(
    !dataProp ? 'someId' : undefined
  )

  const data = dataProp ?? dataFromHook
  const isLoading = isLoadingProp ?? isLoadingHook
  const error = errorProp ?? errorHook

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!data || data.length === 0) return <EmptyState />

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

```typescript
// MyComponent.stories.tsx
import { StoryObj } from '@storybook/nextjs-vite'
import { MyComponent } from './MyComponent'
import { mockData, emptyData } from '@/stories/__mocks__'

const meta = {
  component: MyComponent,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MyComponent>

export default meta

type Story = StoryObj<typeof MyComponent>

export const Default: Story = {
  args: {
    data: mockData,
  },
}

export const Empty: Story = {
  args: {
    data: emptyData,
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}

export const Error: Story = {
  args: {
    error: new Error('Something went wrong'),
  },
}
```

## 🔧 Storybook Configuration

### QueryClient Setup

- Fresh QueryClient created for each story
- No cache pollution between stories
- Infinite stale time (no refetching)
- No retries
- Network activity disabled

### Theme Switcher

- Light/Dark mode toggle in toolbar
- Automatically applies theme to all stories

### Layout Options

- `centered` - For small components
- `padded` - For medium-sized components with padding
- `fullscreen` - For full-page layouts

## 🐛 Common Issues & Solutions

### Issue: Data persists between stories

**Solution:** Make sure you're using props, not hooks directly in stories

### Issue: "Cannot find module '@/stories/**mocks**'"

**Solution:** Check your tsconfig.json has proper path mappings

### Issue: Types not matching

**Solution:** Always import types from `@shared/types`

### Issue: Hook called unconditionally

**Solution:** Use the conditional pattern: `useHook(!prop ? id : undefined)`

## 📚 Additional Resources

- [Storybook Documentation](https://storybook.js.org/docs)
- [Component Composition Best Practices](https://storybook.js.org/docs/writing-stories/stories-for-multiple-components)
- [Testing with Storybook](https://storybook.js.org/docs/writing-tests)

## 🤝 Contributing

1. Follow the component pattern above
2. Use centralized mock data
3. Create stories for all states (loading, error, empty, success)
4. Add proper TypeScript types
5. Test in both light and dark mode
