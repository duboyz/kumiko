import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SimpleUploadStep } from './SimpleUploadStep'

const meta: Meta<typeof SimpleUploadStep> = {
    component: SimpleUploadStep,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Simple upload step component for menu import flow. Allows users to upload menu images via drag-and-drop, file selection, or camera capture. Provides image preview and file validation.',
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
type Story = StoryObj<typeof SimpleUploadStep>

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
                story: 'Default upload step showing the initial state with drag-and-drop area and upload options. Users can upload files by dragging and dropping, selecting from file system, or using camera capture.',
            },
        },
    },
}
