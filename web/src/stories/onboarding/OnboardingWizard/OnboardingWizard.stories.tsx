import type { Meta, StoryObj } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import OnboardingWizard from './OnboardingWizard'
import { OnboardingStep } from '@shared/types/onboarding.types'

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
const OnboardingWizardWrapper = (args: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background py-8">
        <OnboardingWizard {...args} />
      </div>
    </QueryClientProvider>
  )
}

const meta: Meta<typeof OnboardingWizardWrapper> = {
  title: 'Onboarding/OnboardingWizard',
  component: OnboardingWizardWrapper,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const CompleteFlow: Story = {
  args: {
    onComplete: () => {
      console.log('🎉 Onboarding completed!')
      alert('Onboarding completed! Check the console for details.')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Test the complete onboarding flow from start to finish. This includes restaurant search, confirmation, menu upload, and website generation.',
      },
    },
  },
}

export const BusinessStep: Story = {
  args: {
    step: OnboardingStep.Business,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start from the business search step.',
      },
    },
  },
}

export const ConfirmationStep: Story = {
  args: {
    step: OnboardingStep.Confirmation,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start from the business confirmation step.',
      },
    },
  },
}

export const MenuStep: Story = {
  args: {
    step: OnboardingStep.Menu,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start from the menu upload step.',
      },
    },
  },
}

export const WebsiteStep: Story = {
  args: {
    step: OnboardingStep.Website,
  },
  parameters: {
    docs: {
      description: {
        story: 'Start from the website generation step.',
      },
    },
  },
}
