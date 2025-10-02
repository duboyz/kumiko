import { StoryObj } from '@storybook/nextjs-vite'
import { RestaurantMenus } from './RestaurantMenus'

const meta = {
    component: RestaurantMenus,
    parameters: {
        layout: 'padded',
        nextjs: {
            appDirectory: true,
            navigation: {
                pathname: '/menus',
            },
        },
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Loading: Story = {
    parameters: {
        mockData: {
            isLoading: true,
        },
    },
}

export const EmptyState: Story = {
    parameters: {
        mockData: {
            menus: [],
        },
    },
}
