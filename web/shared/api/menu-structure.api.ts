import {
  ParsedMenuStructure,
  CreateMenuStructureRequest,
  CreateMenuStructureResponse,
} from "../types/menu-structure.types";

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
  const response = await fetch("/api/restaurant-menu/create-structure", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create menu structure");
  }

  const result = await response.json();
  return result.data;
}
