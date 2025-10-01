import { StoryObj } from '@storybook/nextjs-vite'
import { SelectWebsite } from './SelectWebsite'
import { WebsiteDto } from '@shared'

const mockWebsites: WebsiteDto[] = [
    {
        id: '1',
        name: 'Main Website',
        subdomain: 'main',
        description: 'Our primary restaurant website',
        isPublished: true,
        restaurantId: 'rest-1',
        restaurantName: 'Restaurant One',
    },
    {
        id: '2',
        name: 'Catering Site',
        subdomain: 'catering',
        description: 'Website for catering services',
        isPublished: false,
        restaurantId: 'rest-1',
        restaurantName: 'Restaurant One',
    },
    {
        id: '3',
        name: 'Events Portal',
        subdomain: 'events',
        description: 'Special events and bookings',
        isPublished: true,
        restaurantId: 'rest-1',
        restaurantName: 'Restaurant One',
    },
]

const meta = {
    component: SelectWebsite,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        websites: mockWebsites,
        selectedWebsiteId: '',
        onSelectWebsite: (websiteId: string) => {
            console.log('Selected website:', websiteId)
        },
    },
}

export const WithSelection: Story = {
    args: {
        websites: mockWebsites,
        selectedWebsiteId: '2',
        onSelectWebsite: (websiteId: string) => {
            console.log('Selected website:', websiteId)
        },
    },
}

export const SingleWebsite: Story = {
    args: {
        websites: [mockWebsites[0]],
        selectedWebsiteId: '1',
        onSelectWebsite: (websiteId: string) => {
            console.log('Selected website:', websiteId)
        },
    },
}

export const EmptyList: Story = {
    args: {
        websites: [],
        selectedWebsiteId: '',
        onSelectWebsite: (websiteId: string) => {
            console.log('Selected website:', websiteId)
        },
    },
}
