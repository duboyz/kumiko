import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingMessage } from './LoadingMessage'

const meta = {
  component: LoadingMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The loading message to display',
    },
    centered: {
      control: 'boolean',
      description: 'Whether to center the loading message',
    },
    showSpinner: {
      control: 'boolean',
      description: 'Whether to show the loading spinner',
    },
  },
  args: {
    message: 'Loading...',
    centered: true,
    showSpinner: true,
  },
} satisfies Meta<typeof LoadingMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Loading...',
    centered: true,
    showSpinner: true,
  },
}

export const WithCustomMessage: Story = {
  args: {
    message: 'Please wait while we process your request...',
    centered: true,
    showSpinner: true,
  },
}

export const WithoutSpinner: Story = {
  args: {
    message: 'Processing...',
    centered: true,
    showSpinner: false,
  },
}

export const NotCentered: Story = {
  args: {
    message: 'Loading content...',
    centered: false,
    showSpinner: true,
  },
}

export const LongMessage: Story = {
  args: {
    message: 'This is a longer loading message that demonstrates how the component handles more text content.',
    centered: true,
    showSpinner: true,
  },
}

export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <LoadingMessage message="Loading data..." />
      </div>
      <div className="border rounded-lg">
        <LoadingMessage message="Saving changes..." showSpinner={true} />
      </div>
      <div className="border rounded-lg">
        <LoadingMessage message="Upload complete!" showSpinner={false} />
      </div>
      <div className="border rounded-lg">
        <LoadingMessage message="Connecting to server..." centered={false} />
      </div>
    </div>
  ),
}

export const InContainer: Story = {
  render: () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg h-32 flex items-center">
      <LoadingMessage message="Loading dashboard..." />
    </div>
  ),
}

export const MinimalSpinner: Story = {
  args: {
    message: '',
    centered: true,
    showSpinner: true,
  },
}
