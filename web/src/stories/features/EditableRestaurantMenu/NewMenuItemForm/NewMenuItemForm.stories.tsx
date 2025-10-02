import { StoryObj } from '@storybook/nextjs-vite'
import { NewMenuItemForm } from './NewMenuItemForm'
import { MenuCategoryDto } from '@shared'

const meta = {
  component: NewMenuItemForm,
  parameters: {
    layout: 'padded',
  },
}

const mockCategory: MenuCategoryDto = {
  id: 'c96c304c-1330-4f74-85b8-0426a28050df',
  name: 'Appetizers',
  description: 'Start your meal with our delicious appetizers',
  orderIndex: 0,
  restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
  menuCategoryItems: [
    {
      id: '143f4bfd-07f1-4aad-8d2f-91b245380a71',
      menuCategoryId: 'c96c304c-1330-4f74-85b8-0426a28050df',
      menuItemId: '34b8b762-3440-4021-90f9-b9e3a34257b5',
      orderIndex: 0,
      menuItem: {
        id: '34b8b762-3440-4021-90f9-b9e3a34257b5',
        name: 'Spring Rolls',
        description: 'Fresh vegetables wrapped in crispy spring roll wrapper',
        price: 12.99,
        isAvailable: true,
        restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
        menuCategoryItems: [],
        options: [],
        allergens: [],
        createdAt: '2025-09-17T13:43:02.401003Z',
        updatedAt: '2025-09-17T13:43:02.401003Z',
      },
      createdAt: '2025-09-17T13:43:02.441699Z',
      updatedAt: '2025-09-17T13:43:02.441699Z',
    },
  ],
  createdAt: '2025-09-17T13:40:38.004765Z',
  updatedAt: '2025-09-17T13:40:38.004766Z',
}

const emptyCategoryMock: MenuCategoryDto = {
  id: 'empty-category-id',
  name: 'Empty Category',
  description: 'A category with no items yet',
  orderIndex: 0,
  restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
  menuCategoryItems: [],
  createdAt: '2025-09-17T13:40:38.004765Z',
  updatedAt: '2025-09-17T13:40:38.004766Z',
}

export default meta

type Story = StoryObj<typeof meta>

export const Hidden: Story = {
  args: {
    category: mockCategory,
    isVisible: false,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}

export const Visible: Story = {
  args: {
    category: mockCategory,
    isVisible: true,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}

export const EmptyCategory: Story = {
  args: {
    category: emptyCategoryMock,
    isVisible: true,
    setIsVisible: () => {},
    onCancel: () => {},
  },
}
