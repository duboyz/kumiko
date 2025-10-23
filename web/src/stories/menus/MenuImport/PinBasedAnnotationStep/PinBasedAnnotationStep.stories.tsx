import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PinBasedAnnotationStep } from './PinBasedAnnotationStep'

const meta: Meta<typeof PinBasedAnnotationStep> = {
  title: 'Menus/PinBasedAnnotationStep',
  component: PinBasedAnnotationStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Pin-based annotation step for menu import. Users can click on the image to place pins for different menu elements (categories, items, prices, descriptions). Much more mobile-friendly than drag-and-drop boxes.',
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
type Story = StoryObj<typeof PinBasedAnnotationStep>

export const Default: Story = {
  args: {
    imagePreview: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
  },
}

export const WithSampleMenu: Story = {
  args: {
    imagePreview: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example with a sample menu image to demonstrate the pin-based annotation interface.',
      },
    },
  },
}
