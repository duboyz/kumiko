import { StoryObj } from '@storybook/nextjs-vite'
import { WebsitePageCard } from './WebsitePageCard'
import { WebsitePageDto } from '@shared'

const meta = {
  component: WebsitePageCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof meta>

const mockPageWithSections: WebsitePageDto = {
  id: '1',
  websiteId: 'website-1',
  subdomain: 'restaurant-demo',
  title: 'Home Page',
  slug: 'home',
  seoTitle: 'Welcome to Our Restaurant',
  seoDescription: 'Experience the finest dining in town',
  seoKeywords: 'restaurant, fine dining, cuisine',
  sections: [
    { id: '1', sortOrder: 0, websitePageId: '1' },
    { id: '2', sortOrder: 1, websitePageId: '1' },
    { id: '3', sortOrder: 2, websitePageId: '1' },
  ],
}

const mockPageNoSections: WebsitePageDto = {
  id: '2',
  websiteId: 'website-1',
  subdomain: 'restaurant-demo',
  title: 'About Us',
  slug: 'about',
  seoTitle: 'About Our Restaurant',
  seoDescription: 'Learn more about our story',
  seoKeywords: 'about, history, team',
  sections: [],
}

const mockPageSingleSection: WebsitePageDto = {
  id: '3',
  websiteId: 'website-1',
  subdomain: 'restaurant-demo',
  title: 'Contact',
  slug: 'contact',
  seoTitle: 'Contact Us',
  seoDescription: 'Get in touch with us',
  seoKeywords: 'contact, location, phone',
  sections: [{ id: '1', sortOrder: 0, websitePageId: '3' }],
}

const mockPageLongTitle: WebsitePageDto = {
  id: '4',
  websiteId: 'website-1',
  subdomain: 'restaurant-demo',
  title: 'Our Special Events and Private Dining Experiences',
  slug: 'events-and-private-dining',
  seoTitle: 'Special Events & Private Dining',
  seoDescription: 'Host your special events with us',
  seoKeywords: 'events, private dining, catering',
  sections: [
    { id: '1', sortOrder: 0, websitePageId: '4' },
    { id: '2', sortOrder: 1, websitePageId: '4' },
    { id: '3', sortOrder: 2, websitePageId: '4' },
    { id: '4', sortOrder: 3, websitePageId: '4' },
    { id: '5', sortOrder: 4, websitePageId: '4' },
  ],
}

export const WithMultipleSections: Story = {
  args: {
    websitePage: mockPageWithSections,
  },
}

export const NoSections: Story = {
  args: {
    websitePage: mockPageNoSections,
  },
}

export const SingleSection: Story = {
  args: {
    websitePage: mockPageSingleSection,
  },
}

export const LongTitleAndManySections: Story = {
  args: {
    websitePage: mockPageLongTitle,
  },
}
