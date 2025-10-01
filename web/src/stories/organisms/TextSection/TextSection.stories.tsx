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
    text: 'Founded in 1995, Bella Italia has been serving authentic Italian cuisine to the Oslo community for over 25 years. Our journey began with a simple passion: to bring the true flavors of Italy to Norway.\n\nEvery dish is crafted with care, using traditional recipes passed down through generations. We source the finest ingredients, from San Marzano tomatoes to Parmigiano-Reggiano, ensuring authenticity in every bite.\n\nToday, we remain committed to our founding principles: quality ingredients, traditional techniques, and warm hospitality that makes every guest feel like family.',
    alignText: TextAlignment.Center,
    textColor: '#000000',
  },
} satisfies Meta<typeof TextSection>

export default meta

export const CenterAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Our Story',
    text: 'Founded in 1995, Bella Italia has been serving authentic Italian cuisine to the Oslo community for over 25 years. Our journey began with a simple passion: to bring the true flavors of Italy to Norway.\n\nEvery dish is crafted with care, using traditional recipes passed down through generations. We source the finest ingredients, from San Marzano tomatoes to Parmigiano-Reggiano, ensuring authenticity in every bite.\n\nToday, we remain committed to our founding principles: quality ingredients, traditional techniques, and warm hospitality that makes every guest feel like family.',
    alignText: TextAlignment.Center,
    textColor: '#000000',
  },
}

export const LeftAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Our Philosophy',
    text: 'At Sakura Sushi, we believe that sushi is more than just food—it\'s an art form. Each piece is carefully crafted by our master chefs, who have trained for years to perfect their technique.\n\nWe follow the Japanese principle of "omakase," trusting the chef to select the finest seasonal ingredients and create a harmonious dining experience. This dedication to quality and tradition is what sets us apart.',
    alignText: TextAlignment.Left,
    textColor: '#000000',
  },
}

export const RightAligned: StoryObj<typeof meta> = {
  args: {
    title: 'Our Mission',
    text: 'To create unforgettable culinary experiences that celebrate local ingredients, support our community, and bring joy to every guest who walks through our doors.',
    alignText: TextAlignment.Right,
    textColor: '#000000',
  },
}

export const NoTitle: StoryObj<typeof meta> = {
  args: {
    text: 'Sometimes the content speaks for itself. This variant is perfect for introductory paragraphs, transitional content, or when you want to maintain a minimal aesthetic without section titles.\n\nThe clean typography and generous spacing ensure readability while maintaining the Japanese minimalist design philosophy throughout.',
    alignText: TextAlignment.Center,
    textColor: '#000000',
  },
}

export const EditableMode: StoryObj<typeof meta> = {
  render: args => <EditableTextWrapper {...args} />,
  args: {
    title: 'Editable Text Section',
    text: 'This is an editable text section. You can modify the title and text content in real-time. Try clicking on the fields to see the editing functionality.',
    alignText: TextAlignment.Center,
    textColor: '#000000',
    isEditing: true,
  },
}
