"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuUploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await fetch("/api/menu/parse", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Store the parsed data in sessionStorage for the main app to pick up
        sessionStorage.setItem(
          "parsedMenuItems",
          JSON.stringify(result.menuItems),
        );
        setUploadSuccess(true);

        // Redirect back to the main app after a short delay
        setTimeout(() => {
          router.push("/menu-items?import=success");
        }, 2000);
      } else {
        throw new Error("Failed to parse menu");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload and parse menu. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600 mb-4">
              Your menu has been processed and will be available for review
              shortly.
            </p>
            <p className="text-sm text-gray-500">
              You can close this page now.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Upload Menu</CardTitle>
          <p className="text-gray-600">
            Take a photo or upload an image of your menu
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!selectedImage ? (
            <div className="space-y-4">
              <Button
                onClick={() => cameraInputRef.current?.click()}
                className="w-full h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <Camera className="w-6 h-6" />
                <span>Take Photo</span>
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
              >
                <Upload className="w-6 h-6" />
                <span>Upload from Gallery</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl!}
                  alt="Menu preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  onClick={clearImage}
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={clearImage}
                  variant="outline"
                  className="flex-1"
                >
                  Choose Different Image
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? "Processing..." : "Upload & Parse"}
                </Button>
              </div>
            </div>
          )}

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
}
