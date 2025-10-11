import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MenuImportWrapper from './MenuImportWrapper'

// Create a mock query client for Storybook
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})

// Wrapper component to provide necessary context
const MenuImportWrapperStory = (args: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background py-8">
        <MenuImportWrapper {...args} />
      </div>
    </QueryClientProvider>
  )
}

const meta: Meta<typeof MenuImportWrapperStory> = {
  title: 'Onboarding/MenuImportWrapper',
  component: MenuImportWrapperStory,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithCallbacks: Story = {
  args: {
    onComplete: () => {
      console.log('Menu import completed!')
    },
    onBack: () => {
      console.log('Back clicked')
    },
  },
}
