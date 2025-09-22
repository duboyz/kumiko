import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { HeroSection } from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Kumiko/Organisms/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A versatile hero section component with multiple layout variants, designed with Japanese minimalist aesthetics. Perfect for landing pages and feature introductions.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The main headline text',
    },
    description: {
      control: 'text',
      description: 'Supporting description text below the title',
    },
    variant: {
      control: 'select',
      options: ['minimal', 'image-right', 'background-image'],
      description: 'Visual layout variant',
    },
    spacing: {
      control: 'select',
      options: ['compact', 'normal', 'spacious'],
      description: 'Vertical spacing amount',
    },
    buttonText: {
      control: 'text',
      description: 'Call-to-action button text',
    },
    buttonUrl: {
      control: 'text',
      description: 'Button destination URL',
    },
    buttonVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Button style variant',
    },
    imageUrl: {
      control: 'text',
      description: 'Image URL for image-right variant',
    },
    imageAlt: {
      control: 'text',
      description: 'Alt text for the image',
    },
    backgroundColor: {
      control: 'color',
      description: 'Custom background color',
    },
    textColor: {
      control: 'color',
      description: 'Custom text color',
    },
    backgroundImageUrl: {
      control: 'text',
      description: 'Background image URL for background-image variant',
    },
    backgroundOverlayColor: {
      control: 'color',
      description: 'Overlay color for background image variant',
    },
  },
  args: {
    onUpdate: fn(),
    onTypeChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Minimal: Story = {
  args: {
    variant: 'minimal',
    title: 'KUMIKO',
    description: 'Experience the art of Japanese minimalism in digital design. Clean, purposeful, and beautifully simple.',
    buttonText: 'Get Started',
    buttonUrl: '#',
  },
};

export const ImageRight: Story = {
  args: {
    variant: 'image-right',
    title: 'Beautiful Restaurant Websites',
    description: 'Create stunning, minimalist websites for your restaurant with our Japanese-inspired design system.',
    buttonText: 'View Examples',
    buttonUrl: '#',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Modern restaurant interior',
  },
};

export const BackgroundImage: Story = {
  args: {
    variant: 'background-image',
    title: 'Crafted with Precision',
    description: 'Every element thoughtfully designed to create harmony between form and function.',
    buttonText: 'Discover More',
    buttonUrl: '#',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#FFF',
  },
};
// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <HeroSection
        variant="minimal"
        spacing="compact"
        title="Compact Spacing"
        description="Less vertical padding for tighter layouts."
        buttonText="Compact"
      />
      <HeroSection
        variant="minimal"
        spacing="normal"
        title="Normal Spacing"
        description="Standard spacing for most use cases."
        buttonText="Normal"
      />
      <HeroSection
        variant="minimal"
        spacing="spacious"
        title="Spacious Layout"
        description="Extra padding for dramatic impact."
        buttonText="Spacious"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spacing options for various layout needs.',
      },
    },
  },
};

// Button variations
export const ButtonVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <HeroSection
        variant="minimal"
        title="Primary Button"
        description="Standard call-to-action styling."
        buttonText="Primary Action"
        buttonVariant="primary"
      />
      <HeroSection
        variant="minimal"
        title="Outline Button"
        description="Subtle, outlined button style."
        buttonText="Secondary Action"
        buttonVariant="secondary"
      />
      <HeroSection
        variant="minimal"
        title="Ghost Button"
        description="Minimal, text-only button style."
        buttonText="Ghost Action"
        buttonVariant="ghost"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different button style options.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    variant: 'minimal',
    title: 'Custom Branded Hero',
    description: 'Example with custom colors and styling to match brand guidelines.',
    buttonText: 'Brand Action',
    backgroundColor: '#f8f9fa',
    textColor: '#2d3748',
  },
};

// Real-world examples
export const RestaurantLanding: Story = {
  args: {
    variant: 'image-right',
    title: 'Tanaka Ramen',
    description: 'Authentic Japanese flavors crafted with traditional techniques and the freshest ingredients. Experience the art of perfect ramen.',
    buttonText: 'View Menu',
    buttonUrl: '/menu',
    imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Delicious ramen bowl',
    spacing: 'spacious',
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for a restaurant landing page.',
      },
    },
  },
};

export const HotelLanding: Story = {
  args: {
    variant: 'background-image',
    title: 'Sakura Ryokan',
    description: 'Traditional Japanese hospitality meets modern comfort in our carefully designed spaces.',
    buttonText: 'Book Your Stay',
    buttonUrl: '/booking',
    backgroundImageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.2)',
    textColor: '#fff',
    spacing: 'spacious',
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for a hotel landing page.',
      },
    },

  },
};

// Without button
export const NoButton: Story = {
  args: {
    variant: 'minimal',
    title: 'Pure Content',
    description: 'Sometimes the message speaks for itself without needing a call-to-action.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Hero section without a button for content-focused layouts.',
      },
    },
  },
};