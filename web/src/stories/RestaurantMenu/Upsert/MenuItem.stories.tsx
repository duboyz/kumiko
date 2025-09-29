import { StoryObj } from "@storybook/nextjs-vite"
import { MenuItem } from "./MenuItem"
import { MenuItemDto } from "@shared"

const meta = {
    component: MenuItem,
    parameters: {
        layout: 'padded',
    },
}

const mockMenuItem: MenuItemDto = {
    id: "34b8b762-3440-4021-90f9-b9e3a34257b5",
    name: "Spring Rolls",
    description: "Fresh vegetables wrapped in crispy spring roll wrapper served with sweet chili sauce",
    price: 12.99,
    isAvailable: true,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: "2025-09-17T13:43:02.401003Z",
    updatedAt: "2025-09-17T13:43:02.401003Z"
}

const expensiveMenuItem: MenuItemDto = {
    id: "expensive-item-id",
    name: "Premium Wagyu Steak",
    description: "Grade A5 Wagyu beef, perfectly grilled and served with truffle butter and seasonal vegetables",
    price: 89.99,
    isAvailable: true,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: "2025-09-17T13:43:02.401003Z",
    updatedAt: "2025-09-17T13:43:02.401003Z"
}

const unavailableMenuItem: MenuItemDto = {
    id: "unavailable-item-id",
    name: "Seasonal Fish Special",
    description: "Chef's daily selection of fresh fish, prepared according to market availability",
    price: 28.99,
    isAvailable: false,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: "2025-09-17T13:43:02.401003Z",
    updatedAt: "2025-09-17T13:43:02.401003Z"
}

const noDescriptionMenuItem: MenuItemDto = {
    id: "no-desc-item-id",
    name: "Classic Burger",
    description: "",
    price: 16.50,
    isAvailable: true,
    restaurantMenuId: "dafadd2c-83e1-408e-9204-56ccb358bb89",
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: "2025-09-17T13:43:02.401003Z",
    updatedAt: "2025-09-17T13:43:02.401003Z"
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        item: mockMenuItem,
    },
}

export const Expensive: Story = {
    args: {
        item: expensiveMenuItem,
    },
}

export const Unavailable: Story = {
    args: {
        item: unavailableMenuItem,
    },
}

export const NoDescription: Story = {
    args: {
        item: noDescriptionMenuItem,
    },
}

export const LongName: Story = {
    args: {
        item: {
            ...mockMenuItem,
            name: "Extraordinarily Long Named Dish With Multiple Descriptive Words That Might Wrap To Multiple Lines",
        },
    },
}
