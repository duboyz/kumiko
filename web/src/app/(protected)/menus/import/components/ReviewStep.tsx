"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Check,
  AlertTriangle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { ParsedMenuItem } from "../hooks/useImportFlow";
import {
  useRestaurantMenus,
  useCreateMenuItem,
  useBulkAddMenuItemsToCategory,
} from "@shared";

interface ReviewStepProps {
  parsedItems: ParsedMenuItem[];
  onConfirm: () => void;
  onBack: () => void;
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  restaurantId: string;
}

export function ReviewStep({
  parsedItems,
  onConfirm,
  onBack,
  selectedCategoryId,
  onCategoryChange,
  restaurantId,
}: ReviewStepProps) {
  const [items, setItems] = useState<ParsedMenuItem[]>(parsedItems);
  const [isCreating, setIsCreating] = useState(false);

  const { data: menusData } = useRestaurantMenus(restaurantId);
  const createMenuItemMutation = useCreateMenuItem();
  const bulkAddMenuItemsToCategoryMutation = useBulkAddMenuItemsToCategory();

  const categories = menusData?.menus?.[0]?.categories || [];

  useEffect(() => {
    setItems(parsedItems);
  }, [parsedItems]);

  const updateItem = (
    id: string,
    field: keyof ParsedMenuItem,
    value: string | number,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addNewItem = () => {
    const newItem: ParsedMenuItem = {
      id: `new-${Date.now()}`,
      name: "",
      description: "",
      price: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleConfirm = async () => {
    if (!selectedCategoryId) {
      alert("Please select a category for the menu items.");
      return;
    }

    const validItems = items.filter((item) => item.name.trim() !== "");
    if (validItems.length === 0) {
      alert("Please add at least one valid menu item.");
      return;
    }

    setIsCreating(true);

    try {
      // Create menu items first
      const createdMenuItems = [];
      for (const item of validItems) {
        const result = await createMenuItemMutation.mutateAsync({
          name: item.name,
          description: item.description,
          price: item.price,
          restaurantMenuId: menusData?.menus?.[0]?.id || "",
          isAvailable: true,
        });
        createdMenuItems.push(result);
      }

      // Then bulk add them to the selected category
      if (createdMenuItems.length > 0) {
        await bulkAddMenuItemsToCategoryMutation.mutateAsync({
          menuItemIds: createdMenuItems
            .filter((item) => item)
            .map((item) => item!.id),
          menuCategoryId: selectedCategoryId,
          startOrderIndex: 0,
        });
      }

      onConfirm();
    } catch (error) {
      console.error("Failed to create menu items:", error);
      alert("Failed to create some menu items. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const validItemsCount = items.filter((item) => item.name.trim()).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Menu Items</h2>
        <p className="text-muted-foreground">
          Review and edit the parsed menu items before adding them to your menu
        </p>
      </div>

      {/* Category Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label htmlFor="category-select" className="text-sm font-medium">
              Select Category *
            </Label>
            <Select value={selectedCategoryId} onValueChange={onCategoryChange}>
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Choose a category for these items" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No categories available. Please create a category first.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Menu Items ({validItemsCount})
          </h3>
          <Button onClick={addNewItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((item, index) => (
            <Card key={item.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Item {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.confidence && (
                          <Badge
                            variant={
                              item.confidence > 0.8
                                ? "default"
                                : item.confidence > 0.6
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {item.confidence > 0.8 ? (
                              <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {Math.round(item.confidence * 100)}% confidence
                          </Badge>
                        )}
                        {item.name.trim() && (
                          <Badge variant="secondary" className="text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Valid
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive h-6 w-6 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <Label htmlFor={`name-${item.id}`} className="text-xs">
                          Name *
                        </Label>
                        <Input
                          id={`name-${item.id}`}
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          placeholder="Enter item name"
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`price-${item.id}`} className="text-xs">
                          Price
                        </Label>
                        <Input
                          id={`price-${item.id}`}
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "price",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          placeholder="0.00"
                          className="h-8"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label
                        htmlFor={`description-${item.id}`}
                        className="text-xs"
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`description-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder="Enter item description"
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">No menu items found</p>
              <Button onClick={addNewItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isCreating}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isCreating || validItemsCount === 0 || !selectedCategoryId}
          size="lg"
        >
          {isCreating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding Items...
            </>
          ) : (
            <>
              Add {validItemsCount} Items
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
