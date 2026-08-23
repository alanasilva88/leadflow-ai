import "server-only";
import OpenAI from "openai";

export function getOpenAIConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();
  if (!apiKey || apiKey === "adicione_sua_chave_aqui")
    throw new Error("A chave da OpenAI não está configurada no servidor.");
  if (!model || model === "adicione_um_modelo_compativel")
    throw new Error("O modelo da OpenAI não está configurado no servidor.");
  return {
    client: new OpenAI({ apiKey, timeout: 30_000, maxRetries: 1 }),
    model,
  };
}
