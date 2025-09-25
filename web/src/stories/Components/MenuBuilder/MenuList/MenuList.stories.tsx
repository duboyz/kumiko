import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { MenuList } from './MenuList'

const mockMenus = [
  {
    id: '1',
    name: 'Dinner Menu',
    description: 'Evening dining options with premium selections',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    categories: [
      {
        id: '1',
        name: 'Appetizers',
        description: 'Light starters',
        orderIndex: 1,
        restaurantMenuId: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        menuCategoryItems: [
          { id: '1', menuCategoryId: '1', menuItemId: '1', orderIndex: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          { id: '2', menuCategoryId: '1', menuItemId: '2', orderIndex: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        ]
      },
      {
        id: '2',
        name: 'Main Courses',
        description: 'Hearty entrees',
        orderIndex: 2,
        restaurantMenuId: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        menuCategoryItems: [
          { id: '3', menuCategoryId: '2', menuItemId: '3', orderIndex: 1, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          { id: '4', menuCategoryId: '2', menuItemId: '4', orderIndex: 2, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
          { id: '5', menuCategoryId: '2', menuItemId: '5', orderIndex: 3, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Lunch Menu',
    description: 'Quick and delicious midday options',
    restaurantId: '1',
    isActive: true,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    categories: [
      {
        id: '3',
        name: 'Salads',
        description: 'Fresh greens',
        orderIndex: 1,
        restaurantMenuId: '2',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z',
        menuCategoryItems: [
          { id: '6', menuCategoryId: '3', menuItemId: '6', orderIndex: 1, createdAt: '2024-01-10T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Breakfast Menu',
    description: 'Start your day right',
    restaurantId: '1',
    isActive: false,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-01T00:00:00Z',
    categories: []
  }
]

const meta: Meta<typeof MenuList> = {
  component: MenuList,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    isLoading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
    createMenuLoading: {
      control: 'boolean',
      description: 'Whether menu creation is in loading state',
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
      action: 'create menu',
      description: 'Function called when menu is created',
    },
    onDeleteMenu: {
      action: 'delete menu',
      description: 'Function called when menu is deleted',
    },
  },
}

export default meta

type Story = StoryObj<typeof MenuList>

export const Default: Story = {
  args: {
    menus: mockMenus,
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: false,
    createMenuLoading: false,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const Loading: Story = {
  args: {
    menus: [],
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: true,
    createMenuLoading: false,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const NoMenus: Story = {
  args: {
    menus: [],
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: false,
    createMenuLoading: false,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const SingleMenu: Story = {
  args: {
    menus: [mockMenus[0]],
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: false,
    createMenuLoading: false,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const CreatingMenu: Story = {
  args: {
    menus: mockMenus,
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: false,
    createMenuLoading: true,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const ManyMenus: Story = {
  args: {
    menus: [
      ...mockMenus,
      {
        id: '4',
        name: 'Happy Hour Menu',
        description: 'Special deals and drinks',
        restaurantId: '1',
        isActive: true,
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-02-01T00:00:00Z',
        categories: []
      },
      {
        id: '5',
        name: 'Weekend Brunch',
        description: 'Saturday and Sunday specials',
        restaurantId: '1',
        isActive: true,
        createdAt: '2024-02-05T00:00:00Z',
        updatedAt: '2024-02-05T00:00:00Z',
        categories: []
      }
    ],
    restaurantId: '1',
    restaurantName: 'Bella Vista Restaurant',
    isLoading: false,
    createMenuLoading: false,
    onCreateMenu: (menuData) => console.log('Create menu:', menuData),
    onDeleteMenu: (menuId) => console.log('Delete menu:', menuId),
  },
}

export const InteractionDemo = () => {
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">Menu List</h3>
        <p className="text-sm text-gray-600 mb-4">
          This component displays all menus for a restaurant with options to create, edit, and delete menus. Each menu shows its item count and last update date.
        </p>
        <MenuList
          menus={mockMenus}
          restaurantId="demo-1"
          restaurantName="Demo Restaurant"
          isLoading={false}
          createMenuLoading={false}
          onCreateMenu={(menuData) => {
            console.log('Demo create menu:', menuData)
            alert(`Creating menu "${menuData.name}" for ${menuData.restaurantId}!`)
          }}
          onDeleteMenu={(menuId) => {
            console.log('Demo delete menu:', menuId)
            alert(`Delete menu ${menuId}?`)
          }}
        />
      </div>
    </div>
  )
}