import type { Meta, StoryObj } from '@storybook/react'
import BusinessConfirmation from './BusinessConfirmation'
import { ResponseBusinessDetails } from '@shared'

const meta: Meta<typeof BusinessConfirmation> = {
  title: 'Onboarding/BusinessConfirmation',
  component: BusinessConfirmation,
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
  args: {
    business: mockBusiness,
  },
}

export const WithCallbacks: Story = {
  args: {
    business: mockBusiness,
    onConfirm: data => {
      console.log('Confirmed restaurant data:', data)
    },
    onBack: () => {
      console.log('Back clicked')
    },
  },
}

export const NoBusiness: Story = {
  args: {
    business: null,
  },
}
