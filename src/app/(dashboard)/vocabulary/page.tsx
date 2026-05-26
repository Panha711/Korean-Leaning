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
import { Flag, Pencil, Trash2 } from "lucide-react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { AddWordDialog } from "@/components/custom/AddWordDialog";
import { MyReportsDialog } from "@/components/custom/MyReportsDialog";
import { ReportWordDialog, type ReportWord } from "@/components/custom/ReportWordDialog";
import { SearchFieldWithClear } from "@/components/common/SearchFieldWithClear";
import { SpeakableKorean } from "@/components/common/SpeakableKorean";
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
import { useCustomWords, useWordOverrides } from "@/hooks/use-custom-content";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  applyGlobalOverride,
  useGlobalWordOverrides,
} from "@/hooks/use-global-word-overrides";
import {
  applyWordOverride,
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
  const [editing, setEditing] = useState<DisplayWord | null>(null);
  const [reporting, setReporting] = useState<ReportWord | null>(null);
  const [myReportsOpen, setMyReportsOpen] = useState(false);
  const { words: customWords, addWord, updateWord, removeWord } =
    useCustomWords();
  const { overrides, setOverride } = useWordOverrides();
  const { overrides: globalOverrides, setOverride: setGlobalOverride } =
    useGlobalWordOverrides();
  const { isAdmin } = useCurrentUser();

  const filtered: DisplayWord[] = useMemo(() => {
    if (deck === "mine") {
      return customWordsToDisplay(searchCustomWords(query, customWords));
    }
    const toDisplay = (w: {
      id: string;
      num: number;
      korean: string;
      english: string;
      khmer: string;
    }): DisplayWord => {
      // Global (DB) override applies first, then any personal override on top.
      const withGlobal = applyGlobalOverride(w, globalOverrides);
      const merged = applyWordOverride(withGlobal, overrides);
      return {
        id: merged.id,
        num: merged.num,
        korean: merged.korean,
        english: merged.english,
        khmer: merged.khmer,
      };
    };
    if (deck === "eps") {
      return searchEpsVocabulary(query).map(toDisplay);
    }
    if (deck === "topik2") {
      return searchTopikIIVocabulary(query).map(toDisplay);
    }
    return searchTopikVocabulary(query).map(toDisplay);
  }, [deck, query, customWords, overrides, globalOverrides]);

  const switchDeck = (next: VocabDeck) => {
    setDeck(next);
    setQuery("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "calc(100dvh - 7rem)", sm: "calc(100dvh - 10.5rem)" },
        minHeight: "28rem",
      }}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <StudyPageHeader icon={MenuBookIcon} title="Words" accent="#7c3aed" />
        </Box>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 1.5, lg: 2 }}
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
            direction={{ xs: "column", sm: "row" }}
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
            <Stack
              direction="row"
              spacing={1}
              sx={{ width: { xs: 1, sm: "auto" }, flexShrink: 0 }}
            >
              {!isAdmin ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setMyReportsOpen(true)}
                  sx={{
                    flex: { xs: 1, sm: "0 0 auto" },
                    whiteSpace: "nowrap",
                    borderRadius: 10,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  My reports
                </Button>
              ) : null}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setAddOpen(true)}
                sx={{
                  flex: { xs: 1, sm: "0 0 auto" },
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
                        gap: { xs: 1, sm: 1.5 },
                        p: { xs: 1.5, sm: 2 },
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
                        <SpeakableKorean
                          text={w.korean}
                          sx={{
                            fontFamily: KOREAN_FONT,
                            fontWeight: 700,
                            fontSize: { xs: "1.5rem", sm: "1.625rem" },
                            lineHeight: 1.35,
                            color: "text.primary",
                            letterSpacing: "0.01em",
                          }}
                        />
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
                      <Stack
                        direction="row"
                        spacing={0.5}
                        sx={{ alignSelf: "flex-start", flexShrink: 0 }}
                      >
                        {w.isCustom || isAdmin ? (
                          <IconButton
                            size="small"
                            aria-label="Edit word"
                            onClick={() => setEditing(w)}
                          >
                            <Pencil size={16} />
                          </IconButton>
                        ) : null}
                        {!w.isCustom && !isAdmin ? (
                          <IconButton
                            size="small"
                            aria-label="Report wrong translation"
                            onClick={() =>
                              setReporting({
                                id: w.id,
                                korean: w.korean,
                                english: w.english,
                                khmer: w.khmer,
                              })
                            }
                          >
                            <Flag size={16} />
                          </IconButton>
                        ) : null}
                        {w.isCustom ? (
                          <IconButton
                            size="small"
                            aria-label="Delete word"
                            onClick={() => removeWord(w.id)}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        ) : null}
                      </Stack>
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
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(word) => {
          if (!editing) return;
          if (editing.isCustom) {
            updateWord(editing.id, word);
          } else if (isAdmin) {
            // Admin edits save to DB so all users see the fix
            void setGlobalOverride(editing.id, word).catch(() => {
              // fall back to local override if the API fails
              setOverride(editing.id, word);
            });
          } else {
            setOverride(editing.id, word);
          }
        }}
        initial={
          editing
            ? {
                korean: editing.korean,
                english: editing.english,
                khmer: editing.khmer,
              }
            : null
        }
      />

      <ReportWordDialog
        open={reporting !== null}
        word={reporting}
        onClose={() => setReporting(null)}
      />

      <MyReportsDialog open={myReportsOpen} onClose={() => setMyReportsOpen(false)} />
    </Box>
  );
}
