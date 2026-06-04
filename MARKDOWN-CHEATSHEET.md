# Markdown Cheat Sheet

> Quick reference. In VS Code, press **Ctrl+Shift+V** to see this rendered side-by-side.

---

## Headings

| You type | You get |
|----------|---------|
| `# Title` | Biggest heading (H1) |
| `## Section` | H2 |
| `### Sub-section` | H3 |
| `#### / ##### / ######` | H4–H6 (smaller) |

---

## Text styles

| You type | You get |
|----------|---------|
| `*italic*` | *italic* |
| `**bold**` | **bold** |
| `***bold italic***` | ***bold italic*** |
| `~~strikethrough~~` | ~~strikethrough~~ |
| `` `inline code` `` | `inline code` |

---

## Lists

**Bullets** (use `-`, `*`, or `+`):
```markdown
- Item one
- Item two
  - Nested item (indent 2 spaces)
```

**Numbered:**
```markdown
1. First
2. Second
3. Third
```

**Checklists (task list):**
```markdown
- [x] Done
- [ ] Not done yet
```
- [x] Done
- [ ] Not done yet

---

## Links & images

| You type | What it does |
|----------|--------------|
| `[Google](https://google.com)` | Clickable link |
| `![logo](public/next.svg)` | Shows an image |

---

## Code

**Inline:** `` `const x = 1` `` → `const x = 1`

**Block** (add the language for color highlighting):
````markdown
```ts
const greeting: string = "Hello";
console.log(greeting);
```
````

Renders as:
```ts
const greeting: string = "Hello";
console.log(greeting);
```

---

## Quotes

```markdown
> This is a quote.
> It can span multiple lines.
```
> This is a quote.
> It can span multiple lines.

---

## Tables

```markdown
| Name  | Role    |
|-------|---------|
| Panha | Dev     |
| Sok   | Student |
```
| Name  | Role    |
|-------|---------|
| Panha | Dev     |
| Sok   | Student |

---

## Horizontal line

Type three dashes on their own line:
```markdown
---
```

---

## Things that trip people up

1. **Blank lines matter.** Leave a blank line *before* a list, heading, table, or code block — otherwise it may not render.
2. **New paragraph** = leave a blank line. A single line break is usually ignored.
3. **Force a line break** = end a line with two spaces.  ← (there are 2 spaces after this period)
4. **Show a special character literally** = put `\` before it: `\*not italic\*` → \*not italic\*.
5. File extension is **`.md`**.

---

## Cambodia / project note

You can mix scripts freely — Markdown is just text:

```markdown
**한국어** = Korean   ·   **ភាសាខ្មែរ** = Khmer   ·   **English**
```
**한국어** = Korean · **ភាសាខ្មែរ** = Khmer · **English**
