import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LocationTypeCard } from './LocationTypeCard'
import { Store, Coffee, Utensils, Car, Building, Home, MapPin, Users } from 'lucide-react'

const meta: Meta<typeof LocationTypeCard> = {
  component: LocationTypeCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the location type',
    },
    description: {
      control: 'text',
      description: 'Description of the location type',
    },
    available: {
      control: 'boolean',
      description: 'Whether this location type is available',
    },
    isSelected: {
      control: 'boolean',
      description: 'Whether this card is currently selected',
    },
  },
}

export default meta

type Story = StoryObj<typeof LocationTypeCard>

export const Restaurant: Story = {
  args: {
    title: 'Restaurant',
    description: 'Full-service dining establishment with table service and extensive menu options',
    icon: Utensils,
    available: true,
    isSelected: false,
    onClick: () => console.log('Restaurant clicked'),
  },
}

export const RestaurantSelected: Story = {
  args: {
    title: 'Restaurant',
    description: 'Full-service dining establishment with table service and extensive menu options',
    icon: Utensils,
    available: true,
    isSelected: true,
    onClick: () => console.log('Restaurant selected'),
  },
}

export const Cafe: Story = {
  args: {
    title: 'Cafe',
    description: 'Casual dining spot serving coffee, light meals, and beverages',
    icon: Coffee,
    available: true,
    isSelected: false,
    onClick: () => console.log('Cafe clicked'),
  },
}

export const ComingSoon: Story = {
  args: {
    title: 'Food Truck',
    description: 'Mobile food service business operating from a vehicle',
    icon: Car,
    available: false,
    isSelected: false,
    onClick: () => console.log('Food truck clicked'),
  },
}

export const LongTitle: Story = {
  args: {
    title: 'Premium Fine Dining Restaurant',
    description:
      'Upscale dining establishment featuring gourmet cuisine, extensive wine selection, and exceptional service',
    icon: Utensils,
    available: true,
    isSelected: false,
    onClick: () => console.log('Long title clicked'),
  },
}

export const AllLocationTypes = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
    <LocationTypeCard
      title="Restaurant"
      description="Full-service dining with table service"
      icon={Utensils}
      available={true}
      isSelected={true}
      onClick={() => console.log('Restaurant selected')}
    />
    <LocationTypeCard
      title="Cafe"
      description="Coffee shop and light meals"
      icon={Coffee}
      available={true}
      isSelected={false}
      onClick={() => console.log('Cafe selected')}
    />
    <LocationTypeCard
      title="Retail Store"
      description="Physical store selling products"
      icon={Store}
      available={true}
      isSelected={false}
      onClick={() => console.log('Retail selected')}
    />
    <LocationTypeCard
      title="Food Truck"
      description="Mobile food service business"
      icon={Car}
      available={false}
      isSelected={false}
      onClick={() => console.log('Food truck selected')}
    />
    <LocationTypeCard
      title="Hotel"
      description="Accommodation and hospitality services"
      icon={Building}
      available={false}
      isSelected={false}
      onClick={() => console.log('Hotel selected')}
    />
    <LocationTypeCard
      title="Home Business"
      description="Business operated from residential location"
      icon={Home}
      available={false}
      isSelected={false}
      onClick={() => console.log('Home business selected')}
    />
  </div>
)

export const InteractionStates = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Available States</h3>
      <LocationTypeCard
        title="Default State"
        description="Available and not selected"
        icon={Store}
        available={true}
        isSelected={false}
        onClick={() => console.log('Default clicked')}
      />
      <LocationTypeCard
        title="Selected State"
        description="Available and currently selected"
        icon={Store}
        available={true}
        isSelected={true}
        onClick={() => console.log('Selected clicked')}
      />
    </div>
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Coming Soon States</h3>
      <LocationTypeCard
        title="Coming Soon"
        description="Not yet available for selection"
        icon={MapPin}
        available={false}
        isSelected={false}
        onClick={() => console.log('Coming soon clicked')}
      />
      <LocationTypeCard
        title="Coming Soon Selected"
        description="Not available but somehow selected"
        icon={MapPin}
        available={false}
        isSelected={true}
        onClick={() => console.log('Coming soon selected clicked')}
      />
    </div>
  </div>
)

export const ResponsiveGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 8 }, (_, i) => (
      <LocationTypeCard
        key={i}
        title={`Location Type ${i + 1}`}
        description={`Description for location type ${i + 1} with some additional details`}
        icon={[Store, Coffee, Utensils, Car, Building, Home, MapPin, Users][i]}
        available={i < 6}
        isSelected={i === 2}
        onClick={() => console.log(`Location ${i + 1} clicked`)}
      />
    ))}
  </div>
)
