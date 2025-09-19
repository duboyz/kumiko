import client from "./client";
import {
  RestaurantMenuDto,
  MenuCategoryDto,
  MenuItemDto,
  MenuCategoryItemDto,
  CreateMenuCategoryCommand,
  CreateMenuItemCommand,
  AddMenuItemToCategoryCommand,
  UpdateMenuCategoryCommand,
  UpdateMenuItemCommand,
  UpdateMenuCategoryItemCommand,
  GetMenuByIdResult,
} from "../types/menu.types";
import { ApiResponse, ResponseData } from "../types/apiResponse.types";

// Response data types (what's inside the ApiResponse.data)
interface GetRestaurantMenusData {
  menus: RestaurantMenuDto[];
}

interface GetRestaurantMenuItemsData {
  menuItems: MenuItemDto[];
}

interface GetAllRestaurantMenuItemsData {
  menuItems: MenuItemDto[];
}

interface CreateRestaurantMenuData {
  id: string;
  name: string;
  description: string;
  restaurantId: string;
}

interface CreateMenuCategoryData {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  restaurantMenuId: string;
}

interface CreateMenuItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  restaurantMenuId: string;
}

interface AddMenuItemToCategoryData {
  id: string;
  menuCategoryId: string;
  menuItemId: string;
  orderIndex: number;
}

export const menuApi = {
  // Get all menus for a restaurant
  getRestaurantMenus: async (
    restaurantId: string,
  ): Promise<ResponseData<GetRestaurantMenusData>> => {
    const { data } = await client.get<ApiResponse<GetRestaurantMenusData>>(
      `/api/restaurant-menus/restaurant/${restaurantId}`,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to get restaurant menus");
    return data.data;
  },

  // Get all menu items for a restaurant menu
  getRestaurantMenuItems: async (
    restaurantMenuId: string,
  ): Promise<ResponseData<GetRestaurantMenuItemsData>> => {
    console.log("Debug - Fetching menu items for menu ID:", restaurantMenuId);
    const { data } = await client.get<ApiResponse<GetRestaurantMenuItemsData>>(
      `/api/menu-items/restaurant-menu/${restaurantMenuId}`,
    );
    console.log("Debug - Menu items API response:", data);
    if (!data.success)
      throw new Error(data.message || "Failed to get restaurant menu items");
    return data.data;
  },

  // Get ALL menu items for a restaurant (across all menus)
  getAllRestaurantMenuItems: async (
    restaurantId: string,
  ): Promise<ResponseData<GetAllRestaurantMenuItemsData>> => {
    console.log(
      "Debug - Fetching ALL menu items for restaurant ID:",
      restaurantId,
    );
    const { data } = await client.get<
      ApiResponse<GetAllRestaurantMenuItemsData>
    >(`/api/menu-items/restaurant/${restaurantId}`);
    console.log("Debug - ALL menu items API response:", data);
    if (!data.success)
      throw new Error(
        data.message || "Failed to get all restaurant menu items",
      );
    return data.data;
  },

  // Create a new restaurant menu
  createRestaurantMenu: async (command: {
    name: string;
    description: string;
    restaurantId: string;
  }): Promise<ResponseData<CreateRestaurantMenuData>> => {
    const { data } = await client.post<ApiResponse<CreateRestaurantMenuData>>(
      "/api/restaurant-menus",
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to create restaurant menu");
    return data.data;
  },

  // Create a new menu category
  createMenuCategory: async (
    command: CreateMenuCategoryCommand,
  ): Promise<ResponseData<CreateMenuCategoryData>> => {
    const { data } = await client.post<ApiResponse<CreateMenuCategoryData>>(
      "/api/menu-categories",
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to create menu category");
    return data.data;
  },

  // Update menu category
  updateMenuCategory: async (
    command: UpdateMenuCategoryCommand,
  ): Promise<ResponseData<MenuCategoryDto>> => {
    const { data } = await client.put<ApiResponse<MenuCategoryDto>>(
      `/api/menu-categories/${command.id}`,
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to update menu category");
    return data.data;
  },

  // Delete menu category
  deleteMenuCategory: async (categoryId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(
      `/api/menu-categories/${categoryId}`,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to delete menu category");
  },

  // Create a new menu item
  createMenuItem: async (
    command: CreateMenuItemCommand,
  ): Promise<ResponseData<CreateMenuItemData>> => {
    const { data } = await client.post<ApiResponse<CreateMenuItemData>>(
      "/api/menu-items",
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to create menu item");
    return data.data;
  },

  // Update menu item
  updateMenuItem: async (
    command: UpdateMenuItemCommand,
  ): Promise<ResponseData<MenuItemDto>> => {
    const { data } = await client.put<ApiResponse<MenuItemDto>>(
      `/api/menu-items/${command.id}`,
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to update menu item");
    return data.data;
  },

  // Delete menu item (removes from all categories)
  deleteMenuItem: async (itemId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(
      `/api/menu-items/${itemId}`,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to delete menu item");
  },

  // Add existing menu item to category
  addMenuItemToCategory: async (
    command: AddMenuItemToCategoryCommand,
  ): Promise<ResponseData<AddMenuItemToCategoryData>> => {
    const { data } = await client.post<ApiResponse<AddMenuItemToCategoryData>>(
      "/api/menu-category-items",
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to add menu item to category");
    return data.data;
  },

  // Update menu category item (for reordering)
  updateMenuCategoryItem: async (
    command: UpdateMenuCategoryItemCommand,
  ): Promise<ResponseData<MenuCategoryItemDto>> => {
    const { data } = await client.put<ApiResponse<MenuCategoryItemDto>>(
      `/api/menu-category-items/${command.id}`,
      command,
    );
    if (!data.success)
      throw new Error(data.message || "Failed to update menu category item");
    return data.data;
  },

  // Remove menu item from category
  removeMenuItemFromCategory: async (categoryItemId: string): Promise<void> => {
    const { data } = await client.delete<ApiResponse<null>>(
      `/api/menu-category-items/${categoryItemId}`,
    );
    if (!data.success)
      throw new Error(
        data.message || "Failed to remove menu item from category",
      );
  },

  // Reorder categories
  reorderCategories: async (categoryIds: string[]): Promise<void> => {
    const { data } = await client.post<ApiResponse<null>>(
      "/api/menu-categories/reorder",
      { categoryIds },
    );
    if (!data.success)
      throw new Error(data.message || "Failed to reorder categories");
  },

  // Reorder menu items within a category
  reorderMenuItems: async (
    categoryId: string,
    categoryItemIds: string[],
  ): Promise<void> => {
    const { data } = await client.post<ApiResponse<null>>(
      `/api/menu-categories/${categoryId}/reorder-items`,
      { categoryItemIds },
    );
    if (!data.success)
      throw new Error(data.message || "Failed to reorder menu items");
  },

  // Get menu by ID (public endpoint)
  getMenuById: async (
    menuId: string,
  ): Promise<ResponseData<GetMenuByIdResult>> => {
    const { data } = await client.get<ApiResponse<GetMenuByIdResult>>(
      `/api/menu/${menuId}`,
    );
    if (!data.success) throw new Error(data.message || "Failed to get menu");
    return data.data;
  },
};
