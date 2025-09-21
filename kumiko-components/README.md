# Kumiko Components

A React component library built with Shadcn UI, Vite, and Storybook.

## Features

- 🎨 Built with Shadcn UI components
- ⚡ Vite for fast development and building
- 📚 Storybook for component documentation and testing
- 🎯 TypeScript support
- 💨 Tailwind CSS for styling
- 📦 Optimized for npm publishing

## Development

### Install dependencies
```bash
pnpm install
```

### Start Storybook
```bash
pnpm storybook
```

### Build the library
```bash
pnpm build
```

### Local Development with Yalc

For local development, you can use yalc to link this package to other projects:

1. **Publish to yalc store:**
   ```bash
   pnpm yalc:publish
   ```

2. **In your consuming project (e.g., web):**
   ```bash
   cd ../web
   yalc add kumiko-components
   pnpm install
   ```

3. **To push updates during development:**
   ```bash
   pnpm build && pnpm yalc:push
   ```

4. **To remove yalc link:**
   ```bash
   cd ../web
   yalc remove kumiko-components
   pnpm install
   ```

## Usage

```tsx
import { Button } from 'kumiko-components';
import 'kumiko-components/styles.css';

function App() {
  return (
    <Button variant="default">
      Hello World
    </Button>
  );
}
```

## Components

### Button

A versatile button component with multiple variants and sizes.

**Variants:**
- `default` - Primary button style
- `secondary` - Secondary button style
- `destructive` - For destructive actions
- `outline` - Outlined button
- `ghost` - Minimal button style
- `link` - Link-styled button

**Sizes:**
- `default` - Standard size
- `sm` - Small size
- `lg` - Large size
- `icon` - Square icon button

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build the library
- `pnpm storybook` - Start Storybook
- `pnpm build-storybook` - Build Storybook for deployment
- `pnpm yalc:publish` - Publish to yalc store
- `pnpm yalc:push` - Push updates to linked projects