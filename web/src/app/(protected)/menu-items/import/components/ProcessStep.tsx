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
import { parseMenuStructure } from "@shared/api/menu-structure.api";
import { ParsedMenuStructure } from "@shared/types/menu-structure.types";

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

      setProcessingStep("Sending to AI for structure analysis...");
      const structure = await parseMenuStructure(imageFile, annotations);

      setProcessingStep("Processing menu structure...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProcessingStep("Complete!");
      onProcess(structure);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return; // User cancelled
      }
      console.error("Error processing image:", error);
      onError(
        error instanceof Error
          ? error.message
          : "Failed to process image. Please try again.",
      );
    } finally {
      setIsProcessing(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
    }
    setIsProcessing(false);
    setAbortController(null);
  };

  // Auto-start processing when component mounts
  useEffect(() => {
    if (imageFile && !isProcessing && !errorMessage) {
      handleProcess();
    }
  }, [imageFile]);

  const totalItems = annotations.filter((a) => a.type === "item").length;
  const totalCategories = annotations.filter(
    (a) => a.type === "category",
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Processing Your Menu</h2>
        <p className="text-muted-foreground">
          AI is analyzing your menu structure and extracting categories and
          items
        </p>
        {annotations.length > 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Using {totalCategories} category annotations and {totalItems} item
            annotations
          </p>
        )}
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Menu being processed"
                className="w-full max-w-md mx-auto rounded-lg shadow-sm"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-lg">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Status */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {isProcessing ? (
              <>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Processing...</h3>
                  <p className="text-muted-foreground">{processingStep}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="mt-4"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </>
            ) : errorMessage ? (
              <>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-red-600">
                    Processing Failed
                  </h3>
                  <p className="text-muted-foreground mb-4">{errorMessage}</p>
                  <Button onClick={handleProcess} size="lg">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-green-600">
                    Processing Complete!
                  </h3>
                  <p className="text-muted-foreground">
                    Your menu structure has been analyzed successfully
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Steps */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Processing Steps</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep === "Preparing image..." || isProcessing
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <span
                className={
                  processingStep === "Preparing image..."
                    ? "text-primary font-medium"
                    : ""
                }
              >
                Preparing image
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep.includes("Sending to AI") ||
                  processingStep.includes("AI is analyzing")
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span
                className={
                  processingStep.includes("Sending to AI") ||
                  processingStep.includes("AI is analyzing")
                    ? "text-primary font-medium"
                    : ""
                }
              >
                AI structure analysis
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  processingStep === "Processing menu structure..." ||
                  processingStep === "Complete!"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <span
                className={
                  processingStep === "Processing menu structure..." ||
                  processingStep === "Complete!"
                    ? "text-primary font-medium"
                    : ""
                }
              >
                Processing results
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6">
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {!isProcessing && !errorMessage && (
          <Button onClick={handleProcess} size="lg">
            <ArrowRight className="w-4 h-4 mr-2" />
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
