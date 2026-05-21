"""Extract TOPIK II vocab + grammar from PDFs into JSON for build scripts."""
import json
import re
import sys

try:
    import fitz
except ImportError:
    print("Install PyMuPDF: pip install pymupdf")
    sys.exit(1)

VOCAB_PDF = "scripts/topik-ii-vocab.pdf"
GRAMMAR_PDF = "scripts/TOPIK-II-Grammar.pdf"
VOCAB_OUT = "scripts/topik-ii-vocab-parsed.json"
GRAMMAR_OUT = "scripts/topik-ii-grammar-parsed.json"

# Filled when block regex misses a merged PDF line
VOCAB_MANUAL: dict[int, tuple[str, str]] = {
    602: ("돌잔치", "1st birthday"),
    1276: ("석유", "oil, petroleum"),
    1649: ("연애", "romance, courtship"),
    1688: ("오염", "pollution"),
    2334: ("취업", "employment"),
    2338: ("측", "~side"),
    2577: ("호칭", "name"),
    2617: ("〜회", "~ times"),
    2618: ("회갑", "one's 60th birthday"),
}


def lines_from_pdf(path: str) -> list[str]:
    doc = fitz.open(path)
    lines: list[str] = []
    for page in doc:
        for line in page.get_text().splitlines():
            t = line.strip()
            if t and not t.startswith("--"):
                lines.append(t)
    return lines


def parse_vocab_blocks(path: str) -> list[dict]:
    doc = fitz.open(path)
    entries: dict[int, dict] = {}
    row_re = re.compile(
        r"(\d{1,4})\s+([가-힣()][^\d]*?)\s+([A-Za-z(〜][^0-9]*?)(?=\s+\d{1,4}\s+[가-힣]|$)"
    )
    for page in doc:
        blocks = page.get_text("blocks")
        for b in sorted(blocks, key=lambda x: (round(x[1] / 5), x[0])):
            text = b[4].strip().replace("\n", " ")
            if not text or "TOPIK" in text or text in ("No.", "한글", "English"):
                continue
            for m in row_re.finditer(text):
                n = int(m.group(1))
                if 1 <= n <= 2662:
                    entries[n] = {
                        "num": n,
                        "korean": m.group(2).strip(),
                        "english": m.group(3).strip(),
                    }
    for n, (ko, en) in VOCAB_MANUAL.items():
        entries[n] = {"num": n, "korean": ko, "english": en}
    return [entries[n] for n in sorted(entries)]


def _is_grammar_header_junk(ko: str, en: str, ex_ko: str) -> bool:
    if "TOPIK" in ko and "Grammar" in ko:
        return True
    if en.strip() == "No.":
        return True
    if ex_ko in ("한글", "English", "예문", "Example"):
        return True
    if ko in ("No.", "한글", "English", "예문", "Example"):
        return True
    return not re.search(r"[가-힣]", ex_ko)


def parse_grammar(path: str) -> list[dict]:
    doc = fitz.open(path)
    entries: dict[int, dict] = {}
    for page in doc:
        for b in sorted(page.get_text("blocks"), key=lambda x: (round(x[1] / 5), x[0])):
            parts = [p.strip() for p in b[4].strip().split("\n") if p.strip()]
            if len(parts) != 5 or not parts[0].isdigit():
                continue
            n = int(parts[0])
            if not (1 <= n <= 200):
                continue
            ko, en, ex_ko, ex_en = parts[1], parts[2], parts[3], parts[4]
            if _is_grammar_header_junk(ko, en, ex_ko):
                continue
            entries[n] = {
                "num": n,
                "korean": ko,
                "english": en,
                "exampleKorean": ex_ko,
                "exampleEnglish": ex_en,
            }
    return [entries[n] for n in sorted(entries)]


def main() -> None:
    vocab = parse_vocab_blocks(VOCAB_PDF)
    grammar = parse_grammar(GRAMMAR_PDF)
    with open(VOCAB_OUT, "w", encoding="utf-8") as f:
        json.dump(vocab, f, ensure_ascii=False, indent=2)
    with open(GRAMMAR_OUT, "w", encoding="utf-8") as f:
        json.dump(grammar, f, ensure_ascii=False, indent=2)
    print(f"Vocab: {len(vocab)} -> {VOCAB_OUT}")
    print(f"Grammar: {len(grammar)} -> {GRAMMAR_OUT}")
    if len(vocab) != 2662:
        have = {e["num"] for e in vocab}
        missing = [n for n in range(1, 2663) if n not in have]
        print(f"  Missing vocab: {len(missing)}", missing[:25])


if __name__ == "__main__":
    main()
