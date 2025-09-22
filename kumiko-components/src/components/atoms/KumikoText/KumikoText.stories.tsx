import type { Meta, StoryObj } from '@storybook/react';
import { KumikoText } from './KumikoText';

const meta: Meta<typeof KumikoText> = {
  title: 'Kumiko/Atoms/KumikoText',
  component: KumikoText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A text component following Japanese minimalist design principles with light weights and subtle colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label', 'small', 'strong', 'em'],
      description: 'HTML element to render',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'md', 'lg', 'xl'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'subtle', 'placeholder', 'disabled'],
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium'],
    },
    spacing: {
      control: 'select',
      options: ['tighter', 'tight', 'normal', 'wide'],
      description: 'Letter spacing',
    },
    variant: {
      control: 'select',
      options: ['default', 'description', 'meta', 'placeholder', 'hint', 'error'],
      description: 'Predefined text variants for specific use cases',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic sizes
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra small text (11px)',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small text (12px)',
  },
};

export const Base: Story = {
  args: {
    size: 'base',
    children: 'Base text (14px)',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium text (16px)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large text (18px)',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra large text (20px)',
  },
};

// Color variations
export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-3">
      <KumikoText color="primary">Primary text color (black)</KumikoText>
      <KumikoText color="secondary">Secondary text color (gray-700)</KumikoText>
      <KumikoText color="muted">Muted text color (gray-500)</KumikoText>
      <KumikoText color="subtle">Subtle text color (gray-400)</KumikoText>
      <KumikoText color="placeholder">Placeholder text color (gray-300)</KumikoText>
      <KumikoText color="disabled">Disabled text color (gray-200)</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variations following the monochromatic Japanese color scale',
      },
    },
  },
};

// Weight variations
export const WeightVariations: Story = {
  render: () => (
    <div className="space-y-3">
      <KumikoText weight="light">Light weight text (200)</KumikoText>
      <KumikoText weight="normal">Normal weight text (300)</KumikoText>
      <KumikoText weight="medium">Medium weight text (400)</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Font weight variations optimized for Japanese typography',
      },
    },
  },
};

// Variant examples (common patterns)
export const Description: Story = {
  args: {
    variant: 'description',
    children: 'Brief description of the dish with subtle gray color and normal weight.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Description text variant used for item descriptions',
      },
    },
  },
};

export const MetaText: Story = {
  args: {
    variant: 'meta',
    children: 'Meta information',
  },
  parameters: {
    docs: {
      description: {
        story: 'Small meta text for timestamps, categories, etc.',
      },
    },
  },
};

export const Placeholder: Story = {
  args: {
    variant: 'placeholder',
    children: 'Enter your business name',
  },
  parameters: {
    docs: {
      description: {
        story: 'Placeholder text styling',
      },
    },
  },
};

export const Hint: Story = {
  args: {
    variant: 'hint',
    children: 'This is a helpful hint for the user',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hint text for form fields and guidance',
      },
    },
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'This field is required',
  },
  parameters: {
    docs: {
      description: {
        story: 'Error message styling',
      },
    },
  },
};

// HTML element variations
export const ElementVariations: Story = {
  render: () => (
    <div className="space-y-3">
      <KumikoText as="p">Paragraph element</KumikoText>
      <KumikoText as="span">Span element</KumikoText>
      <KumikoText as="div">Div element</KumikoText>
      <KumikoText as="label">Label element</KumikoText>
      <KumikoText as="small">Small element</KumikoText>
      <KumikoText as="strong">Strong element</KumikoText>
      <KumikoText as="em">Emphasis element</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Same styling applied to different HTML elements',
      },
    },
  },
};

// Letter spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-3">
      <KumikoText spacing="tighter">Tighter letter spacing</KumikoText>
      <KumikoText spacing="tight">Tight letter spacing</KumikoText>
      <KumikoText spacing="normal">Normal letter spacing</KumikoText>
      <KumikoText spacing="wide">Wide letter spacing</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Letter spacing variations for different text emphasis',
      },
    },
  },
};

// Real-world usage examples
export const MenuDescription: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <KumikoText size="md" weight="medium">Salmon Nigiri</KumikoText>
      <KumikoText variant="description">
        Fresh Atlantic salmon over seasoned sushi rice, served with wasabi and pickled ginger.
      </KumikoText>
      <KumikoText variant="meta">Contains: Fish</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of text components used together for a menu item',
      },
    },
  },
};

export const FormField: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <KumikoText as="label" size="sm" color="secondary" spacing="tight">
        BUSINESS NAME
      </KumikoText>
      <div className="border-b border-kumiko-gray-50 pb-2">
        <KumikoText variant="placeholder">Enter your business name</KumikoText>
      </div>
      <KumikoText variant="hint">This will appear on your public menu</KumikoText>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of text components used in form fields',
      },
    },
  },
};