# 🚀 Storybook Bootstrap Complete

## ✅ What's Been Fixed

### 1. **QueryClient Cache Pollution Fixed**

- ❌ **Before**: Shared QueryClient caused data to persist between stories
- ✅ **After**: Fresh QueryClient created for each story
- Each story is now completely isolated

### 2. **Centralized Mock Data**

- Created `src/stories/__mocks__/` directory
- All mock data organized by feature:
  - `mockMenus.ts` - Restaurant menus
  - `mockWebsites.ts` - Websites and pages
  - `mockLocations.ts` - Location data
  - `mockRestaurants.ts` - Restaurant data
- Single source of truth for all mock data
- Easily reusable across stories

### 3. **Component Pattern Standardization**

- All data-fetching components now use optional props
- Hooks only called when props not provided
- Works seamlessly in both Storybook and production

### 4. **Developer Documentation**

- `src/stories/README.md` - Complete development guide
- `src/stories/COMPONENT_TEMPLATE.md` - Copy-paste templates
- Helper script: `scripts/create-component.sh`

### 5. **Storybook Configuration**

- Optimized preview.tsx for better performance
- Fresh QueryClient per story
- Infinite stale time (no refetching)
- No retry logic
- Theme switcher configured

## 📁 New File Structure

```
web/
├── .storybook/
│   └── preview.tsx                 # ✨ Optimized with fresh QueryClient per story
├── scripts/
│   └── create-component.sh         # 🆕 Component generator script
└── src/
    └── stories/
        ├── README.md               # 🆕 Complete development guide
        ├── COMPONENT_TEMPLATE.md   # 🆕 Copy-paste templates
        ├── __mocks__/              # 🆕 Centralized mock data
        │   ├── index.ts
        │   ├── mockMenus.ts
        │   ├── mockWebsites.ts
        │   ├── mockLocations.ts
        │   └── mockRestaurants.ts
        ├── components/
        ├── organisms/
        └── pages/
            ├── RestaurantMenus.tsx        # ✨ Updated with prop pattern
            ├── RestaurantMenus.stories.tsx # ✨ Using centralized mocks
            └── Websites/
                ├── Websites.tsx           # ✨ Updated with prop pattern
                └── Websites.stories.tsx   # ✨ Using centralized mocks
```

## 🎯 How to Use

### Creating a New Component

#### Option 1: Use the Helper Script

```bash
./scripts/create-component.sh
```

Follow the prompts to generate a new component with all the boilerplate.

#### Option 2: Manual Creation

1. Copy the template from `src/stories/COMPONENT_TEMPLATE.md`
2. Create mock data in `src/stories/__mocks__/`
3. Follow the patterns in `src/stories/README.md`

### Writing Stories

```typescript
import { mockYourData, emptyData } from '@/stories/__mocks__'

export const Default: Story = {
  args: {
    data: mockYourData,
  },
}
```

### Component Pattern

```typescript
interface MyComponentProps {
  data?: DataType[] // Optional for Storybook
  isLoading?: boolean // Optional for Storybook
  error?: Error | null // Optional for Storybook
}

export const MyComponent = ({ data: dataProp, isLoading: isLoadingProp, error: errorProp }: MyComponentProps = {}) => {
  // Hooks only run when props NOT provided
  const { data: dataFromHook } = useMyQuery(!dataProp ? id : undefined)

  // Use props if provided, otherwise use hook data
  const data = dataProp ?? dataFromHook

  // Component logic...
}
```

## 🔥 Key Benefits

### For Developers

- ✅ No more cache pollution between stories
- ✅ Consistent patterns across all components
- ✅ Easy to find and reuse mock data
- ✅ Quick component creation with script
- ✅ Clear documentation and examples

### For Testing

- ✅ Isolated stories (no side effects)
- ✅ Easy to test edge cases
- ✅ Loading, error, and empty states
- ✅ Fast story switching

### For Maintenance

- ✅ Single source of truth for mocks
- ✅ Type-safe mock data
- ✅ Consistent code structure
- ✅ Self-documenting patterns

## 📚 Documentation

- **Development Guide**: `src/stories/README.md`
- **Component Templates**: `src/stories/COMPONENT_TEMPLATE.md`
- **This File**: `STORYBOOK_BOOTSTRAP.md`

## 🎨 Updated Components

### RestaurantMenus

- ✅ Now accepts props for Storybook
- ✅ Uses centralized mock data
- ✅ 5 stories (MultipleMenus, SingleMenu, NoMenus, Loading, ErrorState)

### Websites

- ✅ Now accepts props for Storybook
- ✅ Uses centralized mock data
- ✅ 5 stories (MultipleWebsites, SingleWebsite, NoWebsites, PublishedWebsite, UnpublishedWebsite)

## 🚦 Quick Commands

```bash
# Start Storybook
pnpm storybook

# Create new component
./scripts/create-component.sh

# Type check
pnpm exec tsc --noEmit

# Lint
pnpm lint

# Format
pnpm format
```

## 🎓 Learning Path

1. Read `src/stories/README.md` for complete guide
2. Look at `RestaurantMenus` or `Websites` as examples
3. Use `scripts/create-component.sh` to create your first component
4. Follow the patterns and update as needed

## 💡 Best Practices Checklist

When creating a new component:

- [ ] Component accepts optional props (data, isLoading, error)
- [ ] Hooks only called when props not provided
- [ ] Mock data created in `__mocks__/` directory
- [ ] Mock data exported from `__mocks__/index.ts`
- [ ] Stories created for all states (default, empty, loading, error)
- [ ] Types imported from `@shared/types`
- [ ] Component added to correct directory
- [ ] Works in both light and dark mode
- [ ] Proper TypeScript types throughout

## 🐛 Known Issues Fixed

1. ✅ **Cache Pollution**: Solved with fresh QueryClient per story
2. ✅ **Data Persistence**: Solved with prop-based pattern
3. ✅ **Type Safety**: All mocks properly typed
4. ✅ **Inconsistent Patterns**: Standardized across codebase
5. ✅ **Missing Documentation**: Complete guides added

## 🎉 You're All Set!

The Storybook environment is now properly bootstrapped and ready for development. Everything follows best practices and makes it easy for developers to work efficiently.

Questions? Check the documentation in `src/stories/README.md` or look at the example components.

Happy coding! 🚀
