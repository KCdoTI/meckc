import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getRealTimeFeedback = async (field: string, value: string, context: any) => {
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Você é um mentor de inovação socrático para adolescentes na eletiva "Mente em Construção". 
    O aluno está preenchendo o campo "${field}" com a seguinte informação: "${value || '(campo vazio)'}".
    Contexto atual do projeto: ${JSON.stringify(context)}

    Seu objetivo é SEMPRE gerar uma dica que sirva de revisão e questionamento ao aluno. 
    Não dê a resposta pronta. Em vez disso:
    1. Se o campo estiver vazio ou muito curto, faça uma pergunta para inspirar o início do pensamento.
    2. Se houver conteúdo, questione a lógica, peça mais detalhes ou sugira olhar por outro ângulo.
    3. Ajude o aluno a raciocinar a ideia por conta própria.
    
    Seja breve, encorajador e use uma linguagem que conecte com jovens.
    Responda em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini Thinking:", error);
    return null;
  }
};

export const generateIdeaSuggestions = async (currentIdea: any) => {
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Você é um mentor de inovação para adolescentes. Ajude a refinar esta ideia de projeto digital.
    Dados atuais:
    Nome: ${currentIdea.name || 'Ainda não definido'}
    Problema: ${currentIdea.problem || 'Ainda não definido'}
    Público: ${currentIdea.targetAudience || 'Ainda não definido'}
    Solução: ${currentIdea.solution || 'Ainda não definido'}

    Com base no que foi preenchido, sugira melhorias ou próximos passos para tornar a ideia mais impactante e viável. 
    Seja encorajador e use linguagem jovem, mas profissional.
    Responda em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Ops, tive um probleminha para pensar agora. Tente novamente!";
  }
};

export const brainstormProblem = async (topic: string) => {
  if (!apiKey) return "API Key not found";
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Liste 3 problemas reais que adolescentes enfrentam hoje relacionados a: ${topic}.
    Para cada problema, explique brevemente por que ele é relevante.
    Responda em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "Não consegui pensar em problemas agora.";
  }
};
