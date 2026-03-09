import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function callLLM(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text;
    }
    catch (err) {
        console.error("Gemini failed:", err);
        return "";
    }
}