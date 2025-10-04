import { StoryObj } from '@storybook/nextjs-vite'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantMenuDto } from '@shared'

const meta = {
  title: 'Menus/RestaurantMenu',
  component: RestaurantMenu,
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
      name: 'Forretter',
      description: '',
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
            name: 'Vårruller',
            description: '',
            price: 123,
  hasOptions: false,
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
        {
          id: '70dc7282-9726-4fb0-a61a-95d3f63f33ba',
          menuCategoryId: 'c96c304c-1330-4f74-85b8-0426a28050df',
          menuItemId: 'd8f66f88-1454-40c4-a576-b6fd10b54d0c',
          orderIndex: 1,
          menuItem: {
            id: 'd8f66f88-1454-40c4-a576-b6fd10b54d0c',
            name: 'Some item here',
            description: 'asdsadsadas',
            price: 1299,
  hasOptions: false,
            isAvailable: true,
            menuCategoryItems: [],
            options: [],
            allergens: [],
            restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
            createdAt: '2025-09-29T10:31:05.46865Z',
            updatedAt: '2025-09-29T10:31:05.468667Z',
          },
          createdAt: '2025-09-29T10:31:05.547503Z',
          updatedAt: '2025-09-29T10:31:05.547503Z',
        },
        {
          id: 'c0c1b1b9-e135-41a4-9259-9cd964fe583d',
          menuCategoryId: 'c96c304c-1330-4f74-85b8-0426a28050df',
          menuItemId: 'a5e9c297-1eef-40bb-82b9-47cb7e592e72',
          orderIndex: 2,
          menuItem: {
            id: 'a5e9c297-1eef-40bb-82b9-47cb7e592e72',
            name: 'asdasdasdsa',
            description: 'asdsadasda',
            price: 0,
  hasOptions: false,
            isAvailable: true,
            restaurantMenuId: 'dafadd2c-83e1-408e-9204-56ccb358bb89',
            menuCategoryItems: [],
            options: [],
            allergens: [],
            createdAt: '2025-09-29T10:31:24.392175Z',
            updatedAt: '2025-09-29T10:31:24.392175Z',
          },
          createdAt: '2025-09-29T10:31:24.414765Z',
          updatedAt: '2025-09-29T10:31:24.414765Z',
        },
      ],
      createdAt: '2025-09-17T13:40:38.004765Z',
      updatedAt: '2025-09-17T13:40:38.004766Z',
    },
  ],
  createdAt: '2025-09-17T13:40:30.555689Z',
  updatedAt: '2025-09-17T13:40:30.555714Z',
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    menu: mockMenu,
  },
}
