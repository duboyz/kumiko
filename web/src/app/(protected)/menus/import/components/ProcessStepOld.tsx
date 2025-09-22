"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  X,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { ParsedMenuItem } from "../hooks/useImportFlow";
import { parseMenuStructure } from "@/shared/api/menu-structure.api";
import { ParsedMenuStructure } from "@/shared/types/menu-structure.types";

interface ProcessStepProps {
  imageFile: File | null;
  imagePreview: string | null;
  annotations: any[];
  onProcess: (structure: ParsedMenuStructure) => void;
  onBack: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  processingStep: string;
  setProcessingStep: (step: string) => void;
  errorMessage: string | null;
}

export function ProcessStep({
  imageFile,
  imagePreview,
  annotations,
  onProcess,
  onBack,
  onError,
  isProcessing,
  setIsProcessing,
  processingStep,
  setProcessingStep,
  errorMessage,
}: ProcessStepProps) {
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const handleProcess = async () => {
    if (!imageFile) return;

    const controller = new AbortController();
    setAbortController(controller);
    setIsProcessing(true);
    onError("");

    try {
      setProcessingStep("Preparing image...");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProcessingStep("Sending to AI...");
      const formData = new FormData();
      formData.append("image", imageFile);

      // Include annotations if available
      if (annotations.length > 0) {
        formData.append("annotations", JSON.stringify(annotations));
      }

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
        const itemsWithConfidence = result.menuItems.map(
          (item: any, index: number) => ({
            id: `temp-${index}`,
            name: item.name || `Menu Item ${index + 1}`,
            description: item.description || "",
            price: typeof item.price === "number" ? item.price : 0,
            category: item.category || "",
            confidence: Math.random() * 0.4 + 0.6, // Mock confidence score 60-100%
          }),
        );

        onProcess(itemsWithConfidence);
      } else {
        const errorData = await response.json();
        console.error("API Error:", errorData);

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

        onError(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Processing cancelled by user");
        return;
      }
      console.error("Upload error:", error);
      if (!errorMessage) {
        onError(
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

  const handleRetry = () => {
    onError("");
    handleProcess();
  };

  const handleChooseDifferent = () => {
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Process with AI</h2>
        <p className="text-muted-foreground">
          AI will analyze your annotated menu to extract menu items and
          categories
        </p>
      </div>

      {/* Image Preview with Annotations */}
      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Menu preview"
            className="w-full h-64 object-cover rounded-lg border"
          />
          {annotations.length > 0 && (
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              {annotations.length} annotations
            </div>
          )}
        </div>
      )}

      {/* Processing State */}
      {isProcessing ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="relative mx-auto w-16 h-16">
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
              <div>
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
          </CardContent>
        </Card>
      ) : errorMessage ? (
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Processing Failed
                </h3>
                <p className="text-sm text-red-700 mb-4">{errorMessage}</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRetry} variant="outline" size="sm">
                    Try Again
                  </Button>
                  <Button onClick={handleChooseDifferent} size="sm">
                    Choose Different Image
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Ready to Process</h3>
                <p className="text-muted-foreground mb-4">
                  Your annotated menu is ready! Click below to extract menu
                  items using AI.
                </p>
                {annotations.length > 0 && (
                  <p className="text-sm text-green-600 mb-4">
                    ✓ {annotations.length} annotations will help AI understand
                    your menu structure
                  </p>
                )}
                <Button onClick={handleProcess} size="lg">
                  <Loader2 className="w-4 h-4 mr-2" />
                  Process with AI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {!isProcessing && !errorMessage && (
          <Button onClick={handleProcess}>
            Process with AI
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
