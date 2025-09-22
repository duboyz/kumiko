"use client";

import { Suspense } from "react";
import { ImportWizard } from "./components/ImportWizard";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function ImportMenuItemsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <ImportWizard />
    </Suspense>
  );
}
