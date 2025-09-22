import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TextSection } from './TextSection';

const meta: Meta<typeof TextSection> = {
  title: 'Kumiko/Organisms/TextSection',
  component: TextSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A flexible text content section component with Japanese minimalist design. Perfect for displaying titles, descriptions, and body content with various alignment and spacing options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Section title/heading',
    },
    text: {
      control: 'text',
      description: 'Main text content',
    },
    titleLevel: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading level for SEO',
    },
    titleSize: {
      control: 'select',
      options: ['logo', 'logo-large', 'subtitle', 'section', 'step', 'category'],
      description: 'Visual size of the title',
    },
    textSize: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'md', 'lg', 'xl'],
      description: 'Text size variant',
    },
    alignment: {
      control: 'select',
      options: ['left', 'center', 'right'],
      description: 'Text alignment',
    },
    spacing: {
      control: 'select',
      options: ['compact', 'normal', 'spacious'],
      description: 'Vertical spacing amount',
    },
    width: {
      control: 'select',
      options: ['narrow', 'normal', 'wide', 'full'],
      description: 'Maximum content width',
    },
    textColor: {
      control: 'color',
      description: 'Custom text color',
    },
    backgroundColor: {
      control: 'color',
      description: 'Custom background color',
    },
  },
  args: {
    onUpdate: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic examples
export const Default: Story = {
  args: {
    title: 'About Our Philosophy',
    text: 'We believe in the Japanese concept of "less is more" - creating beauty through simplicity, functionality, and mindful design. Every element serves a purpose.',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Pure Minimalism',
  },
};

export const TextOnly: Story = {
  args: {
    text: 'Sometimes the story speaks for itself without needing a title. This is pure content, letting the words flow naturally and create their own rhythm.',
  },
};

export const EmptyState: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Shows empty state when no content is provided.',
      },
    },
  },
};

// Alignment variations
export const AlignmentVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <TextSection
        title="Left Aligned"
        text="This content is aligned to the left, following traditional reading patterns."
        alignment="left"
      />
      <TextSection
        title="Center Aligned"
        text="This content is centered, creating balance and focus."
        alignment="center"
      />
      <TextSection
        title="Right Aligned"
        text="This content is aligned to the right, creating visual interest."
        alignment="right"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different text alignment options.',
      },
    },
  },
};

// Title size variations
export const TitleSizeVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <TextSection
        title="Logo Large"
        titleSize="logo-large"
        text="Used for major headings and brand statements."
      />
      <TextSection
        title="Section Heading"
        titleSize="section"
        text="Standard section headings for content organization."
      />
      <TextSection
        title="Category Title"
        titleSize="category"
        text="Smaller headings for subsections and categories."
      />
      <TextSection
        title="Subtitle"
        titleSize="subtitle"
        text="Small, uppercase subtitles for supporting information."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different title size options.',
      },
    },
  },
};

// Text size variations
export const TextSizeVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <TextSection
        title="Large Text"
        text="This is large text, perfect for introductory paragraphs and important content that needs emphasis."
        textSize="lg"
      />
      <TextSection
        title="Base Text"
        text="This is base text size, ideal for standard content and body copy that needs to be easily readable."
        textSize="base"
      />
      <TextSection
        title="Small Text"
        text="This is small text, useful for footnotes, captions, and supporting information that doesn't need to dominate the layout."
        textSize="sm"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different text size variants.',
      },
    },
  },
};

// Spacing variations
export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-4 bg-kumiko-gray-25">
      <TextSection
        title="Compact Spacing"
        text="Minimal padding for tight layouts."
        spacing="compact"
        backgroundColor="#ffffff"
      />
      <TextSection
        title="Normal Spacing"
        text="Standard spacing for most content sections."
        spacing="normal"
        backgroundColor="#ffffff"
      />
      <TextSection
        title="Spacious Layout"
        text="Extra padding for dramatic impact and breathing room."
        spacing="spacious"
        backgroundColor="#ffffff"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different spacing options.',
      },
    },
  },
};

// Width variations
export const WidthVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <TextSection
        title="Narrow Width"
        text="This content is constrained to a narrow width, perfect for focused reading and important announcements."
        width="narrow"
        alignment="center"
      />
      <TextSection
        title="Normal Width"
        text="This content uses normal width, providing a good balance between readability and space utilization for most content sections."
        width="normal"
      />
      <TextSection
        title="Wide Width"
        text="This content spans a wider area, suitable for detailed content, feature descriptions, or when you need more horizontal space for your text layout."
        width="wide"
      />
      <TextSection
        title="Full Width"
        text="This content spans the full available width, ideal for backgrounds, hero sections, or when you want the text to fill the entire container without any maximum width constraints."
        width="full"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different content width options.',
      },
    },
  },
};

// Custom styling
export const CustomStyling: Story = {
  args: {
    title: 'Branded Content',
    text: 'This section demonstrates custom styling with brand colors and background.',
    backgroundColor: '#f8f9fa',
    textColor: '#2d3748',
    spacing: 'spacious',
    alignment: 'center',
  },
};

// Real-world examples
export const AboutSection: Story = {
  args: {
    title: 'Our Story',
    titleSize: 'section',
    text: 'Founded in the heart of Tokyo, our restaurant brings together traditional Japanese culinary techniques with modern innovation. Every dish tells a story of heritage, craftsmanship, and the pursuit of perfection.\n\nOur master chef trained for over two decades in the ancient art of sushi-making, learning not just techniques but the philosophy of harmony between ingredient, season, and preparation.',
    textVariant: 'base',
    spacing: 'spacious',
    width: 'normal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for an "About" section.',
      },
    },
  },
};

export const FeatureDescription: Story = {
  args: {
    title: 'Seamless Ordering',
    titleSize: 'category',
    text: 'Experience the future of restaurant ordering with our intuitive platform designed for speed and simplicity.',
    textVariant: 'large',
    alignment: 'center',
    spacing: 'normal',
    width: 'narrow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Real-world example for a feature description.',
      },
    },
  },
};

export const LongFormContent: Story = {
  args: {
    title: 'The Art of Japanese Hospitality',
    titleSize: 'section',
    text: 'Omotenashi is more than just customer service—it\'s a Japanese philosophy of hospitality that puts the guest\'s needs first, anticipating them before they\'re even expressed.\n\nThis concept permeates every aspect of our restaurant, from the moment you step through our doors to the final bite of your meal. Our staff doesn\'t just serve food; they create an experience that honors both the cuisine and the diner.\n\nEach interaction is carefully considered, each detail thoughtfully planned. We believe that true hospitality comes from the heart, expressed through genuine care and attention to the smallest details that make the biggest difference.\n\nThis is the essence of our approach—creating not just a meal, but a moment of connection, respect, and genuine Japanese hospitality.',
    textVariant: 'base',
    spacing: 'spacious',
    width: 'normal',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with longer content demonstrating multi-paragraph text handling.',
      },
    },
  },
};