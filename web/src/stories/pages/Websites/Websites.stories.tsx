import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Websites } from './Websites'
import { mockWebsites, mockWebsitePages, singleWebsite, emptyWebsites } from '@/stories/__mocks__'

const meta = {
  component: Websites,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onUpdateWebsite: { action: 'updateWebsite' },
  },
} satisfies Meta<typeof Websites>

export default meta

type Story = StoryObj<typeof Websites>

export const MultipleWebsites: Story = {
  args: {
    websites: mockWebsites,
    websitePages: mockWebsitePages,
    locationName: 'Bella Vista Restaurant',
  },
}

export const SingleWebsite: Story = {
  args: {
    websites: singleWebsite,
    websitePages: mockWebsitePages,
    locationName: 'Bella Vista Restaurant',
  },
}

export const NoWebsites: Story = {
  args: {
    websites: emptyWebsites,
    websitePages: [],
    locationName: 'New Restaurant',
  },
}

export const PublishedWebsite: Story = {
  args: {
    websites: [mockWebsites[0]],
    websitePages: mockWebsitePages,
    locationName: 'Bella Vista Restaurant',
  },
}

export const UnpublishedWebsite: Story = {
  args: {
    websites: [mockWebsites[1]],
    websitePages: [],
    locationName: 'Bella Vista Restaurant',
  },
}
