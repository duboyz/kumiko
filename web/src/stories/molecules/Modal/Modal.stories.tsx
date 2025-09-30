import { StoryObj } from "@storybook/nextjs-vite"
import { Modal } from "./Modal"

const meta = {
    component: Modal,
}

export default meta

export const Default: StoryObj<typeof Modal> = {
    args: {
        title: 'Modal',
        description: 'This is a modal',
        children: <div>Modal content</div>,
        triggerText: 'Open Modal',
    },
}