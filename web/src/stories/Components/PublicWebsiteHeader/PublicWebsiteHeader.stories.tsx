import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PublicWebsiteHeader } from './PublicWebsiteHeader'

// Mock data for pages
const mockPages = [
  { id: '1', title: 'Home', slug: 'home' },
  { id: '2', title: 'Menu', slug: 'menu' },
  { id: '3', title: 'About', slug: 'about' },
  { id: '4', title: 'Contact', slug: 'contact' },
]

const manyPages = [
  { id: '1', title: 'Home', slug: 'home' },
  { id: '2', title: 'Menu', slug: 'menu' },
  { id: '3', title: 'About Us', slug: 'about' },
  { id: '4', title: 'Our Story', slug: 'story' },
  { id: '5', title: 'Events', slug: 'events' },
  { id: '6', title: 'Catering', slug: 'catering' },
  { id: '7', title: 'Contact', slug: 'contact' },
]

const meta = {
  component: PublicWebsiteHeader,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    websiteName: {
      control: 'text',
      description: 'The name/title of the website',
    },
    pages: {
      control: 'object',
      description: 'Array of page objects with id, title, and slug',
    },
    currentPageSlug: {
      control: 'select',
      options: [undefined, 'home', 'menu', 'about', 'contact'],
      description: 'The slug of the currently active page',
    },
  },
  args: {
    websiteName: 'Bella Vista Restaurant',
    pages: mockPages,
    currentPageSlug: 'home',
  },
} satisfies Meta<typeof PublicWebsiteHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    websiteName: 'Bella Vista Restaurant',
    pages: mockPages,
    currentPageSlug: 'home',
  },
}

export const MenuActive: Story = {
  args: {
    websiteName: 'Bella Vista Restaurant',
    pages: mockPages,
    currentPageSlug: 'menu',
  },
}

export const AboutActive: Story = {
  args: {
    websiteName: 'Bella Vista Restaurant',
    pages: mockPages,
    currentPageSlug: 'about',
  },
}

export const NoActiveButton: Story = {
  args: {
    websiteName: 'Bella Vista Restaurant',
    pages: mockPages,
    currentPageSlug: undefined,
  },
}

export const LongWebsiteName: Story = {
  args: {
    websiteName: 'The Golden Dragon Chinese & Thai Cuisine Restaurant',
    pages: mockPages,
    currentPageSlug: 'home',
  },
}

export const ShortWebsiteName: Story = {
  args: {
    websiteName: 'Joe\'s',
    pages: mockPages,
    currentPageSlug: 'home',
  },
}

export const ManyPages: Story = {
  args: {
    websiteName: 'Grand Palace Restaurant',
    pages: manyPages,
    currentPageSlug: 'events',
  },
}

export const FewPages: Story = {
  args: {
    websiteName: 'Corner Cafe',
    pages: [
      { id: '1', title: 'Home', slug: 'home' },
      { id: '2', title: 'Menu', slug: 'menu' },
    ],
    currentPageSlug: 'menu',
  },
}

export const SinglePage: Story = {
  args: {
    websiteName: 'Simple Bistro',
    pages: [
      { id: '1', title: 'Home', slug: 'home' },
    ],
    currentPageSlug: 'home',
  },
}

export const DifferentBusinessTypes: Story = {
  render: () => (
    <div className="space-y-1">
      <PublicWebsiteHeader
        websiteName="Milano Pizza"
        pages={[
          { id: '1', title: 'Home', slug: 'home' },
          { id: '2', title: 'Pizza Menu', slug: 'menu' },
          { id: '3', title: 'Order Online', slug: 'order' },
          { id: '4', title: 'Contact', slug: 'contact' },
        ]}
        currentPageSlug="menu"
      />
      <div className="h-4 bg-gray-100" />
      <PublicWebsiteHeader
        websiteName="Zen Yoga Studio"
        pages={[
          { id: '1', title: 'Home', slug: 'home' },
          { id: '2', title: 'Classes', slug: 'classes' },
          { id: '3', title: 'Schedule', slug: 'schedule' },
          { id: '4', title: 'Pricing', slug: 'pricing' },
          { id: '5', title: 'About', slug: 'about' },
        ]}
        currentPageSlug="classes"
      />
      <div className="h-4 bg-gray-100" />
      <PublicWebsiteHeader
        websiteName="Tech Solutions Inc"
        pages={[
          { id: '1', title: 'Home', slug: 'home' },
          { id: '2', title: 'Services', slug: 'services' },
          { id: '3', title: 'Portfolio', slug: 'portfolio' },
          { id: '4', title: 'Blog', slug: 'blog' },
          { id: '5', title: 'Contact', slug: 'contact' },
        ]}
        currentPageSlug="services"
      />
    </div>
  ),
}

export const ResponsiveDemo: Story = {
  args: {
    websiteName: 'Mountain View Cafe',
    pages: mockPages,
    currentPageSlug: 'about',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const WithLongPageNames: Story = {
  args: {
    websiteName: 'International Cuisine Palace',
    pages: [
      { id: '1', title: 'Home', slug: 'home' },
      { id: '2', title: 'Our Extensive Menu Collection', slug: 'menu' },
      { id: '3', title: 'About Our Restaurant History', slug: 'about' },
      { id: '4', title: 'Private Events & Catering', slug: 'events' },
      { id: '5', title: 'Contact Information', slug: 'contact' },
    ],
    currentPageSlug: 'menu',
  },
}

export const EmptyState: Story = {
  args: {
    websiteName: 'New Restaurant',
    pages: [],
    currentPageSlug: undefined,
  },
}

export const StickyHeader: Story = {
  args: {
    websiteName: 'Riverside Grill',
    pages: mockPages,
    currentPageSlug: 'menu',
  },
  render: (args) => (
    <div>
      <PublicWebsiteHeader {...args} />
      <div className="h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Page Content</h1>
          <div className="space-y-4 text-gray-700">
            <p>This demonstrates the sticky header behavior. Scroll down to see the header stick to the top.</p>
            <p>The header has a white background with a subtle border and maintains its position at the top of the viewport.</p>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
}