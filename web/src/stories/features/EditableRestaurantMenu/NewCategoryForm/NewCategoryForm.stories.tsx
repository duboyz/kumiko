import { StoryObj } from '@storybook/nextjs-vite'
import { NewCategoryForm } from './NewCategoryForm'
import { RestaurantMenuDto } from '@shared'

const meta = {
  component: NewCategoryForm,
  parameters: {
    layout: 'padded',
  },
}

const mockMenu: RestaurantMenuDto = {
  id: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
  name: 'Main Menu',
  description: 'Our carefully crafted selection of dishes',
  restaurantId: 'd0043ad2-11bf-4e8b-a94c-0f6d425696b4',
  categories: [
    {
      id: 'c96c304c-1330-4f74-85b8-0426a28050df',
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      orderIndex: 0,
      restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
      menuCategoryItems: [],
      createdAt: '2025-09-17T13:40:38.004765Z',
      updatedAt: '2025-09-17T13:40:38.004766Z',
    },
  ],
  createdAt: '2025-09-17T13:40:30.555689Z',
  updatedAt: '2025-09-17T13:40:30.555714Z',
}

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  args: {
    menu: mockMenu,
    isVisible: false,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}

export const Visible: Story = {
  args: {
    menu: mockMenu,
    isVisible: true,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}

export const EmptyMenu: Story = {
  args: {
    menu: {
      ...mockMenu,
      categories: [],
    },
    isVisible: true,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}
