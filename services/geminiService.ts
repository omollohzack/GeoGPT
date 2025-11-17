
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { UserLocation } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getChatResponse(prompt: string, location: UserLocation | null): Promise<GenerateContentResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        ...(location && {
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          },
        }),
      },
    });
    return response;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
}
