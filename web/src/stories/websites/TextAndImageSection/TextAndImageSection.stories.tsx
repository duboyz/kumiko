import type { Meta, StoryObj } from '@storybook/react'
import { TextAndImageSection } from './TextAndImageSection'
import { TextAlignment } from '@shared'

const meta = {
  title: 'Websites/TextAndImageSection',
  component: TextAndImageSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TextAndImageSection>

export default meta
type Story = StoryObj<typeof meta>

export const ImageRight: Story = {
  args: {
    title: 'Discover Our Amazing Features',
    content:
      'We provide cutting-edge solutions that help businesses grow and succeed in the digital age. Our platform is designed with you in mind.\n\nJoin thousands of satisfied customers who have already transformed their business with our innovative tools.',
    buttonText: 'Get Started',
    buttonUrl: '#',
    imageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
    imageAlt: 'Modern office workspace',
    textColor: '#1f2937',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    alignment: TextAlignment.Left,
    imageOnLeft: false,
    isEditing: false,
  },
}

export const ImageLeft: Story = {
  args: {
    title: 'Built for Modern Teams',
    content:
      'Collaborate seamlessly with your team using our intuitive platform. Share ideas, track progress, and achieve your goals together.\n\nExperience the future of teamwork today.',
    buttonText: 'Learn More',
    buttonUrl: '#',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    imageAlt: 'Team collaboration',
    textColor: '#1f2937',
    buttonColor: '#10b981',
    buttonTextColor: '#ffffff',
    alignment: TextAlignment.Left,
    imageOnLeft: true,
    isEditing: false,
  },
}

export const CenterAligned: Story = {
  args: {
    title: 'Centered Content',
    content: 'This section demonstrates centered text alignment with the image on the right side.',
    buttonText: 'Explore',
    buttonUrl: '#',
    imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    imageAlt: 'Creative workspace',
    textColor: '#1f2937',
    buttonColor: '#8b5cf6',
    buttonTextColor: '#ffffff',
    alignment: TextAlignment.Center,
    imageOnLeft: false,
    isEditing: false,
  },
}

export const EditMode: Story = {
  args: {
    title: 'Editable Section',
    content: 'You can edit all the content in this section. Click the settings icon to customize colors and layout.',
    buttonText: 'Click Me',
    buttonUrl: '#',
    imageUrl: 'https://images.pexels.com/photos/2014773/pexels-photo-2014773.jpeg',
    imageAlt: 'Section image',
    textColor: '#1f2937',
    buttonColor: '#3b82f6',
    buttonTextColor: '#ffffff',
    alignment: TextAlignment.Left,
    imageOnLeft: false,
    isEditing: true,
    onUpdate: (field: string, value: string | boolean) => {
      console.log(`Updated ${field}:`, value)
    },
  },
}

export const NoImage: Story = {
  args: {
    title: 'Content Without Image',
    content: 'This section demonstrates how the component looks when no image URL is provided.',
    buttonText: 'Learn More',
    buttonUrl: '#',
    textColor: '#1f2937',
    buttonColor: '#ef4444',
    buttonTextColor: '#ffffff',
    alignment: TextAlignment.Left,
    imageOnLeft: false,
    isEditing: false,
  },
}

export const MinimalContent: Story = {
  args: {
    title: 'Simple Title Only',
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
    imageAlt: 'Minimalist design',
    textColor: '#1f2937',
    alignment: TextAlignment.Center,
    imageOnLeft: false,
    isEditing: false,
  },
}
