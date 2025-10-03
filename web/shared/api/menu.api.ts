import client from './client'
import {
  RestaurantMenuDto,
  MenuCategoryDto,
  MenuItemDto,
  MenuCategoryItemDto,
  CreateMenuCategoryCommand,
  CreateMenuItemCommand,
  UpdateRestaurantMenuCommand,
  DeleteRestaurantMenuCommand,
  AddMenuItemToCategoryCommand,
  BulkAddMenuItemsToCategoryCommand,
  BulkAddMenuItemsToCategoryResult,
  BulkDeleteMenuItemsCommand,
  BulkDeleteMenuItemsResult,
  UpdateMenuCategoryCommand,
  UpdateMenuItemCommand,
  UpdateMenuCategoryItemCommand,
  GetMenuByIdResult,
  SimpleGenerateMenuFromImageResult,
} from '../types/menu.types'
import { ApiResponse, ResponseData } from '../types/apiResponse.types'

// Response data types (what's inside the ApiResponse.data)
interface GetRestaurantMenusData {
  menus: RestaurantMenuDto[]
}

interface GetRestaurantMenuItemsData {
  menuItems: MenuItemDto[]
}

interface GetAllRestaurantMenuItemsData {
  menuItems: MenuItemDto[]
}

export interface CreateRestaurantMenuData {
  id: string
  name: string
  description: string
  restaurantId: string
}

interface CreateMenuCategoryData {
  id: string
  name: string
  description: string
  orderIndex: number
  restaurantMenuId: string
}

interface CreateMenuItemData {
  id: string
  name: string
  description: string
  price: number
  isAvailable: boolean
  restaurantMenuId: string
}

interface AddMenuItemToCategoryData {
  id: string
  menuCategoryId: string
  menuItemId: string
  orderIndex: number
}

