import type { Meta, StoryObj } from '@storybook/react';
import { KumikoHeading } from './KumikoHeading';

const meta: Meta<typeof KumikoHeading> = {
  title: 'Kumiko/Atoms/KumikoHeading',
  component: KumikoHeading,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Japanese-inspired heading component with ultra-light weights and generous letter spacing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'Override the rendered HTML element',
    },
    size: {
      control: 'select',
      options: ['logo', 'logo-large', 'subtitle', 'section', 'step', 'category'],
      description: 'Predefined size variants for specific use cases',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'muted', 'subtle'],
    },
    weight: {
      control: 'select',
      options: ['ultra-light', 'light', 'normal', 'medium'],
    },
    spacing: {
      control: 'select',
      options: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest', 'ultra'],
      description: 'Letter spacing',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Level-based examples
export const H1: Story = {
  args: {
    level: 'h1',
    children: 'Main Page Heading',
  },
};

export const H2: Story = {
  args: {
    level: 'h2',
    children: 'Section Heading',
  },
};

export const H3: Story = {
  args: {
    level: 'h3',
    children: 'Subsection Heading',
  },
};

export const H4: Story = {
  args: {
    level: 'h4',
    children: 'Category Heading',
  },
};

export const H5: Story = {
  args: {
    level: 'h5',
    children: 'Small Heading',
  },
};

export const H6: Story = {
  args: {
    level: 'h6',
    children: 'Tiny Heading',
  },
};

// Size-based examples (Japanese design patterns)
export const Logo: Story = {
  args: {
    size: 'logo',
    children: 'KUMIKO',
  },
  parameters: {
    docs: {
      description: {
        story: 'Logo styling with ultra-light weight and generous letter spacing',
      },
    },
  },
};

export const LogoLarge: Story = {
  args: {
    size: 'logo-large',
    children: 'KUMIKO',
  },
  parameters: {
    docs: {
      description: {
        story: 'Large logo variant for hero sections',
      },
    },
  },
};

export const Subtitle: Story = {
  args: {
    size: 'subtitle',
    children: 'Menu Builder',
  },
  parameters: {
    docs: {
      description: {
        story: 'Uppercase subtitle with wide letter spacing',
      },
    },
  },
};

export const StepTitle: Story = {
  args: {
    size: 'step',
    children: 'What type of business?',
  },
  parameters: {
    docs: {
      description: {
        story: 'Step title for onboarding flows',
      },
    },
  },
};

export const CategoryTitle: Story = {
  args: {
    size: 'category',
    children: 'Appetizers',
  },
  parameters: {
    docs: {
      description: {
        story: 'Menu category title',
      },
    },
  },
};

// Color variations
export const ColorVariations: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <KumikoHeading level="h3" color="primary">Primary Color</KumikoHeading>
      <KumikoHeading level="h3" color="secondary">Secondary Color</KumikoHeading>
      <KumikoHeading level="h3" color="muted">Muted Color</KumikoHeading>
      <KumikoHeading level="h3" color="subtle">Subtle Color</KumikoHeading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different color variations following the monochromatic scale',
      },
    },
  },
};

// Weight variations
export const WeightVariations: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <KumikoHeading level="h3" weight="ultra-light">Ultra Light Weight</KumikoHeading>
      <KumikoHeading level="h3" weight="light">Light Weight</KumikoHeading>
      <KumikoHeading level="h3" weight="normal">Normal Weight</KumikoHeading>
      <KumikoHeading level="h3" weight="medium">Medium Weight</KumikoHeading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Font weight variations from ultra-light to medium',
      },
    },
  },
};

// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-4 text-center">
      <KumikoHeading level="h4" spacing="tighter">Tighter Spacing</KumikoHeading>
      <KumikoHeading level="h4" spacing="tight">Tight Spacing</KumikoHeading>
      <KumikoHeading level="h4" spacing="normal">Normal Spacing</KumikoHeading>
      <KumikoHeading level="h4" spacing="wide">Wide Spacing</KumikoHeading>
      <KumikoHeading level="h4" spacing="wider">Wider Spacing</KumikoHeading>
      <KumikoHeading level="h4" spacing="widest">Widest Spacing</KumikoHeading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Letter spacing variations for different emphasis levels',
      },
    },
  },
};

// Semantic override example
export const SemanticOverride: Story = {
  args: {
    level: 'h1',
    as: 'h3',
    children: 'Looks like H1 but renders as H3',
  },
  parameters: {
    docs: {
      description: {
        story: 'Visual styling of h1 but semantic HTML of h3 for proper document outline',
      },
    },
  },
};