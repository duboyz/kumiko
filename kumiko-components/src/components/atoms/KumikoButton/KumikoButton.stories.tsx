import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { KumikoButton, KumikoIconButton } from './KumikoButton';

// Simple icons for demo
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3a.5.5 0 0 1 .5.5v4h4a.5.5 0 0 1 0 1h-4v4a.5.5 0 0 1-1 0v-4h-4a.5.5 0 0 1 0-1h4v-4A.5.5 0 0 1 8 3z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
);

const meta: Meta<typeof KumikoButton> = {
  title: 'Kumiko/Atoms/KumikoButton',
  component: KumikoButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Minimalist button components following Japanese design principles with subtle interactions and clean typography.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'minimal', 'destructive'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl'],
    },
    width: {
      control: 'select',
      options: ['auto', 'full'],
    },
    shape: {
      control: 'select',
      options: ['rectangle', 'pill', 'square'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Continue',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button with black background - used for main actions',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button with subtle border - used for secondary actions',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Edit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Ghost button with no border - used for subtle actions',
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    children: 'Delete',
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal button with very subtle styling - used for least prominent actions',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Item',
  },
  parameters: {
    docs: {
      description: {
        story: 'Destructive button for dangerous actions',
      },
    },
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KumikoButton size="xs">Extra Small</KumikoButton>
      <KumikoButton size="sm">Small</KumikoButton>
      <KumikoButton size="base">Base</KumikoButton>
      <KumikoButton size="lg">Large</KumikoButton>
      <KumikoButton size="xl">Extra Large</KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button sizes from extra small to extra large',
      },
    },
  },
};

// Button states
export const States: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KumikoButton>Default</KumikoButton>
      <KumikoButton loading>Loading</KumikoButton>
      <KumikoButton disabled>Disabled</KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button states: default, loading with spinner, and disabled',
      },
    },
  },
};

// Width variations
export const WidthVariations: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <KumikoButton width="auto">Auto Width</KumikoButton>
      <KumikoButton width="full">Full Width</KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button width options: auto (content-based) and full width',
      },
    },
  },
};

// Shape variations
export const ShapeVariations: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KumikoButton shape="rectangle">Rectangle</KumikoButton>
      <KumikoButton shape="pill">Pill Shape</KumikoButton>
      <KumikoButton shape="square">□</KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button shapes: rectangle (default), pill, and square',
      },
    },
  },
};

// Buttons with icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KumikoButton leftIcon={<PlusIcon />}>Add Item</KumikoButton>
      <KumikoButton rightIcon={<ArrowRightIcon />}>Continue</KumikoButton>
      <KumikoButton leftIcon={<PlusIcon />} rightIcon={<ArrowRightIcon />}>
        Add and Continue
      </KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Buttons with left icons, right icons, or both',
      },
    },
  },
};

// Icon buttons
export const IconButtons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <KumikoIconButton icon={<PlusIcon />} aria-label="Add item" />
      <KumikoIconButton icon={<CloseIcon />} aria-label="Close" variant="ghost" />
      <KumikoIconButton icon={<CloseIcon />} aria-label="Delete" variant="destructive" />
      <KumikoIconButton icon={<PlusIcon />} aria-label="Loading" loading />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Square icon-only buttons in different variants',
      },
    },
  },
};

// Real-world usage examples
export const OnboardingNavigation: Story = {
  render: () => (
    <div className="flex justify-center gap-5">
      <KumikoButton variant="ghost" disabled>
        Back
      </KumikoButton>
      <KumikoButton>Continue</KumikoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Navigation buttons for onboarding flow matching the prototype',
      },
    },
  },
};

export const MenuBuilderActions: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Category actions */}
      <div className="flex items-center gap-2">
        <KumikoIconButton icon={<PlusIcon />} aria-label="Add item" variant="ghost" size="sm" />
        <KumikoIconButton icon={<CloseIcon />} aria-label="Delete category" variant="minimal" size="sm" />
      </div>

      {/* Item actions */}
      <div className="flex items-center gap-2">
        <KumikoButton variant="secondary" size="sm">
          + Option
        </KumikoButton>
        <KumikoIconButton icon={<CloseIcon />} aria-label="Delete item" variant="minimal" size="sm" />
      </div>

      {/* Add buttons */}
      <div className="space-y-4">
        <KumikoButton variant="secondary" width="full" size="lg">
          + Add Item
        </KumikoButton>
        <KumikoButton variant="primary" width="full" size="lg">
          + New Category
        </KumikoButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button combinations used in the menu builder interface',
      },
    },
  },
};

export const FormButtons: Story = {
  render: () => (
    <div className="space-y-6 max-w-md">
      {/* Business type selector */}
      <div className="space-y-4">
        <KumikoButton variant="secondary" width="full" size="lg">
          Restaurant
        </KumikoButton>
        <KumikoButton variant="secondary" width="full" size="lg">
          Hotel
        </KumikoButton>
        <KumikoButton variant="secondary" width="full" size="lg">
          Street Food
        </KumikoButton>
      </div>

      {/* Modal actions */}
      <div className="space-y-4 p-6 border border-kumiko-gray-100 rounded-base">
        <h3 className="text-lg font-light text-center mb-6">Choose item type</h3>
        <KumikoButton variant="secondary" width="full">
          Simple Item
        </KumikoButton>
        <KumikoButton variant="secondary" width="full">
          Item with Options
        </KumikoButton>
        <KumikoButton variant="minimal" width="full" size="sm">
          Cancel
        </KumikoButton>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Button layouts for forms and modals matching the prototypes',
      },
    },
  },
};

// Interactive examples
export const InteractiveExample: Story = {
  render: () => {
    const [loading, setLoading] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const handleClick = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setCount(c => c + 1);
      }, 2000);
    };

    return (
      <div className="text-center space-y-4">
        <div className="text-kumiko-gray-500">Clicked {count} times</div>
        <KumikoButton onClick={handleClick} loading={loading}>
          {loading ? 'Processing...' : 'Click me'}
        </KumikoButton>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive button with loading state simulation',
      },
    },
  },
};