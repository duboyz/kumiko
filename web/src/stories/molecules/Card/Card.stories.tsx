import { Card } from "./Card"
import { StoryObj } from "@storybook/nextjs-vite"


const meta = {
    component: Card,
}

export default meta

export const Default: StoryObj<typeof Card> = {
    args: {
        title: 'This is a card title',
        description: 'This is a card description',
        children: <div>This is the card content</div>,
        footer: <div>This is the card footer</div>,
    },
}