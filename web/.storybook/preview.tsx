import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '../src/app/globals.css'
import '@fontsource/noto-sans-jp/latin.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },
    layout: 'centered',
    backgrounds: {
      disable: true,
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        push: (...args: unknown[]) => console.log('Navigate to:', ...args),
        replace: (...args: unknown[]) => console.log('Replace with:', ...args),
        refresh: () => console.log('Refresh page'),
        back: () => console.log('Go back'),
        forward: () => console.log('Go forward'),
        prefetch: (...args: unknown[]) => console.log('Prefetch:', ...args),
      },
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

      // Apply theme to document
      if (typeof document !== 'undefined') {
        document.documentElement.className = theme
        document.documentElement.style.backgroundColor = 'var(--background)'
        document.documentElement.style.color = 'var(--foreground)'
        document.documentElement.style.setProperty('--font-noto-sans-jp', 'Noto Sans JP')
      }

      // Create a NEW QueryClient for each story to prevent cache pollution
      const [queryClient] = React.useState(
        () =>
          new QueryClient({
            defaultOptions: {
              queries: {
                staleTime: Infinity, // Don't refetch in Storybook
                retry: false, // Don't retry failed queries
                gcTime: 0, // Don't cache query results
              },
              mutations: {
                retry: false,
              },
            },
            // Disable all network activity in Storybook
            logger: {
              log: () => {},
              warn: () => {},
              error: () => {},
            },
          })
      )

      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      )
    },
  ],
}

export default preview
