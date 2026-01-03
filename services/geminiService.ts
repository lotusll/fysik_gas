
import { GoogleGenAI, Type } from "@google/genai";

export const getTutorExplanation = async (temp: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Du är en pedagogisk NO-lärare. Förklara fenomenet termisk utvidgning vid temperaturen ${temp}°C. 
  Jämför specifikt varför gaser utvidgas mycket mer än fasta ämnen och vätskor. 
  Använd citatet: "Anledningen är att molekylerna i en gas rör sig fritt och oberoende av varandra."
  Svara på svenska.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "En kort sammanfattning av vad som händer." },
            molecularDetail: { type: Type.STRING, description: "Förklaring på molekylnivå." },
            comparison: { type: Type.STRING, description: "En jämförelse mellan de tre tillstånden." }
          },
          required: ["summary", "molecularDetail", "comparison"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Error:", error);
    return null;
  }
};
