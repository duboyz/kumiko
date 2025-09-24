import { HeroSectionType } from '@shared'
import { HeroSection } from './HeroSection'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

// Wrapper component for editable story with state management
const EditableHeroWrapper = (args: any) => {
  const [state, setState] = useState({
    title: args.title,
    description: args.description,
    buttonText: args.buttonText,
    buttonUrl: args.buttonUrl,
    backgroundImageUrl: args.backgroundImageUrl,
    imageUrl: args.imageUrl,
    imageAlt: args.imageAlt,
    backgroundColor: args.backgroundColor,
    textColor: args.textColor,
    backgroundOverlayColor: args.backgroundOverlayColor,
    buttonTextColor: args.buttonTextColor,
    buttonBackgroundColor: args.buttonBackgroundColor,
  })

  const handleUpdate = (field: string, value: string) => {
    setState(prev => ({ ...prev, [field]: value }))
    console.log(`Field "${field}" updated to:`, value)
  }

  const handleTypeChange = (type: HeroSectionType) => {
    console.log('Type changed to:', type)
  }

  return (
    <HeroSection
      {...args}
      {...state}
      onUpdate={handleUpdate}
      onTypeChange={handleTypeChange}
    />
  )
}

const meta = {
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'Welcome to Our Restaurant',
    description: 'Experience exceptional dining with our carefully crafted menu and warm atmosphere',
    buttonText: 'View Menu',
    buttonUrl: '#menu',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#ef4444',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.4)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
  },
} satisfies Meta<typeof HeroSection>

export default meta

export const BackgroundImage: StoryObj<typeof meta> = {
  args: {
    title: 'Authentic Japanese Cuisine',
    description: "Discover the art of traditional Japanese cooking with our chef's special selection",
    buttonText: 'Reserve Now',
    buttonUrl: '#reservation',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#dc2626',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.5)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
  },
}

export const DarkOverlay: StoryObj<typeof meta> = {
  args: {
    title: 'Premium Dining Experience',
    description: 'Indulge in our signature dishes crafted with the finest ingredients',
    buttonText: 'Book Table',
    buttonUrl: '#booking',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#059669',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.7)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
  },
}

export const ColoredOverlay: StoryObj<typeof meta> = {
  args: {
    title: 'Modern Japanese Fusion',
    description: 'Where tradition meets innovation in every bite',
    buttonText: 'Explore Menu',
    buttonUrl: '#menu',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#7c3aed',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(30, 64, 175, 0.3)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
  },
}

export const LightOverlay: StoryObj<typeof meta> = {
  args: {
    title: 'Fresh & Seasonal',
    description: 'Celebrating the best of each season with locally sourced ingredients',
    buttonText: 'View Seasonal Menu',
    buttonUrl: '#seasonal',
    buttonTextColor: '#1f2937',
    buttonBackgroundColor: '#f59e0b',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(255, 255, 255, 0.2)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
  },
}

export const EditableMode: StoryObj<typeof meta> = {
  render: (args) => <EditableHeroWrapper {...args} />,
  args: {
    title: 'Editable Hero Section',
    description: 'This is an example of the hero section in editing mode. Click on the text fields to edit them.',
    buttonText: 'Edit Me',
    buttonUrl: '#edit',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#3b82f6',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    backgroundOverlayColor: 'rgba(0, 0, 0, 0.4)',
    textColor: '#ffffff',
    type: HeroSectionType.BackgroundImage,
    isEditing: true,
  },
}

// Image Right Stories
export const ImageRight: StoryObj<typeof meta> = {
  args: {
    title: 'Welcome to Our Restaurant',
    description: 'Experience exceptional dining with our carefully crafted menu and warm atmosphere. Join us for an unforgettable culinary journey.',
    buttonText: 'Make Reservation',
    buttonUrl: '#reservation',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#dc2626',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Restaurant interior',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    type: HeroSectionType.ImageRight,
  },
}

export const ImageRightDark: StoryObj<typeof meta> = {
  args: {
    title: 'Premium Dining Experience',
    description: 'Indulge in our signature dishes crafted with the finest ingredients by our world-class chefs.',
    buttonText: 'View Menu',
    buttonUrl: '#menu',
    buttonTextColor: '#1f2937',
    buttonBackgroundColor: '#f59e0b',
    imageUrl:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Premium dish',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    type: HeroSectionType.ImageRight,
  },
}

export const ImageRightColored: StoryObj<typeof meta> = {
  args: {
    title: 'Fresh & Local Ingredients',
    description: 'We source our ingredients from local farms to bring you the freshest flavors in every bite.',
    buttonText: 'Learn More',
    buttonUrl: '#about',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#059669',
    imageUrl:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fresh ingredients',
    backgroundColor: '#f0f9ff',
    textColor: '#1e40af',
    type: HeroSectionType.ImageRight,
  },
}

export const ImageRightEditable: StoryObj<typeof meta> = {
  render: (args) => <EditableHeroWrapper {...args} />,
  args: {
    title: 'Editable Image Right Hero',
    description: 'This is an editable image right hero section. You can edit all the text fields and see the changes in real-time.',
    buttonText: 'Try Editing',
    buttonUrl: '#edit',
    buttonTextColor: '#ffffff',
    buttonBackgroundColor: '#7c3aed',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Restaurant scene',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    type: HeroSectionType.ImageRight,
    isEditing: true,
  },
}