"use client";

import { ContentContainer } from "@/components/ContentContainer";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { DeleteConfirmDialog } from "@/components/menu-builder/DeleteConfirmDialog";
import { MenuItemForm } from "@/components/menu-builder/MenuItemForm";
import { MenuItemReview } from "@/components/menu-builder/MenuItemReview";
import MenuItemTableView from "@/components/menu-builder/MenuItemTableView";
import {
  useAllRestaurantMenuItems,
  useCreateMenuItem,
  useUpdateMenuItem,
  useDeleteMenuItem,
  useRestaurantMenus,
  useBulkAddMenuItemsToCategory,
} from "@shared";
import { useLocationSelection } from "@shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  Upload,
  Camera,
  FileText,
  X,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import QRCode from "qrcode";
import { isMobileDevice } from "@/lib/device-detection";
import {
  MenuItemDto,
  CreateMenuItemCommand,
  UpdateMenuItemCommand,
  RestaurantMenuDto,
} from "@shared";

function MenuItemsPageContent() {
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
  const bulkAddMenuItemsToCategoryMutation = useBulkAddMenuItemsToCategory();
  const queryClient = useQueryClient();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "item";
    id: string;
  } | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<"cards" | "table">("cards");
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importMode, setImportMode] = useState<"select" | "preview" | "review">(
    "select",
  );
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Handle import success from mobile upload
  useEffect(() => {
    if (searchParams.get("import") === "success") {
      const storedItems = sessionStorage.getItem("parsedMenuItems");
      if (storedItems) {
        const items = JSON.parse(storedItems);
        setParsedItems(items);
        setImportMode("review");
        setIsImportDialogOpen(true);
        sessionStorage.removeItem("parsedMenuItems");
        // Clean up URL
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [searchParams]);

  const generateQRCode = async () => {
    setIsGeneratingQR(true);
    try {
      const uploadUrl = `${window.location.origin}/menu-upload`;
      const qrCodeDataURL = await QRCode.toDataURL(uploadUrl, {
        width: 256,
        margin: 2,
      });
      setQrCodeUrl(qrCodeDataURL);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImportMode("preview");
  };

  const handleFileUpload = async () => {
    if (!selectedImage) return;

    const controller = new AbortController();
    setAbortController(controller);
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setProcessingStep("Preparing image...");
      await new Promise((resolve) => setTimeout(resolve, 500)); // Small delay for UX

      setProcessingStep("Sending to AI...");
      const formData = new FormData();
      formData.append("image", selectedImage);

      setProcessingStep("AI is analyzing your menu...");
      const response = await fetch("/api/menu/parse", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (response.ok) {
        setProcessingStep("Processing results...");
        const result = await response.json();

        // Add confidence scores to items
        const itemsWithConfidence = result.menuItems.map((item: any) => ({
          ...item,
          confidence: Math.random() * 0.4 + 0.6, // Mock confidence score 60-100%
        }));

        setParsedItems(itemsWithConfidence);
        setImportMode("review");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);

        // Better error messages
        let errorMsg = "Failed to parse menu";
        if (errorData.error?.includes("No text detected")) {
          errorMsg = "No text detected in image. Please try a clearer photo.";
        } else if (errorData.error?.includes("Image too blurry")) {
          errorMsg = "Image is too blurry. Please take a clearer photo.";
        } else if (errorData.error?.includes("No menu items found")) {
          errorMsg =
            "No menu items found. Please ensure the image contains a menu.";
        } else {
          errorMsg = errorData.error || "Unknown error occurred";
        }

        setErrorMessage(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Processing cancelled by user");
        return;
      }
      console.error("Upload error:", error);
      if (!errorMessage) {
        setErrorMessage(
          `Failed to upload and parse menu: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }
    } finally {
      setIsProcessing(false);
      setAbortController(null);
      setProcessingStep("");
    }
  };

  const handleCancelProcessing = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsProcessing(false);
    setAbortController(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith("image/")) {
      handleFileSelect(files[0]);
    }
  };

  const handleReviewConfirm = async (items: any[]) => {
    try {
      if (!selectedCategoryId) {
        alert("Please select a category for the menu items.");
        return;
      }

      // Create menu items first
      const createdMenuItems = [];
      for (const item of items) {
        const result = await createMenuItemMutation.mutateAsync({
          name: item.name,
          description: item.description,
          price: item.price,
          restaurantMenuId: menusData?.menus?.[0]?.id || "", // Use first menu or handle this better
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

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      setImportMode("select");
      setParsedItems([]);
      setSelectedCategoryId("");
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error("Failed to create menu items:", error);
      alert("Failed to create some menu items. Please try again.");
    }
  };

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

  // Bulk operation handlers
  const handleBulkDelete = async (itemIds: string[]) => {
    try {
      // Delete items one by one using the existing mutation
      const deletePromises = itemIds.map((id) =>
        deleteMenuItemMutation.mutateAsync(id),
      );
      await Promise.all(deletePromises);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["restaurant-menus"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu-items"] });
      queryClient.invalidateQueries({
        queryKey: ["all-restaurant-menu-items"],
      });
    } catch (error) {
      console.error("Failed to delete menu items:", error);
      throw error;
    }
  };

  const handleBulkUpdate = async (updates: {
    itemIds: string[];
    updates: Partial<MenuItemDto>;
  }) => {
    try {
      // Get the current menu items to find the items to update
      const currentItems = menuItemsData?.menuItems || [];
      const itemsToUpdate = currentItems.filter((item) =>
        updates.itemIds.includes(item.id),
      );

      // Update items one by one using the existing mutation
      const updatePromises = itemsToUpdate.map((item) =>
        updateMenuItemMutation.mutateAsync({
          ...item,
          ...updates.updates,
        } as UpdateMenuItemCommand),
      );
      await Promise.all(updatePromises);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["restaurant-menus"] });
      queryClient.invalidateQueries({ queryKey: ["restaurant-menu-items"] });
      queryClient.invalidateQueries({
        queryKey: ["all-restaurant-menu-items"],
      });
    } catch (error) {
      console.error("Failed to update menu items:", error);
      throw error;
    }
  };

  const menuItems = menuItemsData?.menuItems || [];

  return (
    <ContentContainer>
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Menu items added successfully!</span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
          <p className="text-muted-foreground">
            Manage all menu items for {selectedLocation.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isImportDialogOpen}
            onOpenChange={(open) => {
              setIsImportDialogOpen(open);
              if (!open) {
                // Cancel any ongoing processing
                if (abortController) {
                  abortController.abort();
                }
                setImportMode("select");
                setParsedItems([]);
                setQrCodeUrl("");
                setSelectedImage(null);
                setImagePreview(null);
                setIsProcessing(false);
                setIsDragOver(false);
                setAbortController(null);
                setProcessingStep("");
                setErrorMessage(null);
                if (imagePreview) {
                  URL.revokeObjectURL(imagePreview);
                }
              }
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {importMode === "select"
                    ? "Import Menu Items"
                    : importMode === "preview"
                      ? "Preview Image"
                      : "Review Parsed Items"}
                </DialogTitle>

                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Step 1: Upload</span>
                    <span>Step 2: Preview</span>
                    <span>Step 3: Process</span>
                    <span>Step 4: Review</span>
                    <span>Step 5: Complete</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{
                        width:
                          importMode === "select"
                            ? "20%"
                            : importMode === "preview"
                              ? "40%"
                              : importMode === "review"
                                ? "80%"
                                : "100%",
                      }}
                    />
                  </div>
                </div>
              </DialogHeader>

              {importMode === "select" ? (
                <div className="space-y-4">
                  {/* Image Quality Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-2">
                          Tips for best results:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Ensure good lighting and clear text</li>
                          <li>• Take photo straight-on, not at an angle</li>
                          <li>• Include the entire menu in the frame</li>
                          <li>• Avoid shadows and reflections</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Drag and Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      Upload Menu Image
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop an image here, or click to select
                    </p>
                    <Button
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleFileSelect(file);
                        };
                        input.click();
                      }}
                    >
                      Choose File
                    </Button>
                  </div>

                  {/* Mobile Camera Option */}
                  {isMobileDevice() ? (
                    <Button
                      variant="outline"
                      className="w-full h-12 flex items-center justify-center gap-2"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.capture = "environment";
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement)
                            .files?.[0];
                          if (file) handleFileSelect(file);
                        };
                        input.click();
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      Take Picture
                    </Button>
                  ) : (
                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!qrCodeUrl) {
                            generateQRCode();
                          }
                        }}
                        disabled={isGeneratingQR}
                        className="w-full h-12 flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        {isGeneratingQR
                          ? "Generating..."
                          : "Take Picture with Phone"}
                      </Button>
                      {qrCodeUrl && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Scan this QR code with your phone
                          </p>
                          <div className="flex justify-center">
                            <img
                              src={qrCodeUrl}
                              alt="QR Code"
                              className="w-32 h-32"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : importMode === "preview" ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview!}
                      alt="Menu preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      onClick={() => {
                        if (isProcessing) {
                          handleCancelProcessing();
                        } else {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setImportMode("select");
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                          }
                        }
                      }}
                      size="sm"
                      variant={isProcessing ? "secondary" : "destructive"}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {isProcessing ? (
                    <div className="text-center space-y-4 py-8">
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-4 relative">
                          <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                          <div
                            className="absolute inset-2 rounded-full border-2 border-primary/40 border-b-transparent animate-spin"
                            style={{
                              animationDirection: "reverse",
                              animationDuration: "0.8s",
                            }}
                          ></div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {processingStep || "AI is analyzing your menu..."}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          This may take a few moments
                        </p>
                        <Button
                          onClick={handleCancelProcessing}
                          variant="outline"
                          size="sm"
                        >
                          Cancel Processing
                        </Button>
                      </div>
                    </div>
                  ) : errorMessage ? (
                    <div className="text-center space-y-4 py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">
                        Processing Failed
                      </h3>
                      <p className="text-sm text-red-700 mb-4">
                        {errorMessage}
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          onClick={() => {
                            setErrorMessage(null);
                            setSelectedImage(null);
                            setImagePreview(null);
                            setImportMode("select");
                            if (imagePreview) {
                              URL.revokeObjectURL(imagePreview);
                            }
                          }}
                          variant="outline"
                          size="sm"
                        >
                          Try Again
                        </Button>
                        <Button
                          onClick={() => {
                            setErrorMessage(null);
                            setImportMode("select");
                          }}
                          size="sm"
                        >
                          Choose Different Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                          setImportMode("select");
                          if (imagePreview) {
                            URL.revokeObjectURL(imagePreview);
                          }
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Choose Different Image
                      </Button>
                      <Button onClick={handleFileUpload} className="flex-1">
                        Process with AI
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <MenuItemReview
                  initialItems={parsedItems}
                  categories={menusData?.menus?.[0]?.categories || []}
                  selectedCategoryId={selectedCategoryId}
                  onCategoryChange={setSelectedCategoryId}
                  onConfirm={handleReviewConfirm}
                  onCancel={() => {
                    setImportMode("select");
                    setParsedItems([]);
                    setSelectedCategoryId("");
                    setSelectedImage(null);
                    setImagePreview(null);
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                    }
                  }}
                  isLoading={
                    createMenuItemMutation.isPending ||
                    bulkAddMenuItemsToCategoryMutation.isPending
                  }
                />
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
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
            onBulkDelete={handleBulkDelete}
            onBulkUpdate={handleBulkUpdate}
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

export default function MenuItemsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <MenuItemsPageContent />
    </Suspense>
  );
}
