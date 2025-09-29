import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { UploadStep } from './UploadStep'

const meta: Meta<typeof UploadStep> = {
    component: UploadStep,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Upload step component for menu import flow. Allows users to upload menu images via drag-and-drop, file selection, or camera capture. Provides image preview and file validation.',
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
                story: 'Default upload step showing the initial state with drag-and-drop area and upload options. Users can upload files by dragging and dropping, selecting from file system, or using camera capture.',
            },
        },
    },
}

export const Interactive: Story = {
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
                story: 'Interactive demo of the upload step. Try uploading an image file to see the preview functionality and file information display.',
            },
        },
    },
}

export const MobileOptimized: Story = {
    args: {
        onImageSelect: (file: File, preview: string) => {
            console.log('Selected file:', file.name, 'Preview URL:', preview)
        },
        onBack: () => {
            console.log('Back button clicked')
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile-optimized view of the upload step. On mobile devices, the camera capture option allows direct photo taking for menu image upload.',
            },
        },
    },
}

export const Tablet: Story = {
    args: {
        onImageSelect: (file: File, preview: string) => {
            console.log('Selected file:', file.name, 'Preview URL:', preview)
        },
        onBack: () => {
            console.log('Back button clicked')
        },
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Tablet view of the upload step, optimized for touch interactions and medium screen sizes.',
            },
        },
    },
}

export const WithFileSelected: Story = {
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
                story: 'Upload step with a file already selected, showing the preview state. Displays image preview, file information, and continue button enabled. Note: This story shows the empty state since we cannot pre-populate file selection in Storybook.',
            },
        },
    },
}
