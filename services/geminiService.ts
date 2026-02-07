
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSEOSuggestions = async (keyword: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 5 SEO strategy points for the keyword: "${keyword}". Return the result in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["title", "description"]
              }
            }
          }
        }
      }
    });
    // response.text is a property, not a method
    return JSON.parse(response.text || '{"suggestions": []}');
  } catch (error) {
    console.error("Gemini SEO generation error:", error);
    return { suggestions: [] };
  }
};

export const analyzeBillReceipt = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Analyze this bill receipt. Extract the Date, Amount, and Category. Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    // response.text is a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Bill Analysis error:", error);
    return null;
  }
};
