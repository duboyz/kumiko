import type { Meta, StoryObj } from '@storybook/react';
import { KumikoInput, KumikoTextarea } from './KumikoInput';
import { KumikoLabel } from '../KumikoLabel';

const meta: Meta<typeof KumikoInput> = {
  title: 'Kumiko/Atoms/KumikoInput',
  component: KumikoInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Minimalist input components with Japanese-inspired underline styling and subtle focus states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'minimal', 'outlined'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
    state: {
      control: 'select',
      options: ['default', 'error', 'success'],
    },
    error: {
      control: 'boolean',
      description: 'Shorthand for error state',
    },
    success: {
      control: 'boolean',
      description: 'Shorthand for success state',
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic input examples
export const Default: Story = {
  args: {
    placeholder: 'Enter text here',
  },
};

export const WithValue: Story = {
  args: {
    value: 'Sample text',
    placeholder: 'Enter text here',
  },
};

// Variant examples
export const Underline: Story = {
  args: {
    variant: 'underline',
    placeholder: 'Underline variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default underline variant matching Japanese minimalist design',
      },
    },
  },
};

export const Minimal: Story = {
  args: {
    variant: 'minimal',
    placeholder: 'Minimal variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Completely borderless minimal variant',
      },
    },
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    placeholder: 'Outlined variant',
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle outlined variant for forms needing more definition',
      },
    },
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <KumikoInput size="sm" placeholder="Small input" />
      <KumikoInput size="base" placeholder="Base input" />
      <KumikoInput size="lg" placeholder="Large input" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size variations of the input component',
      },
    },
  },
};

// State variations
export const States: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <KumikoInput placeholder="Default state" />
      <KumikoInput error placeholder="Error state" />
      <KumikoInput success placeholder="Success state" />
      <KumikoInput disabled placeholder="Disabled state" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states: default, error, success, and disabled',
      },
    },
  },
};

// Form field examples
export const FormFields: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <KumikoLabel variant="field" htmlFor="business-name">
          Business Name
        </KumikoLabel>
        <KumikoInput
          id="business-name"
          placeholder="Enter your business name"
        />
      </div>

      <div>
        <KumikoLabel variant="field" htmlFor="location">
          Location
        </KumikoLabel>
        <KumikoInput
          id="location"
          placeholder="City or address"
        />
      </div>

      <div>
        <KumikoLabel variant="field" htmlFor="email">
          Email Address
        </KumikoLabel>
        <KumikoInput
          id="email"
          type="email"
          placeholder="your@email.com"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form fields matching the onboarding prototype design',
      },
    },
  },
};

// Menu builder examples
export const MenuBuilderFields: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <KumikoInput
          variant="minimal"
          placeholder="Category name (e.g., Appetizers, Main Course)"
          className="text-2xl font-light tracking-normal"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <KumikoInput
          variant="minimal"
          placeholder="Item name"
          className="font-medium tracking-tight"
        />
        <KumikoInput
          variant="minimal"
          placeholder="190 kr"
          className="text-right"
        />
        <KumikoInput
          variant="minimal"
          placeholder="Select allergens"
          className="text-kumiko-gray-500"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input fields styled for the menu builder interface',
      },
    },
  },
};

// Textarea component stories
export const TextareaDefault: Story = {
  render: () => (
    <KumikoTextarea
      placeholder="Brief description of the dish"
      rows={2}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Basic textarea component',
      },
    },
  },
};

export const TextareaAutoResize: Story = {
  render: () => (
    <div className="w-96">
      <KumikoLabel variant="field">
        Description
      </KumikoLabel>
      <KumikoTextarea
        autoResize
        placeholder="Type a long description and watch it auto-resize..."
        defaultValue="This is a sample description that will grow as you type more content into the textarea. The component automatically adjusts its height based on the content."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Textarea with auto-resize functionality',
      },
    },
  },
};

export const TextareaSizes: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <KumikoTextarea size="sm" placeholder="Small textarea" />
      <KumikoTextarea size="base" placeholder="Base textarea" />
      <KumikoTextarea size="lg" placeholder="Large textarea" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different textarea sizes',
      },
    },
  },
};

// Real-world usage examples
export const OnboardingForm: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-8 text-center">
      <div>
        <h2 className="text-xl font-light tracking-tight mb-12 font-kumiko text-kumiko-black">
          Tell us about your business
        </h2>
      </div>

      <div className="text-left">
        <KumikoLabel variant="field" htmlFor="business-name">
          Business Name
        </KumikoLabel>
        <KumikoInput
          id="business-name"
          placeholder="Enter your business name"
        />
      </div>

      <div className="text-left">
        <KumikoLabel variant="field" htmlFor="location">
          Location
        </KumikoLabel>
        <KumikoInput
          id="location"
          placeholder="City or address"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete onboarding form matching the prototype design',
      },
    },
  },
};

export const MenuItemEditor: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="grid grid-cols-4 gap-6 items-start">
        <KumikoInput
          variant="minimal"
          placeholder="Item name (e.g., Nigiri)"
          className="font-medium tracking-tight"
        />
        <KumikoInput
          variant="minimal"
          placeholder="190 kr"
          className="text-right"
        />
        <div className="text-sm text-kumiko-gray-500 py-4 cursor-pointer border-b border-transparent hover:border-kumiko-gray-50 transition-colors">
          Select allergens
        </div>
        <KumikoTextarea
          variant="minimal"
          autoResize
          placeholder="Brief description of the dish"
          rows={1}
          className="text-kumiko-gray-500"
        />
      </div>

      <div className="ml-8 space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center text-sm">
          <KumikoInput
            variant="minimal"
            placeholder="Option name (e.g., 6 pieces, 12 pieces)"
            className="text-kumiko-gray-600"
          />
          <KumikoInput
            variant="minimal"
            placeholder="190 kr"
            className="text-right text-kumiko-gray-600"
          />
          <button className="text-kumiko-gray-300 hover:text-kumiko-gray-500 text-right">×</button>
        </div>
        <div className="grid grid-cols-3 gap-4 items-center text-sm">
          <KumikoInput
            variant="minimal"
            placeholder="Option name (e.g., 6 pieces, 12 pieces)"
            className="text-kumiko-gray-600"
          />
          <KumikoInput
            variant="minimal"
            placeholder="190 kr"
            className="text-right text-kumiko-gray-600"
          />
          <button className="text-kumiko-gray-300 hover:text-kumiko-gray-500 text-right">×</button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Menu item editor with options matching the menu builder prototype',
      },
    },
  },
};