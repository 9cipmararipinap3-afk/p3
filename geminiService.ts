import { GoogleGenAI, Type } from "@google/genai";

export const extractDataFromContent = async (base64Data: string, mimeType: string = 'image/png', textContent?: string) => {
  // Inicialização obrigatória conforme as diretrizes
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Você é um assistente especializado da Polícia Militar de Pernambuco (9ª CIPM).
    Sua função é ler imagens, PDFs ou textos de Boletins de Ocorrência e extrair dados estruturados.
    
    REGRAS DE CATEGORIZAÇÃO (Natureza):
    - Tráfico de Entorpecentes: se houver apreensão de drogas para venda.
    - Posse/Porte de Arma de Fogo: se houver armas ou munições.
    - Violência Doméstica: casos de Lei Maria da Penha ou agressão familiar.
    - Roubo/Furto: subtração de bens.
    - Outros: se não se encaixar nos acima.

    IMPORTANTE: 
    - Extraia o número do BOEPM e BOEPC se visíveis.
    - Identifique itens apreendidos detalhadamente (tipo, quantidade e unidade).
    - O campo 'dateTime' deve ser retornado no formato YYYY-MM-DDTHH:mm.
  `;

  const prompt = textContent 
    ? `Extraia os dados estruturados deste texto de BO: ${textContent}`
    : `Analise visualmente este documento e extraia todos os dados relevantes para o sistema SGO.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Data } },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            boepm: { type: Type.STRING },
            boepc: { type: Type.STRING },
            dateTime: { type: Type.STRING },
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

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("IA retornou resposta vazia");
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Erro no processamento Gemini:", error);
    throw error;
  }
};