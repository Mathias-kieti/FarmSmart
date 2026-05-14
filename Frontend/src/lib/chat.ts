import { apiFetch } from "./api";

export interface ChatRequest {
  question: string;
  [key: string]: unknown;
}

export type ChatResponse = Record<string, unknown>;

export function sendChatRequest(data: ChatRequest) {
  return apiFetch<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
