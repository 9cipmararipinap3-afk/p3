
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || "";

export const extractDataFromContent = async (base64Data: string, mimeType: string = 'image/png', textContent?: string) => {
  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `
    Você é um especialista em análise de Boletins de Ocorrência (BO) da Polícia Militar de Pernambuco.
    Sua tarefa é extrair dados estruturados de textos, imagens ou PDFs de BOs.
    Categorize a 'nature' em um dos seguintes: 'Tráfico de Entorpecentes', 'Posse/Porte de Arma de Fogo', 'Violência Doméstica', 'Roubo/Furto' ou 'Outros'.
    Extraia itens apreendidos (armas, drogas, munições) com quantidades e unidades.
    Retorne SEMPRE um JSON válido.
  `;

  const prompt = textContent 
    ? `Extraia os dados deste relatório policial: ${textContent}`
    : `Analise este documento (imagem ou PDF) de um relatório policial e extraia os dados estruturados conforme o esquema.`;

  const contents: any = { 
    parts: [
      { inlineData: { mimeType: mimeType, data: base64Data } }, 
      { text: prompt }
    ] 
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            boepm: { type: Type.STRING },
            boepc: { type: Type.STRING },
            dateTime: { type: Type.STRING, description: "Formato ISO 8601 ou similar encontrado" },
            city: { type: Type.STRING },
            neighborhood: { type: Type.STRING },
            nature: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            outcome: { type: Type.STRING },
            summary: { type: Type.STRING },
            seizedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  quantity: { type: Type.STRING },
                  unit: { type: Type.STRING }
                }
              }
            },
            involvedParties: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Erro ao processar com Gemini:", error);
    throw error;
  }
};
