"use client";

import {
  Check,
  Upload,
  Eye,
  Edit,
  CheckCircle,
  Palette,
  FolderOpen,
  Layout,
} from "lucide-react";
import { ImportStep } from "./ImportWizard";
import { cn } from "@/lib/utils";

interface ProgressSidebarProps {
  currentStep: ImportStep;
  onStepClick: (step: ImportStep) => void;
}

const steps = [
  {
    id: "upload" as const,
    title: "Upload Image",
    description: "Choose or capture your menu image",
    icon: Upload,
  },
  {
    id: "preview" as const,
    title: "Annotate Menu",
    description: "Mark categories and items with colors",
    icon: Palette,
  },
  {
    id: "process" as const,
    title: "Process with AI",
    description: "AI analyzes your annotated menu",
    icon: Eye,
  },
  {
    id: "review-categories" as const,
    title: "Review Categories",
    description: "Edit detected categories",
    icon: FolderOpen,
  },
  {
    id: "review-items" as const,
    title: "Review Items",
    description: "Edit items within categories",
    icon: Edit,
  },
  {
    id: "preview-structure" as const,
    title: "Preview Structure",
    description: "Review final menu layout",
    icon: Layout,
  },
  {
    id: "complete" as const,
    title: "Complete",
    description: "Menu structure created",
    icon: CheckCircle,
  },
];

export function ProgressSidebar({
  currentStep,
  onStepClick,
}: ProgressSidebarProps) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Import Progress
        </h3>
        <nav className="space-y-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = step.id === currentStep;
            const isClickable = index <= currentStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => isClickable && onStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                  "hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50",
                  isCurrent && "bg-primary/5 border border-primary/20",
                  isCompleted && "text-green-600",
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  ) : (
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-100 text-gray-400",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCompleted && "text-green-600",
                      isCurrent && "text-primary",
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>
            {Math.round(((currentStepIndex + 1) / steps.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 text-sm mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use good lighting for better results</li>
          <li>• Take photos straight-on, not at angles</li>
          <li>• Include the entire menu in frame</li>
          <li>• Avoid shadows and reflections</li>
        </ul>
      </div>
    </div>
  );
}
