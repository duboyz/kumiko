import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MenuItemForm } from './MenuItemForm'

const mockMenus = [
  {
    id: '1',
    name: 'Dinner Menu',
    description: 'Evening dining options',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    categories: [],
  },
  {
    id: '2',
    name: 'Lunch Menu',
    description: 'Midday specials',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    categories: [],
  },
]

const meta: Meta<typeof MenuItemForm> = {
  component: MenuItemForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['create', 'edit'],
      description: 'Form mode - create new item or edit existing',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the form is in loading state',
    },
    onSubmit: {
      action: 'form submitted',
      description: 'Function called when form is submitted',
    },
    onCancel: {
      action: 'form cancelled',
      description: 'Function called when form is cancelled',
    },
  },
}

export default meta

type Story = StoryObj<typeof MenuItemForm>

export const CreateMode: Story = {
  args: {
    mode: 'create',
    menus: mockMenus,
    isLoading: false,
    onSubmit: (data) => console.log('Create item:', data),
    onCancel: () => console.log('Create cancelled'),
  },
}

export const EditMode: Story = {
  args: {
    mode: 'edit',
    menus: mockMenus,
    initialData: {
      id: '1',
      name: 'Grilled Salmon',
      description: 'Fresh Atlantic salmon with lemon butter sauce',
      price: 24.99,
      isAvailable: true,
      restaurantMenuId: '1',
    },
    isLoading: false,
    onSubmit: (data) => console.log('Update item:', data),
    onCancel: () => console.log('Edit cancelled'),
  },
}

export const LoadingState: Story = {
  args: {
    mode: 'create',
    menus: mockMenus,
    isLoading: true,
    onSubmit: (data) => console.log('Create item:', data),
    onCancel: () => console.log('Create cancelled'),
  },
}

export const NoMenus: Story = {
  args: {
    mode: 'create',
    menus: [],
    isLoading: false,
    onSubmit: (data) => console.log('Create item:', data),
    onCancel: () => console.log('Create cancelled'),
  },
}

export const UnavailableItem: Story = {
  args: {
    mode: 'edit',
    menus: mockMenus,
    initialData: {
      id: '2',
      name: 'Seasonal Special',
      description: 'Currently out of season',
      price: 18.99,
      isAvailable: false,
      restaurantMenuId: '2',
    },
    isLoading: false,
    onSubmit: (data) => console.log('Update item:', data),
    onCancel: () => console.log('Edit cancelled'),
  },
}

export const ExpensiveItem: Story = {
  args: {
    mode: 'edit',
    menus: mockMenus,
    initialData: {
      id: '3',
      name: 'Wagyu Beef Steak',
      description: 'Premium Japanese A5 wagyu beef, cooked to perfection with truffle butter',
      price: 149.99,
      isAvailable: true,
      restaurantMenuId: '1',
    },
    isLoading: false,
    onSubmit: (data) => console.log('Update item:', data),
    onCancel: () => console.log('Edit cancelled'),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-lg">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Menu Item Form</h3>
        <p className="text-sm text-gray-600 mb-4">
          Fill out the form below to create or edit a menu item. All fields are editable and form validation is active.
        </p>
        <MenuItemForm
          mode="create"
          menus={mockMenus}
          isLoading={false}
          onSubmit={(data) => {
            console.log('Demo form submitted:', data)
            alert(`Form submitted! Check console for details.`)
          }}
          onCancel={() => {
            console.log('Demo form cancelled')
            alert('Form cancelled!')
          }}
        />
      </div>
    </div>
  )
}