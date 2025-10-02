import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AnnotationStep } from './AnnotationStep'

const meta: Meta<typeof AnnotationStep> = {
  component: AnnotationStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Simplified annotation step component for menu import flow. Allows users to draw rectangles around different menu elements (categories, items, prices, descriptions) using simple click-and-drag interaction.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    imagePreview: {
      description: 'Base64 or URL string of the menu image to annotate',
      control: { type: 'text' },
    },
    onAnnotate: {
      action: 'annotations-submitted',
      description: 'Callback fired when annotations are completed and submitted',
    },
    onBack: {
      action: 'back-clicked',
      description: 'Callback fired when the back button is clicked',
    },
    onSkip: {
      action: 'skip-clicked',
      description: 'Callback fired when the skip annotation button is clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof AnnotationStep>

// Sample menu image using a real menu photo from Unsplash
const sampleMenuImage =
  'https://images.squarespace-cdn.com/content/v1/5ecd55bf12463d63375e2af0/ecfa1f7b-a4ff-474b-904e-5a7f139d3e08/Oomasa+Menu+2025++1.png'

export const Default: Story = {
  args: {
    imagePreview: sampleMenuImage,
    onAnnotate: annotations => {
      console.log('Annotations submitted:', annotations)
    },
    onBack: () => {
      console.log('Back button clicked')
    },
    onSkip: () => {
      console.log('Skip button clicked')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default annotation step with a sample menu image. Users can select annotation types and draw simple rectangles around menu elements. Features include type selection, click-and-drag rectangle creation, and click-to-remove functionality.',
      },
    },
  },
}

export const WithRealMenuImage: Story = {
  args: {
    imagePreview: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&crop=center',
    onAnnotate: annotations => {
      console.log('Annotations submitted:', annotations)
    },
    onBack: () => {
      console.log('Back button clicked')
    },
    onSkip: () => {
      console.log('Skip button clicked')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Annotation step with a real restaurant menu image from Unsplash. This demonstrates the simplified component with actual menu content that users would typically annotate.',
      },
    },
  },
}
