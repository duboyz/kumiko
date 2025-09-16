import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { menuApi } from '../api/menuApi'
// Get restaurant menus
export const useRestaurantMenus = (restaurantId: string) => {
  return useQuery({
    queryKey: ['restaurant-menus', restaurantId],
    queryFn: () => menuApi.getRestaurantMenus(restaurantId),
    enabled: !!restaurantId
  })
}

// Get all menu items for a restaurant menu
export const useRestaurantMenuItems = (restaurantMenuId: string) => {
  return useQuery({
    queryKey: ['restaurant-menu-items', restaurantMenuId],
    queryFn: () => menuApi.getRestaurantMenuItems(restaurantMenuId),
    enabled: !!restaurantMenuId
  })
}

// Get ALL menu items for a restaurant (across all menus)
export const useAllRestaurantMenuItems = (restaurantId: string) => {
  return useQuery({
    queryKey: ['all-restaurant-menu-items', restaurantId],
    queryFn: () => menuApi.getAllRestaurantMenuItems(restaurantId),
    enabled: !!restaurantId
  })
}

// Create restaurant menu
export const useCreateRestaurantMenu = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.createRestaurantMenu,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus', variables.restaurantId] })
    }
  })
}

// Create menu category
export const useCreateMenuCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.createMenuCategory,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Update menu category
export const useUpdateMenuCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.updateMenuCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Delete menu category
export const useDeleteMenuCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.deleteMenuCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Create menu item
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.createMenuItem,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items', variables.restaurantMenuId] })
      queryClient.invalidateQueries({ queryKey: ['all-restaurant-menu-items'] })
    }
  })
}

// Update menu item
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.updateMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Delete menu item
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.deleteMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Add menu item to category
export const useAddMenuItemToCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.addMenuItemToCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
      queryClient.invalidateQueries({ queryKey: ['restaurant-menu-items'] })
    }
  })
}

// Update menu category item
export const useUpdateMenuCategoryItem = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.updateMenuCategoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Remove menu item from category
export const useRemoveMenuItemFromCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.removeMenuItemFromCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Reorder categories
export const useReorderCategories = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: menuApi.reorderCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}

// Reorder menu items
export const useReorderMenuItems = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ categoryId, categoryItemIds }: { categoryId: string; categoryItemIds: string[] }) => 
      menuApi.reorderMenuItems(categoryId, categoryItemIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restaurant-menus'] })
    }
  })
}
