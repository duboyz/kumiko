"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Check,
  FolderOpen,
  DollarSign,
  Clock,
  Users,
  Menu as MenuIcon,
} from "lucide-react";
import { EditableMenuStructure } from "@shared/types/menu-structure.types";
import { cn } from "@/lib/utils";

interface StructurePreviewStepProps {
  editableStructure: EditableMenuStructure;
  onConfirm: () => void;
  onBack: () => void;
  isCreating?: boolean;
}

export function StructurePreviewStep({
  editableStructure,
  onConfirm,
  onBack,
  isCreating = false,
}: StructurePreviewStepProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalItems = editableStructure.categories.reduce(
    (sum, cat) => sum + cat.items.length,
    0,
  );

  const totalValue = editableStructure.categories.reduce(
    (sum, cat) =>
      sum + cat.items.reduce((itemSum, item) => itemSum + item.price, 0),
    0,
  );

  const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Preview Menu Structure</h2>
        <p className="text-muted-foreground">
          Review your complete menu before creating it
        </p>
      </div>

      {/* Menu Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {editableStructure.categories.length}
                </p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MenuIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{totalItems}</p>
                <p className="text-sm text-muted-foreground">Menu Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">${averagePrice.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Avg Price</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.ceil(totalItems / 2)}
                </p>
                <p className="text-sm text-muted-foreground">Est. Options</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MenuIcon className="w-5 h-5" />
            Menu Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <h3 className="font-semibold text-lg">
                {editableStructure.menuName}
              </h3>
              <p className="text-muted-foreground">
                {editableStructure.menuDescription}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu Structure Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Menu Structure
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse All" : "Expand All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editableStructure.categories.map((category, categoryIndex) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">#{categoryIndex + 1}</Badge>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <Badge variant="secondary">
                      {category.items.length} items
                    </Badge>
                  </div>
                </div>

                {category.description && (
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                )}

                {/* Items in this category */}
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {itemIndex + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          ${item.price.toFixed(2)}
                        </Badge>
                        <Badge
                          variant={item.isAvailable ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {category.items.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">No items in this category</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What happens next */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            What happens next?
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• All categories will be created in your menu</li>
            <li>
              • All menu items will be added to their respective categories
            </li>
            <li>• Items will be ordered as shown in the preview</li>
            <li>• You can edit everything after creation</li>
          </ul>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled={isCreating}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Items
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isCreating}
          className="min-w-[120px]"
        >
          {isCreating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Create Menu
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
