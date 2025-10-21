import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MultiImageUploadStep } from './MultiImageUploadStep'

const meta: Meta<typeof MultiImageUploadStep> = {
  title: 'Menus/MultiImageUploadStep',
  component: MultiImageUploadStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Multi-image upload step for menu import. Allows users to upload multiple menu images at once, with preview and management capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onImagesSelect: {
      action: 'images-selected',
      description: 'Callback fired when images are selected and user clicks continue',
    },
    onBack: {
      action: 'back-clicked',
      description: 'Callback fired when the back button is clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof MultiImageUploadStep>

export const Default: Story = {
  args: {},
}

export const WithImages: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Example with some pre-uploaded images to show the interface.',
      },
    },
  },
}
