import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ImportWizard } from '@/app/(protected)/menus/import/components/ImportWizard'

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
const ImportWizardWrapper = (args: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background py-8">
        <ImportWizard {...args} />
      </div>
    </QueryClientProvider>
  )
}

const meta: Meta<typeof ImportWizardWrapper> = {
  title: 'Menus/ImportWizard',
  component: ImportWizardWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const CompleteFlow: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Complete menu import flow: Upload → Preview → Process → Review. This is the full menu import wizard used in the menus section.',
      },
    },
  },
}
