import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ClientOnlyWrapper } from './ClientOnlyWrapper'

const meta: Meta<typeof ClientOnlyWrapper> = {
  component: ClientOnlyWrapper,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    fallback: {
      control: false,
      description: 'Component to show while mounting',
    },
    children: {
      control: false,
      description: 'Content to show after component mounts',
    },
  },
}

export default meta

type Story = StoryObj<typeof ClientOnlyWrapper>

export const Default: Story = {
  args: {
    children: (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800">Client-Side Content</h3>
        <p className="text-blue-600">This content only renders on the client side.</p>
      </div>
    ),
  },
}

export const WithFallback: Story = {
  args: {
    children: (
      <div className="p-4 bg-green-50 border border-green-200 rounded">
        <h3 className="font-semibold text-green-800">Mounted Content</h3>
        <p className="text-green-600">This shows after the component mounts.</p>
      </div>
    ),
    fallback: (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded animate-pulse">
        <h3 className="font-semibold text-gray-600">Loading...</h3>
        <p className="text-gray-500">This shows while mounting.</p>
      </div>
    ),
  },
}

export const ComplexContent: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <div className="p-4 bg-purple-50 border border-purple-200 rounded">
          <h3 className="font-semibold text-purple-800">Interactive Component</h3>
          <button
            className="mt-2 px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
            onClick={() => alert('Client-side interaction!')}
          >
            Click me
          </button>
        </div>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded">
          <h3 className="font-semibold text-orange-800">Current Time</h3>
          <p className="text-orange-600">
            Rendered at: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    ),
    fallback: (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 rounded w-20"></div>
        </div>
      </div>
    ),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Client Only Wrapper</h3>
        <p className="text-sm text-gray-600 mb-4">
          This wrapper prevents hydration mismatches by only rendering children on the client side.
          Useful for components that depend on browser APIs or dynamic content.
        </p>

        <ClientOnlyWrapper
          fallback={
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-yellow-700">⏳ Waiting for client-side hydration...</p>
            </div>
          }
        >
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800">✅ Client-side rendered!</h4>
            <p className="text-green-600 text-sm mt-1">
              This content only appears after the component mounts on the client.
            </p>
            <p className="text-green-600 text-sm">
              User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent.slice(0, 50) + '...' : 'N/A'}
            </p>
          </div>
        </ClientOnlyWrapper>
      </div>
    </div>
  )
}