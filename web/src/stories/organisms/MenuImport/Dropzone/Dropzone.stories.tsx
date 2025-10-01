import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Dropzone } from './Dropzone'

const meta: Meta<typeof Dropzone> = {
  component: Dropzone,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Reusable dropzone component for file uploads. Supports drag-and-drop, file selection, and camera capture with customizable file type acceptance.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFileSelect: {
      action: 'file-selected',
      description: 'Callback fired when a file is selected',
    },
    accept: {
      control: 'text',
      description: 'File types to accept (e.g., "image/*" or "image/png,image/jpeg")',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple file selection',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
}

export default meta
type Story = StoryObj<typeof Dropzone>

export const Default: Story = {
  args: {
    onFileSelect: (file: File) => {
      console.log('Selected file:', file.name, file.type, file.size)
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dropzone for image uploads. Supports drag-and-drop, file browsing, and camera capture.',
      },
    },
  },
}
