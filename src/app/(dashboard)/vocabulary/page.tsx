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
import { Flag, Heart, Pencil, Trash2 } from "lucide-react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { AddWordDialog } from "@/components/custom/AddWordDialog";
import { MyReportsDialog } from "@/components/custom/MyReportsDialog";
import {
  ReportWordDialog,
  type ReportWord,
} from "@/components/custom/ReportWordDialog";
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
import {
  useCustomWords,
  useFavoriteWords,
  useWordOverrides,
} from "@/hooks/use-custom-content";
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

type VocabDeck = "eps" | "topik" | "topik2" | "mine" | "favorites";

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
  const {
    words: customWords,
    addWord,
    updateWord,
    removeWord,
  } = useCustomWords();
  const { overrides, setOverride } = useWordOverrides();
  const { overrides: globalOverrides, setOverride: setGlobalOverride } =
    useGlobalWordOverrides();
  const { user, isAdmin } = useCurrentUser();
  const { favorites, toggleFavorite, isFavorite } = useFavoriteWords(
    user?.id ?? null,
  );

  const filtered: DisplayWord[] = useMemo(() => {
    const favoriteIds = new Set(favorites.map((f) => f.id));
    if (deck === "mine") {
      const list = searchCustomWords(query, customWords).filter(
        (w) => !favoriteIds.has(w.id),
      );
      return customWordsToDisplay(list);
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
    if (deck === "favorites") {
      const q = query.trim().toLowerCase();
      const matches = q
        ? favorites.filter(
            (w) =>
              w.korean.toLowerCase().includes(q) ||
              w.english.toLowerCase().includes(q) ||
              w.khmer.toLowerCase().includes(q),
          )
        : favorites;
      return matches.map((w, i) => ({
        id: w.id,
        num: i + 1,
        korean: w.korean,
        english: w.english,
        khmer: w.khmer,
        isCustom: w.id.startsWith("custom-"),
      }));
    }
    const excludeFavorites = <T extends { id: string }>(arr: T[]) =>
      arr.filter((w) => !favoriteIds.has(w.id));
    if (deck === "eps") {
      return excludeFavorites(searchEpsVocabulary(query)).map(toDisplay);
    }
    if (deck === "topik2") {
      return excludeFavorites(searchTopikIIVocabulary(query)).map(toDisplay);
    }
    return excludeFavorites(searchTopikVocabulary(query)).map(toDisplay);
  }, [deck, query, customWords, overrides, globalOverrides, favorites]);

  // Favorited words are pulled out of their source deck and into "Favorites",
  // so each deck's chip count should drop by the favorites it contains.
  const deckCounts = useMemo(() => {
    const favoriteIds = new Set(favorites.map((f) => f.id));
    const available = <T extends { id: string }>(arr: T[]) =>
      arr.reduce((n, w) => (favoriteIds.has(w.id) ? n : n + 1), 0);
    return {
      eps: available(epsTopikVocabulary),
      topik: available(topikIVocabulary),
      topik2: available(topikIIVocabulary),
      mine: available(customWords),
    };
  }, [favorites, customWords]);

  const switchDeck = (next: VocabDeck) => {
    setDeck(next);
    setQuery("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: { xs: "calc(100dvh - 7rem)", sm: "calc(100dvh - 8rem)" },
        minHeight: "34rem",
      }}
    >
      <Stack
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ mb: { xs: 1.5, sm: 2 }, flexShrink: 0 }}
      >
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
              { id: "eps", label: `EPS ${deckCounts.eps}` },
              { id: "topik", label: `TOPIK I ${deckCounts.topik}` },
              { id: "topik2", label: `TOPIK II ${deckCounts.topik2}` },
              { id: "mine", label: `Mine ${deckCounts.mine}` },
              { id: "favorites", label: `Favorites ${favorites.length}` },
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
                  onClick={() => setMyReportsOpen(true)}
                  sx={{
                    flex: { xs: 1, sm: "0 0 auto" },
                    whiteSpace: "nowrap",
                    borderRadius: 999,
                    minHeight: 44,
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
                  borderRadius: 999,
                  minHeight: 44,
                  px: 2.25,
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
                  : deck === "favorites"
                    ? "No favorite words yet. Tap the heart icon on a word to add it here."
                    : "No words match your search."}
              </Typography>
            ) : (
              <Grid
                container
                spacing={{ xs: 1, sm: 1.5 }}
                sx={{ p: { xs: 1, sm: 1.5 } }}
                key={`${deck}-${query}`}
              >
                {filtered.map((w) => (
                  <Grid
                    key={`${w.id}-${w.num}`}
                    size={{ xs: 12, sm: 6, xl: 4 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        display: "flex",
                        gap: { xs: 1, sm: 1.5 },
                        p: { xs: 1.25, sm: 2.5 },
                        minHeight: { xs: 76, sm: 120 },
                        height: "100%",
                        alignItems: "stretch",
                        borderColor: w.isCustom ? "primary.main" : "divider",
                        transition: "background-color 0.2s",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 26, sm: 32 },
                          height: { xs: 26, sm: 32 },
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
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                            fontSize: { xs: "1.25rem", sm: "1.625rem" },
                            lineHeight: 1.3,
                            color: "text.primary",
                            letterSpacing: "0.01em",
                          }}
                        />
                        {w.khmer ? (
                          <Typography
                            component="p"
                            sx={{
                              m: 0,
                              mt: { xs: 0.25, sm: 0.5 },
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
                            mt: { xs: 0.25, sm: 0.5 },
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
                        <IconButton
                          size="small"
                          aria-label={
                            isFavorite(w.id)
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                          onClick={() =>
                            toggleFavorite({
                              id: w.id,
                              korean: w.korean,
                              english: w.english,
                              khmer: w.khmer,
                            })
                          }
                          sx={{
                            color: isFavorite(w.id) ? "#e11d48" : "inherit",
                          }}
                        >
                          <Heart
                            size={16}
                            fill={isFavorite(w.id) ? "currentColor" : "none"}
                          />
                        </IconButton>
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

      <MyReportsDialog
        open={myReportsOpen}
        onClose={() => setMyReportsOpen(false)}
      />
    </Box>
  );
}
