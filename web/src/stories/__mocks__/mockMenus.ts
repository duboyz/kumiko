import type { RestaurantMenuDto, MenuCategoryDto, MenuItemDto } from '@shared/types'

/**
 * Mock Menu Items
 */
export const mockMenuItems: MenuItemDto[] = [
  {
    id: 'item-1',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce',
    price: 28.5,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-2',
    name: 'Chicken Teriyaki',
    description: 'Tender chicken breast glazed with house-made teriyaki sauce, served over steamed rice',
    price: 24.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-3',
    name: 'Vegetable Curry',
    description: 'A medley of fresh vegetables in aromatic curry spices, served with basmati rice',
    price: 22.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
    price: 14.0,
    isAvailable: true,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    options: [],
    allergens: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

/**
 * Mock Menu Categories
 */
export const mockCategories: MenuCategoryDto[] = [
  {
    id: 'cat-1',
    name: 'Appetizers',
    description: 'Start your meal with our delicious appetizers',
    orderIndex: 0,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    name: 'Main Courses',
    description: 'Our signature main dishes prepared with fresh ingredients',
    orderIndex: 1,
    restaurantMenuId: 'menu-1',
    menuCategoryItems: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

/**
 * Mock Restaurant Menus
 */
export const mockMenus: RestaurantMenuDto[] = [
  {
    id: 'menu-1',
    name: 'Dinner Menu',
    description: 'Our evening dinner selection featuring fresh seasonal ingredients',
    restaurantId: 'restaurant-1',
    categories: mockCategories,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'menu-2',
    name: 'Lunch Menu',
    description: 'Light and fresh lunch options perfect for midday dining',
    restaurantId: 'restaurant-1',
    categories: [],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'menu-3',
    name: 'Brunch Menu',
    description: 'Weekend brunch favorites and specialty coffee drinks',
    restaurantId: 'restaurant-1',
    categories: [],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: 'menu-4',
    name: 'Drinks Menu',
    description: 'Signature cocktails, wines, and beverages',
    restaurantId: 'restaurant-1',
    categories: [],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
]

export const singleMenu = [mockMenus[0]]
export const emptyMenus: RestaurantMenuDto[] = []
