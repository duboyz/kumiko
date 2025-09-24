import type { Meta, StoryObj } from '@storybook/react';
import { KumikoSpinner } from './KumikoSpinner';

const meta: Meta<typeof KumikoSpinner> = {
  title: 'Kumiko/Atoms/KumikoSpinner',
  component: KumikoSpinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A minimalist loading spinner component with Japanese design aesthetics. Perfect for indicating loading states with clean, zen-like animations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
      description: 'Size of the spinner',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'subtle'],
      description: 'Color variant of the spinner',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <KumikoSpinner size="xs" />
        <p className="text-xs mt-2 text-kumiko-gray-500">XS</p>
      </div>
      <div className="text-center">
        <KumikoSpinner size="sm" />
        <p className="text-xs mt-2 text-kumiko-gray-500">SM</p>
      </div>
      <div className="text-center">
        <KumikoSpinner size="base" />
        <p className="text-xs mt-2 text-kumiko-gray-500">Base</p>
      </div>
      <div className="text-center">
        <KumikoSpinner size="lg" />
        <p className="text-xs mt-2 text-kumiko-gray-500">LG</p>
      </div>
      <div className="text-center">
        <KumikoSpinner size="xl" />
        <p className="text-xs mt-2 text-kumiko-gray-500">XL</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size options for various use cases.',
      },
    },
  },
};

// Color variations
export const ColorVariations: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <KumikoSpinner color="primary" />
        <p className="text-xs mt-2 text-kumiko-gray-500">Primary</p>
      </div>
      <div className="text-center">
        <KumikoSpinner color="secondary" />
        <p className="text-xs mt-2 text-kumiko-gray-500">Secondary</p>
      </div>
      <div className="text-center">
        <KumikoSpinner color="muted" />
        <p className="text-xs mt-2 text-kumiko-gray-500">Muted</p>
      </div>
      <div className="text-center">
        <KumikoSpinner color="subtle" />
        <p className="text-xs mt-2 text-kumiko-gray-500">Subtle</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variants to match your content hierarchy.',
      },
    },
  },
};

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <KumikoSpinner size="sm" />
        <span className="text-sm text-kumiko-gray-700">Loading...</span>
      </div>

      <div className="flex items-center gap-3">
        <KumikoSpinner size="sm" color="muted" />
        <span className="text-sm text-kumiko-gray-500">Processing...</span>
      </div>

      <div className="text-center py-8">
        <KumikoSpinner size="lg" className="mb-4" />
        <p className="text-kumiko-gray-700">Please wait while we prepare your content</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of loading states with accompanying text.',
      },
    },
  },
};