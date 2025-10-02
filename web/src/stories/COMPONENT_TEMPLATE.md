# Component Template

Use this template to create new components with Storybook support.

## File: `ComponentName.tsx`

```typescript
'use client'
import { useState } from 'react'
import { useYourHook } from '@shared/hooks'
import type { YourDataType } from '@shared/types'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ComponentNameProps {
  // Data props (optional for Storybook)
  data?: YourDataType[]
  isLoading?: boolean
  error?: Error | null

  // Configuration props
  title?: string

  // Callback props (optional)
  onAction?: (id: string) => void
}

export const ComponentName = ({
  data: dataProp,
  isLoading: isLoadingProp,
  error: errorProp,
  title = 'Default Title',
  onAction,
}: ComponentNameProps = {}) => {
  // Local state
  const [selectedId, setSelectedId] = useState<string>('')

  // Hooks - only fetch data when props are not provided
  const {
    data: dataFromHook,
    isLoading: isLoadingHook,
    error: errorHook,
  } = useYourHook(!dataProp ? 'someId' : undefined)

  // Use props if provided, otherwise use hook data
  const data = dataProp ?? dataFromHook
  const isLoading = isLoadingProp ?? isLoadingHook
  const error = errorProp ?? errorHook

  // Handle different states
  if (isLoading) return <LoadingState />
  if (error) {
    return (
      <ErrorState
        title="Failed to load"
        message={error.message || 'Something went wrong'}
      />
    )
  }
  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={YourIcon}
        title="No data yet"
        description="Get started by creating your first item."
        action={{
          label: 'Create Item',
          onClick: () => onAction?.('create'),
        }}
      />
    )
  }

  // Main render
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button onClick={() => onAction?.('create')}>
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <Card key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## File: `ComponentName.stories.tsx`

```typescript
import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ComponentName } from './ComponentName'
import { mockYourData, singleData, emptyData } from '@/stories/__mocks__'

const meta = {
  component: ComponentName,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onAction: { action: 'action' },
  },
} satisfies Meta<typeof ComponentName>

export default meta

type Story = StoryObj<typeof ComponentName>

/**
 * Default state with multiple items
 */
export const Default: Story = {
  args: {
    data: mockYourData,
    title: 'My Component',
  },
}

/**
 * Single item state
 */
export const Single: Story = {
  args: {
    data: singleData,
    title: 'Single Item',
  },
}

/**
 * Empty state - no data
 */
export const Empty: Story = {
  args: {
    data: emptyData,
    title: 'Empty State',
  },
}

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    isLoading: true,
    title: 'Loading...',
  },
}

/**
 * Error state
 */
export const ErrorState: Story = {
  args: {
    error: new Error('Failed to load data'),
    title: 'Error State',
  },
}
```

## File: `__mocks__/mockYourData.ts`

```typescript
import type { YourDataType } from '@shared/types'

/**
 * Mock data for ComponentName
 */
export const mockYourData: YourDataType[] = [
  {
    id: 'item-1',
    name: 'Item One',
    description: 'Description for item one',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-2',
    name: 'Item Two',
    description: 'Description for item two',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'item-3',
    name: 'Item Three',
    description: 'Description for item three',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
]

export const singleData = [mockYourData[0]]
export const emptyData: YourDataType[] = []
```

## Checklist

- [ ] Component follows the prop pattern (optional data props)
- [ ] Hooks only called when props are not provided
- [ ] All states handled (loading, error, empty, success)
- [ ] TypeScript types imported from `@shared/types`
- [ ] Mock data created in `__mocks__/` directory
- [ ] Stories created for all states
- [ ] Component added to correct directory (components/organisms/pages)
- [ ] Proper exports in `__mocks__/index.ts`
- [ ] Works in both light and dark mode
- [ ] Callbacks use `action` in argTypes
- [ ] Documentation comments added to stories
