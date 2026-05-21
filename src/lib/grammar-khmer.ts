import topikIGrammarExampleKhmerMap from "@/data/topik-i-grammar-example-khmer-map.json";
import topikIIGrammarExampleKhmerMap from "@/data/topik-ii-grammar-example-khmer-map.json";
import topikIGrammarKhmerMap from "@/data/topik-i-grammar-khmer-map.json";
import topikIIGrammarKhmerMap from "@/data/topik-ii-grammar-khmer-map.json";
import epsGrammarKhmerMap from "@/data/eps-grammar-khmer-map.json";
import koreanCounterKhmer from "@/data/korean-counter-khmer.json";

const grammarExampleKhmerById: Record<string, string> = {
  ...(topikIGrammarExampleKhmerMap as Record<string, string>),
  ...(topikIIGrammarExampleKhmerMap as Record<string, string>),
};

const grammarPatternKhmerById: Record<string, string> = {
  ...(epsGrammarKhmerMap as Record<string, string>),
  ...(topikIGrammarKhmerMap as Record<string, string>),
  ...(topikIIGrammarKhmerMap as Record<string, string>),
};

const counterKhmerByStem: Record<string, string> = {
  ...(koreanCounterKhmer as Record<string, string>),
};

/** Khmer translation of the example sentence (not the pattern gloss). */
export function getGrammarExampleKhmer(id: string): string {
  return grammarExampleKhmerById[id]?.trim() ?? "";
}

/** Khmer gloss for the grammar pattern meaning. */
export function getGrammarPatternKhmer(id: string, korean?: string): string {
  const byId = grammarPatternKhmerById[id]?.trim();
  if (byId) return byId;

  if (!korean) return "";

  const stem = korean.replace(/^-+/, "").split(/[=,/]/)[0]?.trim();
  if (!stem) return "";

  const base = stem.replace(/\(.*?\)/g, "").trim();
  return counterKhmerByStem[base] ?? "";
}
