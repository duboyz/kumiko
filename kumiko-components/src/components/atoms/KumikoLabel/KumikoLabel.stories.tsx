import type { Meta, StoryObj } from '@storybook/react';
import { KumikoLabel } from './KumikoLabel';

const meta: Meta<typeof KumikoLabel> = {
  title: 'Kumiko/Atoms/KumikoLabel',
  component: KumikoLabel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A label component designed for form fields with Japanese minimalist styling, typically uppercase with wide letter spacing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'subtle'],
    },
    variant: {
      control: 'select',
      options: ['default', 'field', 'inline', 'required'],
      description: 'Predefined label variants for specific use cases',
    },
    uppercase: {
      control: 'boolean',
      description: 'Transform text to uppercase',
    },
    spacing: {
      control: 'select',
      options: ['tight', 'normal', 'wide', 'wider'],
      description: 'Letter spacing',
    },
    required: {
      control: 'boolean',
      description: 'Adds a red asterisk (*) to indicate required field',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small Label',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Label',
  },
};

export const Base: Story = {
  args: {
    size: 'base',
    children: 'Base Label',
  },
};

// Variants (common patterns)
export const FieldLabel: Story = {
  args: {
    variant: 'field',
    children: 'Business Name',
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard field label with uppercase styling and subtle color',
      },
    },
  },
};

export const InlineLabel: Story = {
  args: {
    variant: 'inline',
    children: 'Remember me',
  },
  parameters: {
    docs: {
      description: {
        story: 'Inline label for checkboxes and radio buttons',
      },
    },
  },
};

export const RequiredField: Story = {
  args: {
    variant: 'field',
    required: true,
    children: 'Email Address',
  },
  parameters: {
    docs: {
      description: {
        story: 'Required field label with red asterisk indicator',
      },
    },
  },
};

// Color variations
export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <KumikoLabel color="primary" uppercase>Primary Label</KumikoLabel>
      <KumikoLabel color="secondary" uppercase>Secondary Label</KumikoLabel>
      <KumikoLabel color="muted" uppercase>Muted Label</KumikoLabel>
      <KumikoLabel color="subtle" uppercase>Subtle Label</KumikoLabel>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variations of labels',
      },
    },
  },
};

// Uppercase variations
export const UppercaseVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <KumikoLabel uppercase={false}>Normal Case Label</KumikoLabel>
      <KumikoLabel uppercase={true}>Uppercase Label</KumikoLabel>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Labels with and without uppercase transformation',
      },
    },
  },
};

// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <KumikoLabel spacing="tight" uppercase>Tight Spacing</KumikoLabel>
      <KumikoLabel spacing="normal" uppercase>Normal Spacing</KumikoLabel>
      <KumikoLabel spacing="wide" uppercase>Wide Spacing</KumikoLabel>
      <KumikoLabel spacing="wider" uppercase>Wider Spacing</KumikoLabel>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different letter spacing options for emphasis',
      },
    },
  },
};

// Form field examples
export const FormFieldExamples: Story = {
  render: () => (
    <div className="space-y-8 max-w-md">
      <div>
        <KumikoLabel variant="field" htmlFor="business-name">
          Business Name
        </KumikoLabel>
        <div className="border-b border-kumiko-gray-50 pb-2">
          <input
            id="business-name"
            className="w-full bg-transparent text-kumiko-black placeholder:text-kumiko-gray-300 outline-none font-kumiko"
            placeholder="Enter your business name"
          />
        </div>
      </div>

      <div>
        <KumikoLabel variant="field" required htmlFor="email">
          Email Address
        </KumikoLabel>
        <div className="border-b border-kumiko-gray-50 pb-2">
          <input
            id="email"
            type="email"
            className="w-full bg-transparent text-kumiko-black placeholder:text-kumiko-gray-300 outline-none font-kumiko"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <input
          id="remember"
          type="checkbox"
          className="w-4 h-4 border border-kumiko-gray-100"
        />
        <KumikoLabel variant="inline" htmlFor="remember">
          Remember my preferences
        </KumikoLabel>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of labels used in form fields',
      },
    },
  },
};

// Onboarding form example
export const OnboardingExample: Story = {
  render: () => (
    <div className="space-y-8 max-w-md text-center">
      <div>
        <KumikoLabel variant="field">
          Business Type
        </KumikoLabel>
        <div className="grid gap-4 mt-4">
          <button className="border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors">
            Restaurant
          </button>
          <button className="border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors">
            Hotel
          </button>
          <button className="border border-kumiko-gray-100 p-6 text-kumiko-gray-700 hover:border-kumiko-gray-300 transition-colors">
            Street Food
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Label used in onboarding flow matching the prototype design',
      },
    },
  },
};