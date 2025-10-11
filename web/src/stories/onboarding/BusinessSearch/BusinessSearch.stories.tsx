import type { Meta, StoryObj } from '@storybook/react'
import BusinessSearch from './BusinessSearch'
import { ResponseBusinessDetails } from '@shared'

const meta: Meta<typeof BusinessSearch> = {
  title: 'Onboarding/BusinessSearch',
  component: BusinessSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

const mockBusiness: ResponseBusinessDetails = {
  placeId: '1',
  name: 'Pizza Express Oslo',
  formattedAddress: 'Karl Johans gate 1, 0154 Oslo, Norway',
  formattedPhoneNumber: '+47 22 00 00 00',
  internationalPhoneNumber: '+47 22 00 00 00',
  website: 'https://pizzaexpress.no',
  businessStatus: 'OPERATIONAL',
  types: ['restaurant', 'food', 'establishment'],
  rating: 4.2,
  userRatingsTotal: 150,
  priceLevel: 2,
  vicinity: 'Oslo',
  openingHours: {
    openNow: true,
    weekdayText: [
      'Monday: 11:00 AM – 10:00 PM',
      'Tuesday: 11:00 AM – 10:00 PM',
      'Wednesday: 11:00 AM – 10:00 PM',
      'Thursday: 11:00 AM – 10:00 PM',
      'Friday: 11:00 AM – 11:00 PM',
      'Saturday: 11:00 AM – 11:00 PM',
      'Sunday: 12:00 PM – 10:00 PM',
    ],
  },
  geometry: {
    location: {
      lat: 59.9139,
      lng: 10.7522,
    },
  },
  photos: [],
  reviews: [],
}

export const Default: Story = {
  args: {},
}

export const WithSelectedBusiness: Story = {
  args: {
    selectedBusiness: mockBusiness,
  },
}

export const WithBusinessSelectCallback: Story = {
  args: {
    onBusinessSelect: business => {
      console.log('Selected business:', business)
    },
  },
}
