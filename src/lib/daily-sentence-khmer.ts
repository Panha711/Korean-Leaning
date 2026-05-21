import lineKhmerMap from "@/data/daily-sentence-line-khmer-map.json";

const map = lineKhmerMap as Record<string, string>;

export function dailySentenceLineKey(groupId: string, lineIndex: number) {
  return `${groupId}:${lineIndex}`;
}

export function getDailySentenceLineKhmer(
  groupId: string,
  lineIndex: number,
): string {
  return map[dailySentenceLineKey(groupId, lineIndex)]?.trim() ?? "";
}
