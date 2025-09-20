import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ParsedMenuStructure {
  categories: ParsedCategory[];
  suggestedMenuName: string;
  suggestedMenuDescription: string;
}

export interface ParsedCategory {
  name: string;
  description: string;
  orderIndex: number;
  items: ParsedMenuItem[];
}

export interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  orderIndex: number;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Menu structure parse API called");

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const annotationsData = formData.get("annotations") as string;

    if (!imageFile) {
      console.error("No image file provided");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Parse annotations if provided
    let annotations = [];
    if (annotationsData) {
      try {
        annotations = JSON.parse(annotationsData);
        console.log("Annotations received:", annotations.length);
      } catch (error) {
        console.error("Failed to parse annotations:", error);
      }
    }

    console.log("Image file received:", {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type,
    });

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = imageFile.type;

    console.log("Image converted to base64, length:", base64.length);

    // Create enhanced OpenAI vision prompt for structure parsing
    let prompt = `Analyze this menu image and extract the complete menu structure. This is a restaurant menu that needs to be parsed into categories and items.

    IMPORTANT: Extract the ENTIRE menu structure, not just individual items. Focus on:
    1. Identifying all menu categories/sections (like "Appetizers", "Main Courses", "Desserts", "Beverages", etc.)
    2. For each category, extract all menu items within that section
    3. Maintain the logical order of categories as they appear on the menu
    4. Suggest an appropriate menu name and description

    For each category, provide:
    - Category name (required)
    - Category description (if available, otherwise create a brief one)
    - Order index (0, 1, 2, etc. based on menu position)
    - All menu items in that category

    For each menu item, provide:
    - Name (required)
    - Description (if available, otherwise create a brief one)
    - Price (extract as number, use 0 if not found)
    - Order index within the category (0, 1, 2, etc.)

    Return the data as a JSON object with this EXACT structure:
    {
      "categories": [
        {
          "name": "Category Name",
          "description": "Category description",
          "orderIndex": 0,
          "items": [
            {
              "name": "Item Name",
              "description": "Item description",
              "price": 12.99,
              "orderIndex": 0
            }
          ]
        }
      ],
      "suggestedMenuName": "Restaurant Name - Main Menu",
      "suggestedMenuDescription": "Our carefully crafted selection of dishes"
    }

    Only extract actual menu items (food/drinks), not headers, footers, or other text. Be accurate with prices and names.`;

    // Add annotation context if available
    if (annotations.length > 0) {
      const categoryAnnotations = annotations.filter(
        (a: any) => a.type === "category",
      );
      const itemAnnotations = annotations.filter((a: any) => a.type === "item");
      const priceAnnotations = annotations.filter(
        (a: any) => a.type === "price",
      );

      prompt += `\n\nIMPORTANT: This image has been annotated to help you understand the structure:

      - BLUE annotations mark CATEGORIES/SECTIONS (like "Appetizers", "Main Courses", "Desserts")
      - GREEN annotations mark INDIVIDUAL MENU ITEMS (specific dishes)
      - YELLOW annotations mark PRICES (price text and numbers)
      - RED annotations mark SPECIAL NOTES (like "Spicy", "Vegetarian")
      - PURPLE annotations mark DESCRIPTIONS (item descriptions)

      The annotations are positioned at specific coordinates on the image. Use these visual markers to:
      1. Identify which text belongs to which category
      2. Group menu items by their sections
      3. Extract prices more accurately
      4. Understand the menu layout and structure
      5. Maintain proper category boundaries

      Pay special attention to the BLUE category markers - these will help you group items correctly and identify category boundaries.`;
    }

    console.log("Calling OpenAI API...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    });

    console.log("OpenAI API response received");

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    console.log("OpenAI response content:", content);

    // Parse the JSON response
    let parsedStructure: ParsedMenuStructure;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      parsedStructure = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response as JSON:", parseError);
      console.error("Raw response:", content);
      throw new Error("Failed to parse menu structure from AI response");
    }

    // Validate the parsed structure
    if (
      !parsedStructure.categories ||
      !Array.isArray(parsedStructure.categories)
    ) {
      throw new Error("Invalid menu structure: missing or invalid categories");
    }

    // Ensure all categories have required fields
    parsedStructure.categories = parsedStructure.categories.map(
      (category, index) => ({
        name: category.name || `Category ${index + 1}`,
        description: category.description || "",
        orderIndex: category.orderIndex ?? index,
        items: (category.items || []).map((item, itemIndex) => ({
          name: item.name || `Item ${itemIndex + 1}`,
          description: item.description || "",
          price: typeof item.price === "number" ? item.price : 0,
          orderIndex: item.orderIndex ?? itemIndex,
        })),
      }),
    );

    // Set defaults for menu name and description
    parsedStructure.suggestedMenuName =
      parsedStructure.suggestedMenuName || "Main Menu";
    parsedStructure.suggestedMenuDescription =
      parsedStructure.suggestedMenuDescription ||
      "Our carefully crafted selection of dishes";

    console.log("Parsed menu structure:", {
      categoriesCount: parsedStructure.categories.length,
      totalItems: parsedStructure.categories.reduce(
        (sum, cat) => sum + cat.items.length,
        0,
      ),
      menuName: parsedStructure.suggestedMenuName,
    });

    return NextResponse.json(parsedStructure);
  } catch (error) {
    console.error("Error parsing menu structure:", error);
    return NextResponse.json(
      { error: "Failed to parse menu structure" },
      { status: 500 },
    );
  }
}
