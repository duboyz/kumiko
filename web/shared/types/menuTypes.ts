// Menu types based on backend entities
export interface RestaurantMenuDto {
  id: string;
  name: string;
  description: string;
  restaurantId: string;
  categories: MenuCategoryDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategoryDto {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  restaurantMenuId: string;
  menuCategoryItems: MenuCategoryItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemDto {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  restaurantMenuId: string;
  menuCategoryItems: MenuCategoryItemDto[];
  options: MenuItemOptionDto[];
  allergens: AllergenDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MenuCategoryItemDto {
  id: string;
  menuCategoryId: string;
  menuItemId: string;
  orderIndex: number;
  menuCategory?: MenuCategoryDto;
  menuItem?: MenuItemDto;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItemOptionDto {
  id: string;
  name: string;
  description: string;
  priceModifier: number;
  menuItemId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllergenDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Create/Update types
export interface CreateMenuCategoryCommand {
  name: string;
  description: string;
  orderIndex: number;
  restaurantMenuId: string;
}

export interface CreateMenuItemCommand {
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
  restaurantMenuId: string;
}

export interface AddMenuItemToCategoryCommand {
  menuItemId: string;
  menuCategoryId: string;
  orderIndex: number;
}

export interface UpdateMenuCategoryCommand {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface UpdateMenuItemCommand {
  id: string;
  name: string;
  description: string;
  price: number;
  isAvailable: boolean;
}

export interface UpdateMenuCategoryItemCommand {
  id: string;
  orderIndex: number;
}
