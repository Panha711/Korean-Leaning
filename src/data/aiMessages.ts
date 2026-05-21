import type { AIMessage } from "@/types";

export const initialAIMessages: (AIMessage & { timestamp: string })[] = [
  {
    id: "ai-welcome",
    role: "assistant",
    content:
      "안녕하세요! I am your Korean study assistant. Ask me to explain grammar, practice vocabulary, or role-play a conversation.",
    timestamp: new Date().toISOString(),
  },
];
