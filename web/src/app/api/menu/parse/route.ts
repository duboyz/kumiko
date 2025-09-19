import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    console.log("Menu parse API called");

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

    if (!imageFile) {
      console.error("No image file provided");
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
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

    // Create OpenAI vision prompt
    const prompt = `Analyze this menu image and extract all menu items. For each item, provide:
1. Name (required)
2. Description (if available, otherwise use a brief description)
3. Price (extract the price as a number, if no price found use 0)

Return the data as a JSON array of objects with this exact structure:
[
  {
    "name": "Item Name",
    "description": "Item description or brief summary",
    "price": 12.99
  }
]

Only extract actual menu items (food/drinks), not headers, sections, or other text. Be accurate with prices and names.`;

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
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    console.log("OpenAI API response received");
    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("No content in OpenAI response");
      throw new Error("No response from OpenAI");
    }

    console.log("OpenAI response content:", content.substring(0, 200) + "...");

    // Parse the JSON response
    let menuItems;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        menuItems = JSON.parse(jsonMatch[0]);
      } else {
        menuItems = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      console.error("Raw response:", content);
      throw new Error("Failed to parse menu items from AI response");
    }

    // Validate the parsed data
    if (!Array.isArray(menuItems)) {
      throw new Error("Invalid response format from AI");
    }

    // Clean and validate each item
    const cleanedItems = menuItems.map((item, index) => ({
      id: `temp-${index}`,
      name: item.name || `Menu Item ${index + 1}`,
      description: item.description || "",
      price: typeof item.price === "number" ? item.price : 0,
    }));

    return NextResponse.json({
      success: true,
      menuItems: cleanedItems,
    });
  } catch (error) {
    console.error("Menu parsing error:", error);
    return NextResponse.json(
      { error: "Failed to parse menu image" },
      { status: 500 },
    );
  }
}
