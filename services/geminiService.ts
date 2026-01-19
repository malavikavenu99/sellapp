
import { GoogleGenAI, Type } from "@google/genai";

// Fixed: Using process.env.API_KEY directly inside functions to ensure the latest key is used.

export const generateProductDescription = async (productName: string, features: string) => {
  // Initialize AI instance right before the API call as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a compelling, professional e-commerce product description for: ${productName}. 
    Key features to include: ${features}. 
    Keep it under 100 words and make it sound premium and tech-forward.`,
  });

  // Accessing the .text property directly.
  return response.text;
};

export const analyzeSalesTrends = async (orderHistory: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these recent sales: ${JSON.stringify(orderHistory)}. 
    Provide one brief insight about which products are performing well or what to focus on next.`,
  });

  return response.text;
};

/**
 * Evaluates a user's product pitch and returns a structured analysis.
 */
export const analyzePitch = async (pitchText: string, productName: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a world-class startup mentor and pitch consultant. Evaluate the following elevator pitch for a product called "${productName}": "${pitchText}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "A pitch quality score from 1 to 100.",
          },
          feedback: {
            type: Type.STRING,
            description: "A professional and encouraging critique of the pitch.",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 specific, actionable points to improve the pitch.",
          },
        },
        required: ["score", "feedback", "suggestions"],
      },
    },
  });

  // Extract text and parse as JSON since responseMimeType is application/json.
  return JSON.parse(response.text || "{}");
};
