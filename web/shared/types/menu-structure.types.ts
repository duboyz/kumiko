// Types for menu structure parsing and creation

export interface ParsedMenuStructure {
  categories: ParsedCategory[];
  suggestedMenuName: string;
  suggestedMenuDescription: string;
}

export interface ParsedCategory {
  name: string;
  description: string;
  orderIndex: number;
  items: ParsedMenuItem[];
}

export interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  orderIndex: number;
}

// API request/response types
export interface CreateMenuStructureRequest {
  restaurantMenuId: string;
  menuName: string;
  menuDescription: string;
  categories: CreateCategoryRequest[];
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
  orderIndex: number;
  items: CreateMenuItemRequest[];
}

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
  orderIndex: number;
  isAvailable?: boolean;
}

export interface CreateMenuStructureResponse {
  menuId: string;
  menuName: string;
  menuDescription: string;
  categories: CreatedCategoryResponse[];
  totalItemsCreated: number;
  totalCategoriesCreated: number;
}

export interface CreatedCategoryResponse {
  categoryId: string;
  name: string;
  description: string;
  orderIndex: number;
  items: CreatedMenuItemResponse[];
}

export interface CreatedMenuItemResponse {
  itemId: string;
  name: string;
  description: string;
  price: number;
  orderIndex: number;
  isAvailable: boolean;
}

// UI state types for import flow
export interface EditableMenuStructure {
  categories: EditableCategory[];
  menuName: string;
  menuDescription: string;
}

export interface EditableCategory {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
  items: EditableMenuItem[];
  isExpanded?: boolean;
}

export interface EditableMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  orderIndex: number;
  isAvailable: boolean;
  categoryId: string;
}
