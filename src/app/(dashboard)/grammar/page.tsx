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
import TranslateIcon from "@mui/icons-material/Translate";
import { AddGrammarDialog } from "@/components/custom/AddGrammarDialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  applyGlobalGrammarOverride,
  useGlobalGrammarOverrides,
} from "@/hooks/use-global-grammar-overrides";
import { SearchFieldWithClear } from "@/components/common/SearchFieldWithClear";
import { SpeakableKorean } from "@/components/common/SpeakableKorean";
import { DeckFilterChips } from "@/components/layout/DeckFilterChips";
import { StudyPageHeader } from "@/components/layout/StudyPageHeader";
import { getEasyReadLineStyles } from "@/lib/dialogue-readability-styles";
import { epsTopikGrammar } from "@/data/eps-topik-grammar";
import {
  haeyoFormGrammar,
  haeyoFormToDisplay,
  searchHaeyoFormGrammar,
} from "@/data/haeyo-form-grammar";
import { topikIGrammar } from "@/data/topik-i-grammar";
import { topikIIGrammar } from "@/data/topik-ii-grammar";
import { useCustomGrammar } from "@/hooks/use-custom-content";
import {
  customGrammarToDisplay,
  searchCustomGrammar,
  type DisplayGrammar,
} from "@/lib/custom-content";
import { getGrammarExampleKhmer, getGrammarPatternKhmer } from "@/lib/grammar-khmer";
import { normalizeKhmer } from "@/lib/khmer-text";

type GrammarDeck = "eps" | "topik" | "topik2" | "haeyo" | "mine";

const KOREAN_FONT =
  "var(--font-noto-sans-kr), 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif";
const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";

