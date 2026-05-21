import type { AIMessage } from "@/types";

export const suggestedPrompts = [
  "Explain this grammar",
  "Give me Korean examples",
  "Quiz me on Hangul",
  "How do I say…?",
  "Practice a dialogue",
];

type Intent = "explain" | "examples" | "quiz" | "translate" | "default";

function pickIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/quiz|test me|question me/.test(t)) return "quiz";
  if (/example|show me|sample sentence/.test(t)) return "examples";
  if (/explain|what is|how does|grammar|particle|ending/.test(t)) return "explain";
  if (/how do i say|translate|mean in korean|뭐라고/.test(t)) return "translate";
  return "default";
}

function isQuizAnswer(text: string): boolean {
  return /^[abcd1-4]$/i.test(text.trim());
}

function lastAssistantHadQuiz(history: AIMessage[]): boolean {
  const last = [...history].reverse().find((m) => m.role === "assistant");
  return last ? /A\)\s*.+\s+B\)/.test(last.content) : false;
}

function gradeQuizAnswer(answer: string): string {
  const normalized = answer.trim().toLowerCase();
  if (normalized === "b" || normalized === "2") {
    return "✅ **Correct!** 안녕하세요 means **hello** (polite).\n\nUse it with teachers, strangers, and in formal situations. With close friends you might hear 안녕.\n\nWant another quiz?";
  }
  return "Not quite — the answer is **B) Hello (formal)**.\n\n**안녕하세요** is the standard polite greeting. Try again or ask for more examples!";
}

const responses: Record<Intent, string> = {
  default:
    "안녕하세요! 🇰🇷 I'm your Korean study helper.\n\nI can help with:\n• **Hangul** — reading and writing\n• **Phrases** — daily conversation\n• **Grammar** — particles and verb endings\n• **Practice** — quizzes and examples\n\nWhat would you like to work on?",
  explain:
    "**How to study Korean grammar:**\n\n1. Learn the **pattern** (e.g. subject + object + verb)\n2. Notice **particles** (은/는, 이/가, 을/를)\n3. Match **politeness level** (-요 vs -습니다)\n4. Make **3 example sentences** yourself\n\nTell me which grammar point confuses you!",
  examples:
    "**Useful Korean examples:**\n\n• 안녕하세요 — Hello (polite)\n• 감사합니다 — Thank you\n• 저는 ___이에요/예요 — I am ___\n• ___ 주세요 — Please give me ___\n• 몇 시예요? — What time is it?\n\nPaste a word or situation and I'll add more examples.",
  quiz: "**Quick quiz:**\n\nWhat does **안녕하세요** mean?\n\nA) Goodbye  \nB) Hello (formal)  \nC) Thank you  \nD) Sorry\n\nReply with A, B, C, or D!",
  translate:
    "Tell me the **English phrase** you want in Korean (or paste Korean to explain).\n\nExample: \"How do I say 'nice to meet you'?\" → **만나서 반갑습니다** (formal) or **만나서 반가워요** (polite).",
};

export function generateTutorResponse(
  userMessage: string,
  history: AIMessage[],
  _userName = "Learner"
): string {
  const text = userMessage.trim();
  if (!text) return "Type a question about Korean — grammar, phrases, or Hangul!";

  if (isQuizAnswer(text) && lastAssistantHadQuiz(history)) {
    return gradeQuizAnswer(text);
  }

  return responses[pickIntent(text)];
}

export function buildWelcomeMessage(): string {
  return `안녕하세요! 👋 Welcome to your personal Korean practice space.\n\nAsk about Hangul, phrases, grammar, or say **quiz me**. I'll explain step by step — no login needed.`;
}
