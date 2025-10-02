import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoadingSpinner } from './LoadingSpinner'

const meta = {
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the loading spinner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  args: {
    size: 'md',
  },
} satisfies Meta<typeof LoadingSpinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
  },
}

export const WithCustomClass: Story = {
  args: {
    size: 'md',
    className: 'text-blue-500',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <LoadingSpinner size="sm" />
        <p className="mt-2 text-sm text-gray-600">Small</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="mt-2 text-sm text-gray-600">Medium</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-2 text-sm text-gray-600">Large</p>
      </div>
    </div>
  ),
}

export const WithColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <div className="text-center">
        <LoadingSpinner size="md" className="text-gray-500" />
        <p className="mt-2 text-sm text-gray-600">Gray</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-blue-500" />
        <p className="mt-2 text-sm text-gray-600">Blue</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-green-500" />
        <p className="mt-2 text-sm text-gray-600">Green</p>
      </div>
      <div className="text-center">
        <LoadingSpinner size="md" className="text-red-500" />
        <p className="mt-2 text-sm text-gray-600">Red</p>
      </div>
    </div>
  ),
}
