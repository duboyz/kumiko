import { StoryObj } from "@storybook/nextjs-vite"
import { RestaurantMenus } from "./RestaurantMenus"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

// Mock router for Storybook
const mockRouter: AppRouterInstance = {
    push: (href: string) => {
        console.log('Navigate to:', href)
    },
    replace: (href: string) => {
        console.log('Replace with:', href)
    },
    refresh: () => {
        console.log('Refresh page')
    },
    back: () => {
        console.log('Go back')
    },
    forward: () => {
        console.log('Go forward')
    },
    prefetch: (href: string) => {
        console.log('Prefetch:', href)
    },
} as AppRouterInstance

const meta = {
    component: RestaurantMenus,
    parameters: {
        layout: 'padded',
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        router: mockRouter,
    },
}
