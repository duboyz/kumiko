import { StoryObj } from '@storybook/nextjs-vite'
import { WebsitePageCard } from './WebsitePageCard'
import { WebsitePageDto, HeroSectionType, TextAlignment } from '@shared'

const meta = {
    title: 'Websites/WebsitePageCard',
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
    subdomain: 'myrestaurant',
    title: 'Home Page',
    slug: 'home',
    seoTitle: 'Welcome to Our Restaurant',
    seoDescription: 'Experience the finest dining in town',
    seoKeywords: 'restaurant, fine dining, cuisine',
    sections: [
        { id: '1', sortOrder: 0, websitePageId: '1', heroSection: { id: 'h1', title: 'Welcome', description: 'Best food in town', type: HeroSectionType.BackgroundImage } },
        { id: '2', sortOrder: 1, websitePageId: '1', restaurantMenuSection: { id: 'm1', restaurantMenuId: 'menu1', allowOrdering: false } },
        { id: '3', sortOrder: 2, websitePageId: '1', textSection: { id: 't1', title: 'About Us', text: 'Our story', alignText: TextAlignment.Left } },
    ],
}

const mockPageNoSections: WebsitePageDto = {
    id: '2',
    websiteId: 'website-1',
    subdomain: 'myrestaurant',
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
    subdomain: 'myrestaurant',
    title: 'Contact',
    slug: 'contact',
    seoTitle: 'Contact Us',
    seoDescription: 'Get in touch with us',
    seoKeywords: 'contact, location, phone',
    sections: [
        { id: '1', sortOrder: 0, websitePageId: '3', textSection: { id: 't1', title: 'Get in Touch', text: 'Get in touch', alignText: TextAlignment.Center } }
    ],
}

const mockPageLongTitle: WebsitePageDto = {
    id: '4',
    websiteId: 'website-1',
    subdomain: 'myrestaurant',
    title: 'Special Events & Private Dining',
    slug: 'events-and-private-dining',
    seoTitle: 'Special Events & Private Dining',
    seoDescription: 'Host your special events with us',
    seoKeywords: 'events, private dining, catering',
    sections: [
        { id: '1', sortOrder: 0, websitePageId: '4', heroSection: { id: 'h1', title: 'Host Your Event', description: 'Host with us', type: HeroSectionType.BackgroundImage } },
        { id: '2', sortOrder: 1, websitePageId: '4', textSection: { id: 't1', title: 'Event Gallery', text: 'Photos', alignText: TextAlignment.Left } },
        { id: '3', sortOrder: 2, websitePageId: '4', textSection: { id: 't2', title: 'Reservations', text: 'Book now', alignText: TextAlignment.Center } },
        { id: '4', sortOrder: 3, websitePageId: '4', textSection: { id: 't3', title: 'Testimonials', text: 'Reviews', alignText: TextAlignment.Left } },
        { id: '5', sortOrder: 4, websitePageId: '4', textSection: { id: 't4', title: 'FAQ', text: 'Questions', alignText: TextAlignment.Left } },
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
