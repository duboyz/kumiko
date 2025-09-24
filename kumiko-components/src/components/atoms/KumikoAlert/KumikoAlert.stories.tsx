import type { Meta, StoryObj } from '@storybook/react';
import { KumikoAlert } from './KumikoAlert';

const meta: Meta<typeof KumikoAlert> = {
  title: 'Kumiko/Atoms/KumikoAlert',
  component: KumikoAlert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A minimalist alert component for displaying important messages with Japanese design aesthetics. Includes multiple variants for different types of notifications.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'warning', 'success', 'info'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'base', 'lg'],
      description: 'Size of the alert',
    },
    title: {
      control: 'text',
      description: 'Optional title for the alert',
    },
    icon: {
      control: 'boolean',
      description: 'Show/hide icon (use true/false to toggle default icon)',
      mapping: {
        true: undefined, // Use default icon
        false: null, // No icon
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    title: 'Information',
    children: 'This is a default alert message with minimal styling.',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    title: 'Error',
    children: 'Something went wrong. Please try again.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    children: 'Please review your settings before continuing.',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Success',
    children: 'Your changes have been saved successfully.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Info',
    children: 'Here\'s some helpful information about this feature.',
  },
};

// Without title
export const MessageOnly: Story = {
  args: {
    variant: 'default',
    children: 'Simple alert message without a title.',
  },
};

// Without icon
export const NoIcon: Story = {
  args: {
    variant: 'destructive',
    title: 'Clean Alert',
    children: 'This alert doesn\'t display an icon for a cleaner look.',
    icon: null,
  },
};

// Size variations
export const SizeVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <KumikoAlert size="sm" title="Small Alert" variant="info">
        This is a small alert with compact spacing.
      </KumikoAlert>

      <KumikoAlert size="base" title="Base Alert" variant="default">
        This is the standard alert size with normal spacing.
      </KumikoAlert>

      <KumikoAlert size="lg" title="Large Alert" variant="success">
        This is a large alert with spacious padding for important messages.
      </KumikoAlert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different size options for various levels of emphasis.',
      },
    },
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <KumikoAlert variant="default" title="Default">
        Standard informational message with neutral styling.
      </KumikoAlert>

      <KumikoAlert variant="info" title="Information">
        Helpful information or tips for the user.
      </KumikoAlert>

      <KumikoAlert variant="success" title="Success">
        Confirmation of successful actions or operations.
      </KumikoAlert>

      <KumikoAlert variant="warning" title="Warning">
        Important notices that require user attention.
      </KumikoAlert>

      <KumikoAlert variant="destructive" title="Error">
        Error messages and critical issues that need immediate attention.
      </KumikoAlert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available variants showcasing different semantic meanings.',
      },
    },
  },
};

// Real-world examples
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-6">
      <KumikoAlert variant="info" title="New Feature Available">
        We've added new menu customization options. Check out the updated menu builder to try them out.
      </KumikoAlert>

      <KumikoAlert variant="warning" title="Account Verification Pending">
        Your account is pending verification. Some features may be limited until verification is complete.
      </KumikoAlert>

      <KumikoAlert variant="destructive" title="Connection Failed">
        Unable to connect to the server. Please check your internet connection and try again.
      </KumikoAlert>

      <KumikoAlert variant="success" title="Menu Published">
        Your restaurant menu has been successfully published and is now live on your website.
      </KumikoAlert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples of alert messages you might use in an application.',
      },
    },
  },
};