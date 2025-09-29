import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Dropzone } from './Dropzone'

const meta: Meta<typeof Dropzone> = {
    title: 'Components/MenuImport/Dropzone',
    component: Dropzone,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Reusable dropzone component for file uploads. Supports drag-and-drop, file selection, and camera capture with customizable file type acceptance.',
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

export const ImagesOnly: Story = {
    args: {
        onFileSelect: (file: File) => {
            console.log('Selected image:', file.name, file.type, file.size)
        },
        accept: 'image/*',
    },
    parameters: {
        docs: {
            description: {
                story: 'Dropzone configured to accept only image files.',
            },
        },
    },
}

export const MultipleFiles: Story = {
    args: {
        onFileSelect: (file: File) => {
            console.log('Selected file:', file.name, file.type, file.size)
        },
        multiple: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Dropzone that allows multiple file selection.',
            },
        },
    },
}

export const CustomStyling: Story = {
    args: {
        onFileSelect: (file: File) => {
            console.log('Selected file:', file.name, file.type, file.size)
        },
        className: 'border-blue-300 bg-blue-50',
    },
    parameters: {
        docs: {
            description: {
                story: 'Dropzone with custom styling applied via className prop.',
            },
        },
    },
}

export const SpecificFileTypes: Story = {
    args: {
        onFileSelect: (file: File) => {
            console.log('Selected file:', file.name, file.type, file.size)
        },
        accept: 'image/png,image/jpeg,image/webp',
    },
    parameters: {
        docs: {
            description: {
                story: 'Dropzone configured to accept only specific image formats (PNG, JPEG, WebP).',
            },
        },
    },
}
