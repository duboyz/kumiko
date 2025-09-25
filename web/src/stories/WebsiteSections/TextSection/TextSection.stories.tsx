import { TextAlignment } from '@shared'
import { TextSection } from './TextSection'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'

// Wrapper component for editable story with state management
const EditableTextWrapper = (args: any) => {
  const [state, setState] = useState({
    title: args.title,
    text: args.text,
    textColor: args.textColor,
  })

  const handleUpdate = (field: string, value: string) => {
    setState(prev => ({ ...prev, [field]: value }))
    console.log(`Field "${field}" updated to:`, value)
  }

  return <TextSection {...args} {...state} onUpdate={handleUpdate} />
}

const meta = {
  component: TextSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    title: 'About Our Restaurant',
    text: 'We are passionate about creating exceptional dining experiences with fresh, locally sourced ingredients and traditional cooking techniques passed down through generations.',
    alignText: TextAlignment.Left,
    textColor: '#1f2937',
  },
} satisfies Meta<typeof TextSection>

export default meta

export const LeftAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Our Story',
    text: 'Founded in 1985, our restaurant has been serving authentic flavors for nearly four decades. We believe in the power of good food to bring people together and create lasting memories.',
    alignText: TextAlignment.Left,
    textColor: '#1f2937',
  },
}

export const CenterAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Welcome',
    text: 'Experience the finest dining with our carefully curated menu featuring seasonal ingredients and innovative cooking techniques that honor tradition while embracing creativity.',
    alignText: TextAlignment.Center,
    textColor: '#1f2937',
  },
}

export const RightAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Our Mission',
    text: 'To create unforgettable culinary experiences that celebrate local ingredients, support our community, and bring joy to every guest who walks through our doors.',
    alignText: TextAlignment.Right,
    textColor: '#1f2937',
  },
}

export const ColoredText: StoryObj<typeof meta> = {
  args: {
    title: 'Fresh & Local',
    text: 'Every dish is crafted with ingredients sourced from local farms within 50 miles of our kitchen. We work directly with farmers to ensure the highest quality and freshest flavors.',
    alignText: TextAlignment.Center,
    textColor: '#059669',
  },
}

export const DarkText: StoryObj<typeof meta> = {
  args: {
    title: 'Award Winning',
    text: 'Our commitment to excellence has earned us recognition from food critics and culinary organizations. But our greatest reward is the satisfaction of our guests.',
    alignText: TextAlignment.Left,
    textColor: '#1f2937',
  },
}

export const EditableMode: StoryObj<typeof meta> = {
  render: args => <EditableTextWrapper {...args} />,
  args: {
    title: 'Editable Text Section',
    text: 'This is an editable text section. You can modify the title and text content in real-time. Try clicking on the fields to see the editing functionality.',
    alignText: TextAlignment.Center,
    textColor: '#7c3aed',
    isEditing: true,
  },
}
