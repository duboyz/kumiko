import { Meta, StoryObj } from '@storybook/nextjs-vite'
import { WebsitePages } from './WebsitePages'

const meta = {
  component: WebsitePages,
  args: {
    websiteId: '1',
    websitePages: [],
  },
} satisfies Meta<typeof WebsitePages>

export default meta

export const Default: StoryObj<typeof WebsitePages> = {
  args: {
    websitePages: [
      { id: '1', title: 'Home', slug: 'home', subdomain: 'home', websiteId: '1', sections: [] },
      { id: '2', title: 'Menu', slug: 'menu', subdomain: 'menu', websiteId: '1', sections: [] },
      { id: '3', title: 'About', slug: 'about', subdomain: 'about', websiteId: '1', sections: [] },
      { id: '4', title: 'Contact', slug: 'contact', subdomain: 'contact', websiteId: '1', sections: [] },
    ],
  },
}