export const menuApi = {
  // Get all menus for a restaurant
  getRestaurantMenus: async (restaurantId: string): Promise<ResponseData<GetRestaurantMenusData>> => {
    const { data } = await client.get<ApiResponse<GetRestaurantMenusData>>(
      `/api/restaurant-menus/restaurant/${restaurantId}`
    )
    if (!data.success) throw new Error(data.message || 'Failed to get restaurant menus')
    return data.data
  },

  // Get all menu items for a restaurant menu
  getRestaurantMenuItems: async (restaurantMenuId: string): Promise<ResponseData<GetRestaurantMenuItemsData>> => {
    console.log('Debug - Fetching menu items for menu ID:', restaurantMenuId)
    const { data } = await client.get<ApiResponse<GetRestaurantMenuItemsData>>(
      `/api/menu-items/restaurant-menu/${restaurantMenuId}`
    )
    console.log('Debug - Menu items API response:', data)
    if (!data.success) throw new Error(data.message || 'Failed to get restaurant menu items')
    return data.data
  },

  // Get ALL menu items for a restaurant (across all menus)
  getAllRestaurantMenuItems: async (restaurantId: string): Promise<ResponseData<GetAllRestaurantMenuItemsData>> => {
    console.log('Debug - Fetching ALL menu items for restaurant ID:', restaurantId)
    const { data } = await client.get<ApiResponse<GetAllRestaurantMenuItemsData>>(
      `/api/menu-items/restaurant/${restaurantId}`
    )
    console.log('Debug - ALL menu items API response:', data)
    if (!data.success) throw new Error(data.message || 'Failed to get all restaurant menu items')
    return data.data
  },

  createRestaurantMenu: async (command: {
    name: string
    description: string
    restaurantId: string
  }): Promise<ResponseData<CreateRestaurantMenuData>> => {
    const { data } = await client.post<ApiResponse<CreateRestaurantMenuData>>('/api/restaurant-menus', command)
    if (!data.success) throw new Error(data.message || 'Failed to create restaurant menu')
    return data.data
  },

  // Update restaurant menu
  updateRestaurantMenu: async (command: UpdateRestaurantMenuCommand): Promise<ResponseData<RestaurantMenuDto>> => {
    const { data } = await client.put<ApiResponse<RestaurantMenuDto>>(`/api/restaurant-menus/${command.id}`, command)
    if (!data.success) throw new Error(data.message || 'Failed to update restaurant menu')
    return data.data
  },

  // Delete restaurant menu
  deleteRestaurantMenu: async (menuId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(`/api/restaurant-menus/${menuId}`)
    if (!data.success) throw new Error(data.message || 'Failed to delete restaurant menu')
  },

  // Create a new menu category
  createMenuCategory: async (command: CreateMenuCategoryCommand): Promise<ResponseData<CreateMenuCategoryData>> => {
    const { data } = await client.post<ApiResponse<CreateMenuCategoryData>>('/api/menu-categories', command)
    if (!data.success) throw new Error(data.message || 'Failed to create menu category')
    return data.data
  },

  // Update menu category
  updateMenuCategory: async (command: UpdateMenuCategoryCommand): Promise<ResponseData<MenuCategoryDto>> => {
    const { data } = await client.put<ApiResponse<MenuCategoryDto>>(`/api/menu-categories/${command.id}`, command)
    if (!data.success) throw new Error(data.message || 'Failed to update menu category')
    return data.data
  },

  // Delete menu category
  deleteMenuCategory: async (categoryId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(`/api/menu-categories/${categoryId}`)
    if (!data.success) throw new Error(data.message || 'Failed to delete menu category')
  },

  // Create a new menu item
  createMenuItem: async (command: CreateMenuItemCommand): Promise<ResponseData<CreateMenuItemData>> => {
    const { data } = await client.post<ApiResponse<CreateMenuItemData>>('/api/menu-items', command)
    if (!data.success) throw new Error(data.message || 'Failed to create menu item')
    return data.data
  },

  // Update menu item
  updateMenuItem: async (command: UpdateMenuItemCommand): Promise<ResponseData<MenuItemDto>> => {
    const { data } = await client.put<ApiResponse<MenuItemDto>>(`/api/menu-items/${command.id}`, command)
    if (!data.success) throw new Error(data.message || 'Failed to update menu item')
    return data.data
  },

  // Delete menu item (removes from all categories)
  deleteMenuItem: async (itemId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(`/api/menu-items/${itemId}`)
    if (!data.success) throw new Error(data.message || 'Failed to delete menu item')
  },

  // Bulk delete menu items
  bulkDeleteMenuItems: async (
    command: BulkDeleteMenuItemsCommand
  ): Promise<ResponseData<BulkDeleteMenuItemsResult>> => {
    const { data } = await client.delete<ApiResponse<BulkDeleteMenuItemsResult>>('/api/menu-items/bulk', {
      data: command,
    })
    if (!data.success) throw new Error(data.message || 'Failed to bulk delete menu items')
    return data.data
  },

  // Add existing menu item to category
  addMenuItemToCategory: async (
    command: AddMenuItemToCategoryCommand
  ): Promise<ResponseData<AddMenuItemToCategoryData>> => {
    const { data } = await client.post<ApiResponse<AddMenuItemToCategoryData>>('/api/menu-category-items', command)
    if (!data.success) throw new Error(data.message || 'Failed to add menu item to category')
    return data.data
  },

  // Bulk add menu items to category
  bulkAddMenuItemsToCategory: async (
    command: BulkAddMenuItemsToCategoryCommand
  ): Promise<ResponseData<BulkAddMenuItemsToCategoryResult>> => {
    const { data } = await client.post<ApiResponse<BulkAddMenuItemsToCategoryResult>>(
      '/api/menu-category-items/bulk',
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to bulk add menu items to category')
    return data.data
  },

  // Update menu category item (for reordering)
  updateMenuCategoryItem: async (
    command: UpdateMenuCategoryItemCommand
  ): Promise<ResponseData<MenuCategoryItemDto>> => {
    const { data } = await client.put<ApiResponse<MenuCategoryItemDto>>(
      `/api/menu-category-items/${command.id}`,
      command
    )
    if (!data.success) throw new Error(data.message || 'Failed to update menu category item')
    return data.data
  },

  // Remove menu item from category
  removeMenuItemFromCategory: async (categoryItemId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(`/api/menu-category-items/${categoryItemId}`)
    if (!data.success) throw new Error(data.message || 'Failed to remove menu item from category')
  },

  // Reorder categories
  reorderCategories: async (categoryIds: string[]): Promise<void> => {
    const { data } = await client.post<ApiResponse<null>>('/api/menu-categories/reorder', { categoryIds })
    if (!data.success) throw new Error(data.message || 'Failed to reorder categories')
  },

  // Reorder menu items within a category
  reorderMenuItems: async (categoryId: string, categoryItemIds: string[]): Promise<void> => {
    const { data } = await client.post<ApiResponse<null>>(`/api/menu-categories/${categoryId}/reorder-items`, {
      categoryItemIds,
    })
    if (!data.success) throw new Error(data.message || 'Failed to reorder menu items')
  },

  // Get menu by ID (public endpoint)
  getMenuById: async (menuId: string): Promise<ResponseData<GetMenuByIdResult>> => {
    const { data } = await client.get<ApiResponse<GetMenuByIdResult>>(`/api/menu/${menuId}`)
    if (!data.success) throw new Error(data.message || 'Failed to get menu')
    return data.data
  },

  // Parse menu from image using AI
  parseMenuFromImage: async (file: File, restaurantId: string): Promise<ResponseData<any>> => {
    const formData = new FormData()
    formData.append('Image', file)
    formData.append('RestaurantId', restaurantId)

    const { data } = await client.post<ApiResponse<any>>('/api/menu-import/parse-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (!data.success) throw new Error(data.message || 'Failed to parse menu from image')
    return data.data
  },

  // Generate complete menu from image (parse + create)
  simpleGenerateMenuFromImage: async (
    file: File,
    restaurantId: string
  ): Promise<ResponseData<SimpleGenerateMenuFromImageResult>> => {
    // First parse the image to get menu structure
    const parsedMenu = await menuApi.parseMenuFromImage(file, restaurantId)

    // Create the menu with parsed data
    const createdMenu = await menuApi.createRestaurantMenu({
      name: parsedMenu.menuName || 'Generated Menu',
      description: parsedMenu.menuDescription || 'Menu generated from image',
      restaurantId: restaurantId,
    })

    if (!createdMenu) {
      throw new Error('Failed to create menu')
    }

    // If there are categories and items in the parsed data, create them
    if (parsedMenu.categories && parsedMenu.categories.length > 0) {
      for (let i = 0; i < parsedMenu.categories.length; i++) {
        const category = parsedMenu.categories[i]
        const createdCategory = await menuApi.createMenuCategory({
          name: category.name,
          description: category.description || '',
          orderIndex: i,
          restaurantMenuId: createdMenu.id,
        })

        if (!createdCategory) {
          console.warn(`Failed to create category: ${category.name}`)
          continue
        }

        // Create items for this category
        if (category.items && category.items.length > 0) {
          const menuItemIds = []
          for (const item of category.items) {
            const createdItem = await menuApi.createMenuItem({
              name: item.name,
              description: item.description || '',
              price: item.price || 0,
              hasOptions: false,
              isAvailable: true,
              restaurantMenuId: createdMenu.id,
            })
            if (createdItem) {
              menuItemIds.push(createdItem.id)
            }
          }

          // Add items to category
          if (menuItemIds.length > 0) {
            await menuApi.bulkAddMenuItemsToCategory({
              menuItemIds,
              menuCategoryId: createdCategory.id,
            })
          }
        }
      }
    }

    return {
      id: createdMenu.id,
      name: createdMenu.name,
      description: createdMenu.description,
      restaurantId: createdMenu.restaurantId,
    }
  },
}
