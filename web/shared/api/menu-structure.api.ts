import {
  ParsedMenuStructure,
  CreateMenuStructureRequest,
  CreateMenuStructureResponse,
} from "../types/menu-structure.types";
import { apiClient } from "./client";

export async function parseMenuStructure(
  imageFile: File,
  annotations?: any[],
): Promise<ParsedMenuStructure> {
  const formData = new FormData();
  formData.append("image", imageFile);

  if (annotations && annotations.length > 0) {
    formData.append("annotations", JSON.stringify(annotations));
  }

  const response = await fetch("/api/menu/parse-structure", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to parse menu structure");
  }

  return response.json();
}

export async function createMenuStructure(
  request: CreateMenuStructureRequest,
): Promise<CreateMenuStructureResponse> {
  const response = await apiClient.post<CreateMenuStructureResponse>(
    "/api/restaurant-menu/create-structure",
    request,
  );

  return response.data;
}
