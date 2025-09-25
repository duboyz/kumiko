import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ErrorMessage } from './ErrorMessage'

const meta = {
  component: ErrorMessage,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
      description: 'The error message to display',
    },
    title: {
      control: 'text',
      description: 'The error title (optional)',
    },
  },
  args: {
    message: 'Something went wrong. Please try again.',
    title: 'Error',
  },
} satisfies Meta<typeof ErrorMessage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    title: 'Error',
  },
}

export const WithoutTitle: Story = {
  args: {
    message: 'Invalid email address format.',
    title: undefined,
  },
}

export const ValidationError: Story = {
  args: {
    message: 'Please fill in all required fields.',
    title: 'Validation Error',
  },
}

export const NetworkError: Story = {
  args: {
    message: 'Unable to connect to the server. Check your internet connection and try again.',
    title: 'Network Error',
  },
}

export const AuthenticationError: Story = {
  args: {
    message: 'Your session has expired. Please log in again.',
    title: 'Authentication Required',
  },
}

export const LongMessage: Story = {
  args: {
    message: 'This is a very long error message that demonstrates how the component handles more detailed error descriptions. It should wrap properly and maintain good readability even with extended content.',
    title: 'Detailed Error',
  },
}

export const ShortMessage: Story = {
  args: {
    message: 'Failed.',
    title: 'Error',
  },
}

export const CustomTitle: Story = {
  args: {
    message: 'The file you selected is too large. Please choose a file smaller than 10MB.',
    title: 'Upload Failed',
  },
}

export const CommonErrorScenarios: Story = {
  render: () => (
    <div className="space-y-4">
      <ErrorMessage
        title="Form Validation"
        message="Please check the highlighted fields and try again."
      />
      <ErrorMessage
        title="Server Error"
        message="We're experiencing technical difficulties. Please try again in a few minutes."
      />
      <ErrorMessage
        title="Permission Denied"
        message="You don't have permission to perform this action."
      />
      <ErrorMessage
        title="Not Found"
        message="The requested resource could not be found."
      />
    </div>
  ),
}

export const InFormContext: Story = {
  render: () => (
    <div className="max-w-md mx-auto">
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
            placeholder="Enter your email"
            defaultValue="invalid-email"
          />
        </div>
        <ErrorMessage
          message="Please enter a valid email address."
          title="Invalid Input"
        />
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  ),
}

export const InCardContext: Story = {
  render: () => (
    <div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Account Settings
      </h3>
      <ErrorMessage
        title="Update Failed"
        message="Unable to save your changes. Please check your connection and try again."
      />
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
          Retry
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  ),
}