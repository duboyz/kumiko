import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { BusinessTypeOption } from './BusinessTypeOption';
import { cn } from '@/lib/utils';

// Simple icons for demo
const RestaurantIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.21-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L14.89 11.53z"/>
  </svg>
);

const HotelIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
  </svg>
);

const StreetFoodIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1z"/>
    <path d="M16.03 14.99c0-8-15.03-8-15.03 0h15.03zM1.02 17h15v2h-15z"/>
  </svg>
);

const meta: Meta<typeof BusinessTypeOption> = {
  title: 'Kumiko/Molecules/BusinessTypeOption',
  component: BusinessTypeOption,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A selectable option card for business type selection, designed for onboarding flows with Japanese minimalist aesthetics.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main title/label for the option',
    },
    description: {
      control: 'text',
      description: 'Optional description text below the title',
    },
    selected: {
      control: 'boolean',
      description: 'Whether this option is currently selected',
    },
    variant: {
      control: 'select',
      options: ['default', 'selected', 'minimal'],
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    value: {
      control: 'text',
      description: 'Value passed to onSelect callback',
    },
  },
  args: {
    onSelect: fn(),
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    title: 'Restaurant',
    value: 'restaurant',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'Restaurant',
    description: 'Full-service dining establishment',
    value: 'restaurant',
  },
};

export const WithIcon: Story = {
  args: {
    title: 'Restaurant',
    description: 'Full-service dining establishment',
    icon: <RestaurantIcon />,
    value: 'restaurant',
  },
};

export const Selected: Story = {
  args: {
    title: 'Restaurant',
    description: 'Full-service dining establishment',
    icon: <RestaurantIcon />,
    selected: true,
    value: 'restaurant',
  },
};

export const Disabled: Story = {
  args: {
    title: 'Restaurant',
    description: 'Currently unavailable',
    icon: <RestaurantIcon />,
    disabled: true,
    value: 'restaurant',
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 w-80">
      <BusinessTypeOption
        title="Small Size"
        description="Compact option"
        icon={<RestaurantIcon />}
        size="sm"
        value="small"
      />
      <BusinessTypeOption
        title="Base Size"
        description="Standard option"
        icon={<RestaurantIcon />}
        size="base"
        value="base"
      />
      <BusinessTypeOption
        title="Large Size"
        description="Spacious option"
        icon={<RestaurantIcon />}
        size="lg"
        value="large"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size options for various layout needs',
      },
    },
  },
};

// Variant styles
export const VariantStyles: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 w-80">
      <BusinessTypeOption
        title="Default Variant"
        description="Standard border style"
        icon={<RestaurantIcon />}
        variant="default"
        value="default"
      />
      <BusinessTypeOption
        title="Selected Variant"
        description="When option is chosen"
        icon={<RestaurantIcon />}
        variant="selected"
        value="selected"
      />
      <BusinessTypeOption
        title="Minimal Variant"
        description="Subtle, borderless style"
        icon={<RestaurantIcon />}
        variant="minimal"
        value="minimal"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different visual styles for various design contexts',
      },
    },
  },
};

// Interactive selection example
export const InteractiveSelection: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = React.useState<string | null>(null);

    const options = [
      {
        value: 'restaurant',
        title: 'Restaurant',
        description: 'Full-service dining establishment',
        icon: <RestaurantIcon />,
      },
      {
        value: 'hotel',
        title: 'Hotel',
        description: 'Accommodation with food service',
        icon: <HotelIcon />,
      },
      {
        value: 'street-food',
        title: 'Street Food',
        description: 'Mobile or casual food service',
        icon: <StreetFoodIcon />,
      },
    ];

    return (
      <div className="space-y-4 w-80">
        <div className="text-center mb-6">
          <p className="text-sm text-kumiko-gray-600">
            Selected: {selectedValue || 'None'}
          </p>
        </div>

        {options.map((option) => (
          <BusinessTypeOption
            key={option.value}
            title={option.title}
            description={option.description}
            icon={option.icon}
            value={option.value}
            selected={selectedValue === option.value}
            onSelect={setSelectedValue}
          />
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing selection behavior',
      },
    },
  },
};

// States demonstration
export const AllStates: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-96">
      <BusinessTypeOption
        title="Default"
        description="Unselected state"
        icon={<RestaurantIcon />}
        value="default"
      />
      <BusinessTypeOption
        title="Selected"
        description="Active selection"
        icon={<RestaurantIcon />}
        selected
        value="selected"
      />
      <BusinessTypeOption
        title="Disabled"
        description="Not available"
        icon={<RestaurantIcon />}
        disabled
        value="disabled"
      />
      <BusinessTypeOption
        title="Disabled Selected"
        description="Selected but disabled"
        icon={<RestaurantIcon />}
        selected
        disabled
        value="disabled-selected"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All possible states: default, selected, disabled, and disabled+selected',
      },
    },
  },
};

// Real-world onboarding example
export const OnboardingExample: Story = {
  render: () => {
    const [selectedType, setSelectedType] = React.useState<string | null>(null);

    return (
      <div className="max-w-md mx-auto">
        <div className="text-center space-y-12">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-ultra-light tracking-widest mb-5 font-kumiko text-kumiko-black">
              KUMIKO
            </h1>
            <p className="text-xs font-normal tracking-wide uppercase text-kumiko-gray-400 font-kumiko">
              Setup
            </p>
          </div>

          {/* Step title */}
          <h2 className="text-xl font-light tracking-tight font-kumiko text-kumiko-black">
            What type of business?
          </h2>

          {/* Options */}
          <div className="space-y-4">
            <BusinessTypeOption
              title="Restaurant"
              icon={<RestaurantIcon />}
              value="restaurant"
              selected={selectedType === 'restaurant'}
              onSelect={setSelectedType}
            />
            <BusinessTypeOption
              title="Hotel"
              icon={<HotelIcon />}
              value="hotel"
              selected={selectedType === 'hotel'}
              onSelect={setSelectedType}
            />
            <BusinessTypeOption
              title="Street Food"
              icon={<StreetFoodIcon />}
              value="street-food"
              selected={selectedType === 'street-food'}
              onSelect={setSelectedType}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-center gap-5 pt-8">
            <button className="px-6 py-3 text-kumiko-gray-300 font-kumiko font-normal text-base tracking-tighter cursor-not-allowed">
              Back
            </button>
            <button
              className={cn(
                "px-6 py-4 font-kumiko font-normal text-base tracking-tighter transition-all duration-normal",
                selectedType
                  ? "bg-kumiko-black text-kumiko-white hover:bg-kumiko-gray-900"
                  : "bg-kumiko-gray-100 text-kumiko-gray-400 cursor-not-allowed"
              )}
              disabled={!selectedType}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete onboarding step layout matching the original prototype',
      },
    },
  },
};

// Modal option example
export const ModalOptionsExample: Story = {
  render: () => (
    <div className="max-w-sm mx-auto p-8 border border-kumiko-gray-100 rounded-base bg-kumiko-white">
      <div className="text-center space-y-6">
        <h3 className="text-lg font-light tracking-tight font-kumiko text-kumiko-black">
          Choose item type
        </h3>

        <div className="space-y-4">
          <BusinessTypeOption
            title="Simple Item"
            description="Single price, no variations"
            size="sm"
            value="simple"
          />
          <BusinessTypeOption
            title="Item with Options"
            description="Multiple sizes or variations"
            size="sm"
            value="options"
          />
        </div>

        <button className="text-xs font-normal text-kumiko-gray-300 tracking-tight hover:text-kumiko-gray-500 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Options displayed in a modal context from the menu builder prototype',
      },
    },
  },
};