import { StoryObj } from "@storybook/nextjs-vite"
import { MenuCategory } from "./MenuCategory"
import { MenuCategoryDto } from "@shared"

const meta = {
    component: MenuCategory,
    parameters: {
        layout: 'padded',
    },
}

const mockCategory: MenuCategoryDto = {
    id: "c96c304c-1330-4f74-85b8-0426a28050df",
    name: "Appetizers",
    description: "Start your meal with our delicious appetizers",
    orderIndex: 0,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [
        {
            id: "143f4bfd-07f1-4aad-8d2f-91b245380a71",
            menuCategoryId: "c96c304c-1330-4f74-85b8-0426a28050df",
            menuItemId: "34b8b762-3440-4021-90f9-b9e3a34257b5",
            orderIndex: 0,
            menuItem: {
                id: "34b8b762-3440-4021-90f9-b9e3a34257b5",
                name: "Spring Rolls",
                description: "Fresh vegetables wrapped in crispy spring roll wrapper",
                price: 12.99,
                isAvailable: true,
                restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
                menuCategoryItems: [],
                options: [],
                allergens: [],
                createdAt: "2025-09-17T13:43:02.401003Z",
                updatedAt: "2025-09-17T13:43:02.401003Z"
            },
            createdAt: "2025-09-17T13:43:02.441699Z",
            updatedAt: "2025-09-17T13:43:02.441699Z"
        },
        {
            id: "70dc7282-9726-4fb0-a61a-95d3f63f33ba",
            menuCategoryId: "c96c304c-1330-4f74-85b8-0426a28050df",
            menuItemId: "d8f66f88-1454-40c4-a576-b6fd10b54d0c",
            orderIndex: 1,
            menuItem: {
                id: "d8f66f88-1454-40c4-a576-b6fd10b54d0c",
                name: "Caesar Salad",
                description: "Crisp romaine lettuce with parmesan cheese and croutons",
                price: 15.99,
                isAvailable: true,
                restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
                menuCategoryItems: [],
                options: [],
                allergens: [],
                createdAt: "2025-09-29T10:31:05.46865Z",
                updatedAt: "2025-09-29T10:31:05.468667Z"
            },
            createdAt: "2025-09-29T10:31:05.547503Z",
            updatedAt: "2025-09-29T10:31:05.547503Z"
        }
    ],
    createdAt: "2025-09-17T13:40:38.004765Z",
    updatedAt: "2025-09-17T13:40:38.004766Z"
}

const emptyCategoryMock: MenuCategoryDto = {
    id: "empty-category-id",
    name: "Empty Category",
    description: "A category with no items yet",
    orderIndex: 0,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [],
    createdAt: "2025-09-17T13:40:38.004765Z",
    updatedAt: "2025-09-17T13:40:38.004766Z"
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        category: mockCategory,
    },
}

export const EmptyCategory: Story = {
    args: {
        category: emptyCategoryMock,
    },
}

export const LongDescription: Story = {
    args: {
        category: {
            ...mockCategory,
            name: "Premium Selection",
            description: "Our premium selection features the finest ingredients sourced from local farms and prepared with traditional techniques passed down through generations",
        },
    },
}
