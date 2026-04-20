
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeEssay(essay: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert scholarship advisor for the Deborah Gbolashire Ilori Foundation (DGIF). 
      This foundation honors a woman who valued integrity, academic excellence, and Christian service.
      We specifically look for resilience, especially in orphans or children of single mothers.
      
      Analyze the following scholarship essay and provide 3 constructive tips. 
      Help the student express their "inner star" and how they plan to light up the world through education.
      
      Essay: ${essay}`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "The DGIF advisor is currently offline. Please ensure your essay speaks from the heart about your goals and resilience.";
  }
}

export async function checkEligibility(profile: string) {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `DGIF focuses on orphans, fatherless children, and children of single parents from Ogbomoso land and beyond.
            Based on this profile: "${profile}", provide a warm, encouraging note on how they fit Pastor Ilori's vision of helping the less privileged.`,
        });
        return response.text;
    } catch (error) {
        return "We encourage all students from Ogbomoso and beyond to apply. We review every story with compassion.";
    }
}
