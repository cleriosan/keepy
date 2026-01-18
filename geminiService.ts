
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async generateMaintenanceAdvice(description: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given this maintenance issue: "${description}", provide a 2-sentence expert advice on the likely complexity and recommended trade professional to handle it.`,
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to generate advice at this time.";
    }
  },

  async summarizePropertyStatus(propertyId: string, jobs: any[], issues: any[]) {
    try {
      const prompt = `
        Summarize the current status of property ${propertyId}.
        Jobs: ${JSON.stringify(jobs)}
        Issues: ${JSON.stringify(issues)}
        Provide a concise 1-paragraph summary for the operations manager.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      return "Property status summary unavailable.";
    }
  }
};
