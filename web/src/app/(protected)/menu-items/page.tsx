"use client";

import { ContentContainer } from "@/components/ContentContainer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DeleteConfirmDialog } from "@/components/menu-builder/DeleteConfirmDialog";
import { MenuItemForm } from "@/components/menu-builder/MenuItemForm";
import MenuItemTableView from "@/components/menu-builder/MenuItemTableView";
import {
  useAllRestaurantMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useRestaurantMenus,
} from "@shared";
import { useLocationSelection } from "@shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Package,
  Grid3X3,
  Table,
} from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MenuItemDto,
  CreateMenuItemCommand,
  UpdateMenuItemCommand,
  RestaurantMenuDto,
} from "@shared";

export default function MenuItemsPage() {
  const { selectedLocation, isLoading, hasNoLocations } =
    useLocationSelection();
  const restaurantId =
    selectedLocation?.type === "Restaurant" ? selectedLocation.id : null;

  const {
    data: menuItemsData,
    isLoading: menuItemsLoading,
    error,
  } = useAllRestaurantMenuItems(restaurantId || "");
  const { data: menusData } = useRestaurantMenus(restaurantId || "");
  const createMenuItemMutation = useCreateMenuItem();
  const updateMenuItemMutation = useUpdateMenuItem();
  const deleteMenuItemMutation = useDeleteMenuItem();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "item";
    id: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasNoLocations) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Restaurants Found</h2>
            <p className="text-muted-foreground mb-6">
              You need to add a restaurant before you can manage menu items.
            </p>
            <Button asChild>
              <a href="/onboarding/restaurant">Add Restaurant</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedLocation || selectedLocation.type !== "Restaurant") {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Restaurant Required</h2>
            <p className="text-muted-foreground mb-6">
              Menu item management is only available for restaurant locations.
              Please select a restaurant from the sidebar.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateMenuItem = async (data: CreateMenuItemCommand) => {
    try {
      await createMenuItemMutation.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create menu item:", error);
    }
  };

  const handleUpdateMenuItem = async (data: UpdateMenuItemCommand) => {
    try {
      await updateMenuItemMutation.mutateAsync(data);
      //   queryClient.invalidateQueries({ queryKey: ["restaurant-menu-items"] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Failed to update menu item:", error);
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    setDeleteTarget({ type: "item", id: itemId });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMenuItemMutation.mutateAsync(deleteTarget.id);
      setIsDeleteDialogOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete menu item:", error);
    }
  };

  const menuItems = menuItemsData?.menuItems || [];

  return (
    <ContentContainer>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground">
            Manage all menu items for {selectedLocation.name}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Menu Item</DialogTitle>
            </DialogHeader>
            <MenuItemForm
              mode="create"
              menus={menusData?.menus || []}
              initialData={
                {
                  restaurantId: restaurantId!,
                } as Partial<CreateMenuItemCommand>
              }
              onSubmit={
                handleCreateMenuItem as (
                  data: CreateMenuItemCommand | UpdateMenuItemCommand,
                ) => void
              }
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={createMenuItemMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as "cards" | "table")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Cards
          </TabsTrigger>
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="w-4 h-4" />
            Table
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="mt-6">
          {menuItemsLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : menuItems.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Menu Items</h2>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first menu item.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Menu Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={handleDeleteMenuItem}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="table" className="mt-6">
          <MenuItemTableView
            menuItems={menuItems}
            menus={menusData?.menus || []}
            isLoading={menuItemsLoading}
            onEditItem={(item) => {
              setEditingItem(item);
              setIsEditDialogOpen(true);
            }}
            onDeleteItem={handleDeleteMenuItem}
            onUpdateItem={async (item) => {
              try {
                await updateMenuItemMutation.mutateAsync(item);
              } catch (error) {
                console.error("Failed to update menu item:", error);
              }
            }}
            onCreateItem={async (item) => {
              try {
                await createMenuItemMutation.mutateAsync(
                  item as CreateMenuItemCommand,
                );
              } catch (error) {
                console.error("Failed to create menu item:", error);
              }
            }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <MenuItemForm
              mode="edit"
              menus={menusData?.menus || []}
              initialData={editingItem as Partial<UpdateMenuItemCommand>}
              onSubmit={
                handleUpdateMenuItem as (
                  data: CreateMenuItemCommand | UpdateMenuItemCommand,
                ) => void
              }
              onCancel={() => setIsEditDialogOpen(false)}
              isLoading={updateMenuItemMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        deleteTarget={deleteTarget}
        categories={[]}
        onConfirmDelete={confirmDelete}
      />
    </ContentContainer>
  );
}

function MenuItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItemDto;
  onEdit: (item: MenuItemDto) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="group hover:shadow-sm transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{item.name}</h3>
              <div
                className={`w-2 h-2 rounded-full ${item.isAvailable ? "bg-green-500" : "bg-gray-400"}`}
              />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {item.description || "No description"}
            </p>
            <p className="text-lg font-semibold text-green-600 mt-1">
              ${item.price.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
