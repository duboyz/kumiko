import { PublicRestaurantMenuSection } from './PublicRestaurantMenuSection'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'

const meta = {
  component: PublicRestaurantMenuSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Note: This component fetches data from an API, so it will show a loading state or error in Storybook. Use the RestaurantMenuSection for better storybook visualization.',
      },
    },
  },
  args: {
    restaurantMenuSectionId: 'section-1',
    restaurantMenuId: 'menu-1',
    allowOrdering: true,
  },
} satisfies Meta<typeof PublicRestaurantMenuSection>

export default meta

export const WithOrdering: StoryObj<typeof meta> = {
  args: {
    restaurantMenuSectionId: 'section-1',
    restaurantMenuId: 'menu-1',
    allowOrdering: true,
  },
}

export const WithoutOrdering: StoryObj<typeof meta> = {
  args: {
    restaurantMenuSectionId: 'section-2',
    restaurantMenuId: 'menu-2',
    allowOrdering: false,
  },
}

export const LoadingState: StoryObj<typeof meta> = {
  parameters: {
    docs: {
      description: {
        story: 'This story demonstrates the loading state while fetching menu data from the API.',
      },
    },
  },
  args: {
    restaurantMenuSectionId: 'section-loading',
    restaurantMenuId: 'menu-loading',
    allowOrdering: true,
  },
}