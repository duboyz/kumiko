import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CreateMenuForm } from './CreateMenuForm'

const meta: Meta<typeof CreateMenuForm> = {
  component: CreateMenuForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the form is in loading state',
    },
    restaurantName: {
      control: 'text',
      description: 'Name of the restaurant',
    },
    restaurantId: {
      control: 'text',
      description: 'ID of the restaurant',
    },
    onCreateMenu: {
      action: 'menu created',
      description: 'Function called when menu is created',
    },
  },
}

export default meta

type Story = StoryObj<typeof CreateMenuForm>

export const Default: Story = {
  args: {
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}

export const LoadingState: Story = {
  args: {
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: true,
  },
}

export const CafeSetup: Story = {
  args: {
    restaurantId: '2',
    restaurantName: 'Corner Coffee Café',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}

export const Finedining: Story = {
  args: {
    restaurantId: '3',
    restaurantName: 'Le Petit Gourmet',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}

export const FastCasual: Story = {
  args: {
    restaurantId: '4',
    restaurantName: 'Quick Bites Kitchen',
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}

export const PizzaPlace: Story = {
  args: {
    restaurantId: '5',
    restaurantName: "Tony's Pizza Corner",
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    isLoading: false,
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Create Menu Form</h3>
        <p className="text-sm text-gray-600 mb-4">
          This form helps restaurant owners create their first menu. Try editing the form fields and submitting.
        </p>
        <CreateMenuForm
          restaurantId="demo-1"
          restaurantName="Demo Restaurant"
          onCreateMenu={(menuData) => {
            console.log('Demo menu created:', menuData)
            alert(`Menu "${menuData.name}" created for ${menuData.restaurantId}! Check console for details.`)
          }}
          isLoading={false}
        />
      </div>
    </div>
  )
}