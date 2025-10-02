import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UploadStep } from './UploadStep'

const meta: Meta<typeof UploadStep> = {
  title: 'Menus/UploadStep',
  component: UploadStep,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Upload step component for menu import flow. Allows users to upload menu images via drag-and-drop, file selection, or camera capture. Provides image preview and file validation.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onImageSelect: {
      action: 'image-selected',
      description: 'Callback fired when an image is selected and ready to continue',
    },
    onBack: {
      action: 'back-clicked',
      description: 'Callback fired when the back button is clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof UploadStep>

export const Default: Story = {
  args: {
    onImageSelect: (file: File, preview: string) => {
      console.log('Selected file:', file.name, 'Preview URL:', preview)
    },
    onBack: () => {
      console.log('Back button clicked')
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Default upload step showing the initial state with drag-and-drop area and upload options. Users can upload files by dragging and dropping, selecting from file system, or using camera capture.',
      },
    },
  },
}
