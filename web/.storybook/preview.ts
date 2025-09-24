import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

// Import Noto Sans JP font for Storybook
import '@fontsource/noto-sans-jp/latin.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',

    backgrounds: {
      disable: true,
    },

    a11y: {
      test: 'todo',
    },
  },
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light'

      if (typeof document !== 'undefined') {
        document.documentElement.className = theme
        document.documentElement.style.backgroundColor = 'var(--background)'
        document.documentElement.style.color = 'var(--foreground)'
        // Ensure font is applied
        document.documentElement.style.setProperty('--font-noto-sans-jp', 'Noto Sans JP')
      }

      return Story()
    },
  ],
}

export default preview
