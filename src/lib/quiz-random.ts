/** Fisher–Yates shuffle (small arrays only). */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Pick unique random items without copying/shuffling the entire pool. */
export function pickRandomSample<T>(pool: T[], count: number): T[] {
  const n = Math.min(count, pool.length);
  if (n === 0) return [];
  if (n >= pool.length) return shuffle([...pool]);

  const picked = new Map<number, T>();
  while (picked.size < n) {
    const idx = Math.floor(Math.random() * pool.length);
    if (!picked.has(idx)) picked.set(idx, pool[idx]);
  }
  return [...picked.values()];
}

export function pickEnglishDistractors(
  target: { id: string; english: string },
  pool: { id: string; english: string }[],
  count: number,
): string[] {
  const used = new Set([target.english.toLowerCase()]);
  const distractors: string[] = [];
  let attempts = 0;
  const maxAttempts = Math.max(pool.length * 3, count * 10);

  while (distractors.length < count && attempts < maxAttempts) {
    attempts += 1;
    const item = pool[Math.floor(Math.random() * pool.length)];
    if (item.id === target.id) continue;
    const key = item.english.toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    distractors.push(item.english);
  }

  return distractors;
}
