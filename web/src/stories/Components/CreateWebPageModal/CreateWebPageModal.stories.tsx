import { StoryObj } from '@storybook/nextjs-vite'
import { CreateWebPageModal } from './CreateWebPageModal'

const meta = {
    component: CreateWebPageModal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        websiteId: 'website-123',
    },
}
