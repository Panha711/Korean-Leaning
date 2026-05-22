"use client";

import { useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { Pencil, Trash2 } from "lucide-react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { AddWordDialog } from "@/components/custom/AddWordDialog";
import { SearchFieldWithClear } from "@/components/common/SearchFieldWithClear";
import { DeckFilterChips } from "@/components/layout/DeckFilterChips";
import { StudyPageHeader } from "@/components/layout/StudyPageHeader";
import {
  epsTopikVocabulary,
  searchEpsVocabulary,
} from "@/data/eps-topik-vocabulary";
import {
  topikIVocabulary,
  searchTopikVocabulary,
} from "@/data/topik-i-vocabulary";
import {
  topikIIVocabulary,
  searchTopikIIVocabulary,
} from "@/data/topik-ii-vocabulary";
import { useCustomWords } from "@/hooks/use-custom-content";
import {
  customWordsToDisplay,
  searchCustomWords,
  type DisplayWord,
} from "@/lib/custom-content";
import { getEasyReadLineStyles } from "@/lib/dialogue-readability-styles";
import { normalizeKhmer } from "@/lib/khmer-text";

type VocabDeck = "eps" | "topik" | "topik2" | "mine";

const KOREAN_FONT =
  "var(--font-noto-sans-kr), 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";

export default function VocabularyPage() {
  const theme = useTheme();
  const lineStyles = getEasyReadLineStyles(theme);

  const listRef = useRef<HTMLDivElement>(null);
  const [deck, setDeck] = useState<VocabDeck>("eps");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const { words: customWords, addWord, updateWord, removeWord } =
    useCustomWords();

  const editingWord = useMemo(
    () => customWords.find((w) => w.id === editId) ?? null,
    [customWords, editId],
  );

  const filtered: DisplayWord[] = useMemo(() => {
    if (deck === "mine") {
      return customWordsToDisplay(searchCustomWords(query, customWords));
    }
    if (deck === "eps") {
      return searchEpsVocabulary(query).map((w) => ({
        id: w.id,
        num: w.num,
        korean: w.korean,
        english: w.english,
        khmer: w.khmer,
      }));
    }
    if (deck === "topik2") {
      return searchTopikIIVocabulary(query).map((w) => ({
        id: w.id,
        num: w.num,
        korean: w.korean,
        english: w.english,
        khmer: w.khmer,
      }));
    }
    return searchTopikVocabulary(query).map((w) => ({
      id: w.id,
      num: w.num,
      korean: w.korean,
      english: w.english,
      khmer: w.khmer,
    }));
  }, [deck, query, customWords]);

  const switchDeck = (next: VocabDeck) => {
    setDeck(next);
    setQuery("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100dvh - 10.5rem)",
        minHeight: "28rem",
      }}
    >
      <Stack spacing={2} sx={{ mb: 2, flexShrink: 0 }}>
        <StudyPageHeader icon={MenuBookIcon} title="Words" accent="#7c3aed" />

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { lg: "center" } }}
        >
          <DeckFilterChips
            value={deck}
            onChange={switchDeck}
            options={[
              { id: "eps", label: `EPS-TOPIK (${epsTopikVocabulary.length})` },
              { id: "topik", label: `TOPIK I (${topikIVocabulary.length})` },
              { id: "topik2", label: `TOPIK II (${topikIIVocabulary.length})` },
              { id: "mine", label: `My words (${customWords.length})` },
            ]}
          />

          <Stack
            direction="row"
            spacing={1}
            sx={{
              width: { xs: 1, lg: "auto" },
              minWidth: { lg: 320 },
              maxWidth: { lg: 520 },
              flex: { lg: 1 },
              justifyContent: { lg: "flex-end" },
            }}
          >
            <SearchFieldWithClear
              value={query}
              onChange={setQuery}
              onClear={() =>
                listRef.current?.scrollTo({ top: 0, behavior: "instant" })
              }
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddOpen(true)}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                borderRadius: 10,
                px: 2.0,
                fontWeight: 800,
                textTransform: "none",
                boxShadow: (t) => `0 2px 10px ${t.palette.primary.main}66`,
              }}
            >
              Add word
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {query.trim() ? (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
              flexShrink: 0,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </Typography>
          </Box>
        ) : null}
        <CardContent
          sx={{ flex: 1, minHeight: 0, p: 0, "&:last-child": { pb: 0 } }}
        >
          <Box
            ref={listRef}
            className="scrollbar-styled-slim"
            sx={{
              height: "100%",
              overflow: "auto",
              overscrollBehavior: "contain",
            }}
          >
            {filtered.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ py: 8, textAlign: "center" }}
              >
                {deck === "mine"
                  ? "No custom words yet. Tap Add word to create one."
                  : "No words match your search."}
              </Typography>
            ) : (
              <Grid
                container
                spacing={1.5}
                sx={{ p: 1.5 }}
                key={`${deck}-${query}`}
              >
                {filtered.map((w) => (
                  <Grid key={`${w.id}-${w.num}`} size={{ xs: 12, sm: 6, xl: 4 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        p: 2,
                        borderColor: w.isCustom ? "primary.main" : "divider",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 1,
                          bgcolor: w.isCustom
                            ? "primary.main"
                            : "action.selected",
                          color: w.isCustom
                            ? "primary.contrastText"
                            : "inherit",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        {w.isCustom ? "★" : w.num}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          component="p"
                          sx={{
                            fontFamily: KOREAN_FONT,
                            fontWeight: 700,
                            fontSize: { xs: "1.5rem", sm: "1.625rem" },
                            lineHeight: 1.35,
                            color: "text.primary",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {w.korean}
                        </Typography>
                        {w.khmer ? (
                          <Typography
                            component="p"
                            sx={{
                              m: 0,
                              mt: 0.5,
                              fontFamily: KHMER_FONT,
                              ...lineStyles.khmer,
                            }}
                          >
                            {normalizeKhmer(w.khmer)}
                          </Typography>
                        ) : null}
                        <Typography
                          component="p"
                          sx={{
                            m: 0,
                            mt: 0.5,
                            ...lineStyles.english,
                          }}
                        >
                          {w.english}
                        </Typography>
                      </Box>
                      {w.isCustom ? (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          sx={{ alignSelf: "flex-start", flexShrink: 0 }}
                        >
                          <IconButton
                            size="small"
                            aria-label="Edit word"
                            onClick={() => setEditId(w.id)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton
                            size="small"
                            aria-label="Delete word"
                            onClick={() => removeWord(w.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Stack>
                      ) : null}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>

      <AddWordDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(word) => {
          addWord(word);
          setDeck("mine");
        }}
      />

      <AddWordDialog
        open={editingWord !== null}
        onClose={() => setEditId(null)}
        onSave={(word) => {
          if (editId) updateWord(editId, word);
        }}
        initial={
          editingWord
            ? {
                korean: editingWord.korean,
                english: editingWord.english,
                khmer: editingWord.khmer,
              }
            : null
        }
      />
    </Box>
  );
}
