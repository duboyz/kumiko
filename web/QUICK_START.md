# ⚡ Quick Start Guide

## 🎯 TL;DR

```bash
# Create a new component
pnpm create:component

# Start Storybook
pnpm storybook
```

That's it! Follow the prompts and you're ready to build.

## 📝 Component Pattern (Copy & Paste)

```typescript
// YourComponent.tsx
'use client'
import type { YourType } from '@shared/types'

interface YourComponentProps {
  data?: YourType[]
  isLoading?: boolean
  error?: Error | null
}

export const YourComponent = ({
  data: dataProp,
  isLoading: isLoadingProp,
  error: errorProp,
}: YourComponentProps = {}) => {
  const { data: dataFromHook } = useYourHook(!dataProp ? id : undefined)
  const data = dataProp ?? dataFromHook

  // Your component logic...
}
```

```typescript
// YourComponent.stories.tsx
import { mockData } from '@/stories/__mocks__'

export const Default: Story = {
  args: { data: mockData },
}
```

## 🗂️ Where Things Go

```
stories/
├── __mocks__/          ← Your mock data
├── components/         ← Small reusable pieces
├── organisms/          ← Complex components
└── pages/              ← Full pages
```

## ✅ The Golden Rules

1. **Components accept optional props** (for Storybook)
2. **Hooks only run when props NOT provided**
3. **Mock data lives in `__mocks__/`**
4. **Import mocks from `@/stories/__mocks__`**
5. **Create stories for all states**

## 🚀 Need More Info?

- Full Guide: `src/stories/README.md`
- Template: `src/stories/COMPONENT_TEMPLATE.md`
- Bootstrap Info: `STORYBOOK_BOOTSTRAP.md`

## 💡 Examples

Look at these for reference:

- `src/stories/pages/RestaurantMenus.tsx`
- `src/stories/pages/Websites/Websites.tsx`
