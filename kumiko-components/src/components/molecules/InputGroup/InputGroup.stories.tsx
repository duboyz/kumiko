import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup } from './InputGroup';
import { KumikoInput, KumikoTextarea } from '../../atoms/KumikoInput';

const meta: Meta<typeof InputGroup> = {
  title: 'Kumiko/Molecules/InputGroup',
  component: InputGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A complete form field combining label, input, and validation messaging following Japanese minimalist principles.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input field',
    },
    hint: {
      control: 'text',
      description: 'Helpful hint text shown below the input',
    },
    error: {
      control: 'text',
      description: 'Error message (overrides hint when present)',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required with an asterisk',
    },
    spacing: {
      control: 'select',
      options: ['compact', 'normal', 'relaxed'],
      description: 'Vertical spacing between elements',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    label: 'Business Name',
    children: <KumikoInput placeholder="Enter your business name" />,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Email Address',
    hint: 'We will use this to send you important updates',
    children: <KumikoInput type="email" placeholder="your@email.com" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Business Name',
    error: 'Business name is required',
    children: <KumikoInput placeholder="Enter your business name" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Email Address',
    required: true,
    hint: 'This field is required for account creation',
    children: <KumikoInput type="email" placeholder="your@email.com" />,
  },
};

// Textarea example
export const WithTextarea: Story = {
  args: {
    label: 'Description',
    hint: 'Tell us about your business (optional)',
    children: <KumikoTextarea placeholder="Brief description of your business..." />,
  },
};

export const TextareaWithError: Story = {
  args: {
    label: 'Business Description',
    required: true,
    error: 'Please provide a description (minimum 10 characters)',
    children: <KumikoTextarea placeholder="Describe your business..." />,
  },
};

// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <InputGroup
        label="Compact Spacing"
        hint="Tighter vertical spacing"
        spacing="compact"
      >
        <KumikoInput placeholder="Compact example" />
      </InputGroup>

      <InputGroup
        label="Normal Spacing"
        hint="Standard vertical spacing"
        spacing="normal"
      >
        <KumikoInput placeholder="Normal example" />
      </InputGroup>

      <InputGroup
        label="Relaxed Spacing"
        hint="More generous vertical spacing"
        spacing="relaxed"
      >
        <KumikoInput placeholder="Relaxed example" />
      </InputGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spacing options for various design contexts',
      },
    },
  },
};

// Input variants
export const InputVariants: Story = {
  render: () => (
    <div className="space-y-8 w-80">
      <InputGroup label="Underline Input" hint="Default underline style">
        <KumikoInput variant="underline" placeholder="Underline variant" />
      </InputGroup>

      <InputGroup label="Minimal Input" hint="Borderless minimal style">
        <KumikoInput variant="minimal" placeholder="Minimal variant" />
      </InputGroup>

      <InputGroup label="Outlined Input" hint="Subtle border outline">
        <KumikoInput variant="outlined" placeholder="Outlined variant" />
      </InputGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'InputGroup with different input variants',
      },
    },
  },
};

// Real-world onboarding examples
export const OnboardingForm: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center mb-12">
        <h2 className="text-xl font-light tracking-tight mb-4 font-kumiko text-kumiko-black">
          Tell us about your business
        </h2>
      </div>

      <InputGroup
        label="Business Name"
        required
        hint="This will appear on your public menu"
      >
        <KumikoInput placeholder="Enter your business name" />
      </InputGroup>

      <InputGroup
        label="Location"
        required
        hint="City or full address"
      >
        <KumikoInput placeholder="City or address" />
      </InputGroup>

      <InputGroup
        label="Business Description"
        hint="Brief description of your business (optional)"
      >
        <KumikoTextarea
          placeholder="Tell customers about your business..."
          rows={3}
        />
      </InputGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete onboarding form using InputGroup components',
      },
    },
  },
};

// Error states example
export const ErrorStates: Story = {
  render: () => (
    <div className="max-w-md mx-auto space-y-8">
      <InputGroup
        label="Business Name"
        required
        error="Business name is required"
      >
        <KumikoInput placeholder="Enter your business name" />
      </InputGroup>

      <InputGroup
        label="Email Address"
        required
        error="Please enter a valid email address"
      >
        <KumikoInput type="email" placeholder="your@email.com" />
      </InputGroup>

      <InputGroup
        label="Phone Number"
        error="Phone number must be at least 10 digits"
      >
        <KumikoInput type="tel" placeholder="+1 (555) 123-4567" />
      </InputGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form fields showing various error states',
      },
    },
  },
};

// Menu builder example
export const MenuBuilderUsage: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <InputGroup
        label="Category Name"
        hint="e.g., Appetizers, Main Course, Desserts"
      >
        <KumikoInput
          variant="minimal"
          placeholder="Category name"
          className="text-2xl font-light tracking-normal"
        />
      </InputGroup>

      <div className="border-t border-kumiko-gray-50 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Item Name" required>
            <KumikoInput
              variant="minimal"
              placeholder="Item name"
              className="font-medium"
            />
          </InputGroup>

          <InputGroup label="Price" required>
            <KumikoInput
              variant="minimal"
              placeholder="190 kr"
              className="text-right"
            />
          </InputGroup>
        </div>

        <InputGroup
          label="Description"
          hint="Brief description of the dish"
          className="mt-6"
        >
          <KumikoTextarea
            variant="minimal"
            placeholder="Describe the dish..."
            autoResize
          />
        </InputGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'InputGroup used in menu builder interface matching the prototype',
      },
    },
  },
};