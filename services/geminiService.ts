
import { GoogleGenAI } from "@google/genai";
import { GenerationRequest, EditRequest } from "../types";

// Initialize Gemini Client
// Note: process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Helper to draw the selection box on the image for Visual Prompting.
 * Returns the modified image as a base64 string (without prefix).
 */
const prepareImageWithSelection = async (base64Image: string, selection: EditRequest['selection']): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw the selection box (Red, thick stroke)
      ctx.strokeStyle = '#FF0000'; // Pure Red
      ctx.lineWidth = Math.max(5, Math.min(canvas.width, canvas.height) * 0.01); // Responsive line width
      ctx.strokeRect(selection.x, selection.y, selection.width, selection.height);

      // Convert back to base64
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = reject;
    img.src = base64Image;
  });
};

/**
 * Generates a thumbnail using the "Nano banana" model (gemini-2.5-flash-image).
 */
export const generateThumbnail = async (request: GenerationRequest): Promise<string> => {
  const { 
    imageFile, 
    overlayText, 
    textStyle,
    faceExpression,
    characterAction,
    background,
    visualStyle,
    aspectRatio
  } = request;

  try {
    const imagePart = await fileToGenerativePart(imageFile);

    // Structure the prompt to prioritize Text Rendering by placing it FIRST.
    const prompt = `
      MANDATORY INSTRUCTION: Render specific text on the image. 
      TEXT TO RENDER: "${overlayText}"
      TEXT STYLE: ${textStyle}.
      The text must be huge, legible, and the focal point of the image.

      You are an expert YouTube Thumbnail designer. 
      Task: Create a viral YouTube thumbnail based on the provided image of a person.
      
      COMPOSITION DETAILS:
      1. CHARACTER:
         - Expression: ${faceExpression} (Extreme and emotive).
         - Action: ${characterAction}. (Modify body/arms to match seamlessly).
         
      2. ENVIRONMENT:
         - Background: ${background}.
         - Style: ${visualStyle}.
         - Lighting: High-contrast, cinematic.
      
      3. TEXT PLACEMENT:
         - Ensure "${overlayText}" is clearly visible. 
         - Use high contrast colors against the background.
         - Do not misspell the text.
         
      4. VIBE:
         - High saturation, sharp details, exciting composition.
      
      Return only the generated image.
    `;

    // Using gemini-2.5-flash-image (Nano banana)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any // Cast to any to satisfy TS enum if needed, string is valid in SDK
        }
      }
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate thumbnail: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while generating the thumbnail.");
  }
};

/**
 * Edits a specific area of the thumbnail.
 */
export const editThumbnail = async (request: EditRequest): Promise<string> => {
  const { originalImageBase64, editPrompt, selection } = request;

  try {
    // 1. Prepare the image by drawing the red box
    const cleanBase64 = originalImageBase64.startsWith('data:') 
      ? originalImageBase64 : `data:image/png;base64,${originalImageBase64}`;
      
    const markedImageBase64 = await prepareImageWithSelection(cleanBase64, selection);

    // 2. Construct the prompt
    const prompt = `
      You are an expert image editor.
      Task: Edit the provided image based on the user's request.
      
      Input Image: The provided image contains a RED BOUNDING BOX indicating the specific area to edit.
      User Request: "${editPrompt}" inside the marked area.
      
      Instructions:
      1. Only alter the content within the RED BOUNDING BOX area.
      2. The rest of the image MUST remain exactly identical to the original.
      3. CRITICAL: Remove the red bounding box in the final output. The edges should be seamless.
      4. Ensure the style matches the existing thumbnail art style.
      
      Return only the edited image.
    `;

    // 3. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: markedImageBase64, mimeType: 'image/png' } },
          { text: prompt }
        ],
      },
    });

    // 4. Extract result
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in the edit response.");

  } catch (error) {
    console.error("Gemini Edit Error:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to edit thumbnail: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while editing.");
  }
};