export default function GrammarPage() {
  const theme = useTheme();
  const lineStyles = getEasyReadLineStyles(theme);

  const listRef = useRef<HTMLDivElement>(null);
  const [deck, setDeck] = useState<GrammarDeck>("topik");
  const [query, setQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<DisplayGrammar | null>(null);
  const {
    grammar: customGrammar,
    addGrammar,
    removeGrammar,
  } = useCustomGrammar();
  const { overrides: globalGrammarOverrides, setOverride: setGlobalGrammarOverride } =
    useGlobalGrammarOverrides();
  const { isAdmin } = useCurrentUser();

  const filtered: DisplayGrammar[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (deck === "mine") {
      return customGrammarToDisplay(searchCustomGrammar(query, customGrammar));
    }

    const applyOverride = <
      T extends {
        id: string;
        korean: string;
        english: string;
        patternKhmer?: string;
        exampleKorean?: string;
        exampleEnglish?: string;
        exampleKhmer?: string;
      },
    >(g: T): T => applyGlobalGrammarOverride(g, globalGrammarOverrides);

    if (deck === "eps") {
      const pool = epsTopikGrammar.map((g) =>
        applyOverride({
          ...g,
          patternKhmer: getGrammarPatternKhmer(g.id, g.korean) || undefined,
        }),
      );
      const list = q
        ? pool.filter(
            (g) =>
              g.korean.toLowerCase().includes(q) ||
              g.english.toLowerCase().includes(q) ||
              g.patternKhmer?.toLowerCase().includes(q) ||
              String(g.num).includes(q),
          )
        : pool;
      return list.map((g) => ({
        id: g.id,
        num: g.num,
        korean: g.korean,
        english: g.english,
        patternKhmer: g.patternKhmer,
      }));
    }

    if (deck === "haeyo") {
      return searchHaeyoFormGrammar(query)
        .map(haeyoFormToDisplay)
        .map(applyOverride);
    }

    if (deck === "topik2") {
      const pool = topikIIGrammar.map((g) =>
        applyOverride({
          id: g.id,
          num: g.num,
          korean: g.korean,
          english: g.english,
          patternKhmer: getGrammarPatternKhmer(g.id, g.korean) || undefined,
          exampleKorean: g.exampleKorean,
          exampleEnglish: g.exampleEnglish,
          exampleKhmer: getGrammarExampleKhmer(g.id) || undefined,
        }),
      );
      const list = q
        ? pool.filter(
            (g) =>
              g.korean.toLowerCase().includes(q) ||
              g.english.toLowerCase().includes(q) ||
              g.patternKhmer?.toLowerCase().includes(q) ||
              g.exampleKorean?.toLowerCase().includes(q) ||
              g.exampleEnglish?.toLowerCase().includes(q) ||
              g.exampleKhmer?.toLowerCase().includes(q) ||
              String(g.num).includes(q),
          )
        : pool;
      return list;
    }

    const pool = topikIGrammar.map((g) =>
      applyOverride({
        ...g,
        patternKhmer: getGrammarPatternKhmer(g.id, g.korean) || undefined,
        exampleKhmer: getGrammarExampleKhmer(g.id) || undefined,
      }),
    );
    const list = q
      ? pool.filter(
          (g) =>
            g.korean.toLowerCase().includes(q) ||
            g.english.toLowerCase().includes(q) ||
            g.patternKhmer?.toLowerCase().includes(q) ||
            g.exampleKorean?.toLowerCase().includes(q) ||
            g.exampleEnglish?.toLowerCase().includes(q) ||
            g.exampleKhmer?.toLowerCase().includes(q) ||
            String(g.num).includes(q),
        )
      : pool;
    return list.map((g) => ({
      id: g.id,
      num: g.num,
      korean: g.korean,
      english: g.english,
      patternKhmer: g.patternKhmer,
      exampleKorean: g.exampleKorean,
      exampleEnglish: g.exampleEnglish,
      exampleKhmer: g.exampleKhmer,
    }));
  }, [deck, query, customGrammar, globalGrammarOverrides]);

  const switchDeck = (next: GrammarDeck) => {
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
          <StudyPageHeader
            icon={TranslateIcon}
            title="Grammar"
            accent="#2563eb"
          />
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
              { id: "eps", label: `EPS ${epsTopikGrammar.length}` },
              { id: "topik", label: `TOPIK I ${topikIGrammar.length}` },
              { id: "topik2", label: `TOPIK II ${topikIIGrammar.length}` },
              { id: "haeyo", label: `해요 ${haeyoFormGrammar.length}` },
              { id: "mine", label: `Mine ${customGrammar.length}` },
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddOpen(true)}
              sx={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                borderRadius: 999,
                minHeight: 44,
                px: 2.25,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: (t) => `0 4px 14px ${t.palette.primary.main}66`,
              }}
            >
              Add pattern
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
                  ? "No custom patterns yet. Tap Add pattern to create one."
                  : "No patterns match your search."}
              </Typography>
            ) : (
              <Grid container spacing={1.5} sx={{ p: 1.5 }}>
                {filtered.map((g) => (
                  <Grid
                    key={g.id}
                    size={{ xs: 12, sm: 6, lg: deck === "topik" ? 6 : 6 }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 1.5,
                        height: "100%",
                        borderColor: (theme) =>
                          g.isCustom
                            ? theme.palette.primary.main
                            : `${theme.palette.primary.main}40`,
                        bgcolor: (theme) => `${theme.palette.primary.main}0a`,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ alignItems: "flex-start" }}
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
                            bgcolor: (theme) =>
                              g.isCustom
                                ? theme.palette.primary.main
                                : `${theme.palette.primary.main}20`,
                            color: (theme) =>
                              g.isCustom
                                ? theme.palette.primary.contrastText
                                : theme.palette.primary.main,
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                          }}
                        >
                          {g.isCustom ? "★" : g.num}
                        </Box>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <SpeakableKorean
                            text={g.korean}
                            sx={{
                              fontFamily: KOREAN_FONT,
                              fontWeight: 700,
                              fontSize: { xs: "1.125rem", sm: "1.25rem" },
                              lineHeight: 1.35,
                            }}
                          />
                          <Typography
                            component="p"
                            sx={{
                              m: 0,
                              mt: 0.25,
                              ...lineStyles.english,
                            }}
                          >
                            {g.english}
                          </Typography>
                          {g.patternKhmer ? (
                            <Typography
                              component="p"
                              sx={{
                                m: 0,
                                mt: 0.25,
                                fontFamily: KHMER_FONT,
                                ...lineStyles.khmer,
                              }}
                            >
                              {normalizeKhmer(g.patternKhmer)}
                            </Typography>
                          ) : null}
                        </Box>
                        {g.isCustom || isAdmin ? (
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ flexShrink: 0, alignSelf: "flex-start" }}
                          >
                            {g.isCustom || isAdmin ? (
                              <IconButton
                                size="small"
                                aria-label="Edit pattern"
                                onClick={() => setEditing(g)}
                              >
                                <Pencil size={16} />
                              </IconButton>
                            ) : null}
                            {g.isCustom ? (
                              <IconButton
                                size="small"
                                aria-label="Delete pattern"
                                onClick={() => removeGrammar(g.id)}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            ) : null}
                          </Stack>
                        ) : null}
                      </Stack>
                      {g.exampleKorean ? (
                        <Box
                          sx={{
                            borderRadius: 1,
                            border: 1,
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            px: 1.25,
                            py: 1,
                          }}
                        >
                          <SpeakableKorean
                            text={g.exampleKorean}
                            sx={{
                              m: 0,
                              fontFamily: KOREAN_FONT,
                              ...lineStyles.korean,
                            }}
                          />
                          {g.exampleEnglish ? (
                            <Typography
                              component="p"
                              sx={{
                                m: 0,
                                mt: 0.5,
                                ...lineStyles.english,
                              }}
                            >
                              {g.exampleEnglish}
                            </Typography>
                          ) : null}
                          {g.exampleKhmer ? (
                            <Typography
                              component="p"
                              sx={{
                                m: 0,
                                mt: 0.5,
                                fontFamily: KHMER_FONT,
                                ...lineStyles.khmer,
                              }}
                            >
                              {normalizeKhmer(g.exampleKhmer)}
                            </Typography>
                          ) : null}
                        </Box>
                      ) : null}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </CardContent>
      </Card>

      <AddGrammarDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(item) => {
          addGrammar(item);
          setDeck("mine");
        }}
      />

      <AddGrammarDialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={(item) => {
          if (!editing) return;
          if (editing.isCustom) {
            // Custom grammar edits aren't implemented yet — keep the existing add flow.
            // Future: addGrammar handles new only; updateGrammar would handle edits.
            return;
          }
          if (isAdmin) {
            void setGlobalGrammarOverride(editing.id, {
              korean: item.korean,
              english: item.english,
              patternKhmer: item.patternKhmer,
              exampleKorean: item.exampleKorean,
              exampleEnglish: item.exampleEnglish,
              exampleKhmer: item.exampleKhmer,
            }).catch((err) => alert(err instanceof Error ? err.message : "Save failed"));
          }
        }}
        initial={
          editing
            ? {
                korean: editing.korean,
                english: editing.english,
                patternKhmer: editing.patternKhmer,
                exampleKorean: editing.exampleKorean ?? "",
                exampleEnglish: editing.exampleEnglish ?? "",
                exampleKhmer: editing.exampleKhmer ?? "",
              }
            : null
        }
      />
    </Box>
  );
}
