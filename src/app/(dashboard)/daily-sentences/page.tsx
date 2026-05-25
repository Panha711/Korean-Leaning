"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import { Pencil, Trash2 } from "lucide-react";
import type SvgIcon from "@mui/material/SvgIcon";
import AppsIcon from "@mui/icons-material/Apps";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import CloudIcon from "@mui/icons-material/Cloud";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import FlightIcon from "@mui/icons-material/Flight";
import GroupsIcon from "@mui/icons-material/Groups";
import HandshakeIcon from "@mui/icons-material/Handshake";
import HomeIcon from "@mui/icons-material/Home";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MapIcon from "@mui/icons-material/Map";
import MovieIcon from "@mui/icons-material/Movie";
import PlaceIcon from "@mui/icons-material/Place";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import StoreMallDirectoryIcon from "@mui/icons-material/StoreMallDirectory";
import ChatIcon from "@mui/icons-material/Chat";
import { AddDialogueDialog } from "@/components/custom/AddDialogueDialog";
import {
  EditDialogueLineDialog,
  type DialogueLineEdit,
} from "@/components/custom/EditDialogueLineDialog";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  dialogueLineKey,
  useGlobalDialogueLineOverrides,
} from "@/hooks/use-global-dialogue-line-overrides";
import { getEasyReadLineStyles } from "@/lib/dialogue-readability-styles";
import {
  dailySentenceGroups,
  DAILY_SENTENCE_PLACE_LABELS,
  DAILY_SENTENCE_PLACE_ORDER,
  filterDailySentencesByPlace,
  getDailySentencePlace,
  type DailySentencePlace,
} from "@/data/daily-sentences";
import { useCustomDialogues } from "@/hooks/use-custom-content";
import {
  isCustomContentId,
  mergeDialogueGroups,
  searchDialogueGroups,
} from "@/lib/custom-content";
import { getDailySentenceLineKhmer } from "@/lib/daily-sentence-khmer";
import { normalizeKhmer } from "@/lib/khmer-text";

const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";

const PLACE_ICONS: Partial<Record<DailySentencePlace, typeof SvgIcon>> = {
  cafe: LocalCafeIcon,
  restaurant: RestaurantIcon,
  supermarket: ShoppingCartIcon,
  shop: StoreIcon,
  transport: DirectionsBusIcon,
  directions: MapIcon,
  hospital: LocalHospitalIcon,
  mall: StoreMallDirectoryIcon,
  clothes: CheckroomIcon,
  work: BusinessCenterIcon,
  home: HomeIcon,
  introduction: HandshakeIcon,
  friends: GroupsIcon,
  weather: CloudIcon,
  travel: FlightIcon,
  entertainment: MovieIcon,
};

type FilterId = DailySentencePlace | "all";

function FilterButton({
  id,
  label,
  count,
  active,
  onClick,
  compact,
}: {
  id: FilterId;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const Icon =
    id === "all"
      ? AppsIcon
      : (PLACE_ICONS[id as DailySentencePlace] ?? PlaceIcon);

  return (
    <ListItemButton
      onClick={onClick}
      selected={active}
      sx={{
        borderRadius: 2,
        mb: compact ? 0 : 0.5,
        flexShrink: compact ? 0 : undefined,
        width: compact ? "auto" : 1,
        px: compact ? 2 : 1.5,
        py: compact ? 1 : 1.25,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: 1.5,
          bgcolor: active ? "primary.contrastText" : "action.hover",
          color: active ? "primary.main" : "text.secondary",
          mr: 1.5,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0, flex: compact ? "0 1 auto" : 1 }}>
        <Typography variant="body2" noWrap={compact} sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {!compact ? (
          <Typography
            variant="caption"
            color={active ? "primary.contrastText" : "text.secondary"}
          >
            {count} dialogues
          </Typography>
        ) : null}
      </Box>
      {compact ? (
        <Typography
          variant="caption"
          sx={{
            ml: 1,
            color: active ? "primary.contrastText" : "text.secondary",
            fontWeight: 600,
          }}
        >
          {count}
        </Typography>
      ) : null}
    </ListItemButton>
  );
}

export default function DailySentencesPage() {
  const theme = useTheme();
  const lineStyles = getEasyReadLineStyles(theme);

  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<FilterId>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<DialogueLineEdit | null>(null);
  const {
    dialogues: customDialogues,
    addDialogue,
    removeDialogue,
  } = useCustomDialogues();
  const { isAdmin } = useCurrentUser();
  const {
    overrides: lineOverrides,
    setOverride: setLineOverride,
  } = useGlobalDialogueLineOverrides();

  const allGroups = useMemo(
    () => mergeDialogueGroups(dailySentenceGroups, customDialogues),
    [customDialogues],
  );

  const filtered = useMemo(() => {
    let list = searchDialogueGroups(query, allGroups, getDailySentenceLineKhmer);
    list = filterDailySentencesByPlace(list, place);
    return list;
  }, [query, place, allGroups]);

  const activeLabel =
    place === "all" ? "All places" : DAILY_SENTENCE_PLACE_LABELS[place];

  const placesInUse = useMemo(() => {
    const used = new Set<DailySentencePlace>();
    for (const g of allGroups) {
      used.add(getDailySentencePlace(g));
    }
    return DAILY_SENTENCE_PLACE_ORDER.filter((p) => used.has(p));
  }, [allGroups]);

  const filters: { id: FilterId; label: string; count: number }[] = useMemo(
    () => [
      {
        id: "all",
        label: "All places",
        count: filterDailySentencesByPlace(allGroups, "all").length,
      },
      ...placesInUse.map((p) => ({
        id: p as FilterId,
        label: DAILY_SENTENCE_PLACE_LABELS[p],
        count: filterDailySentencesByPlace(allGroups, p).length,
      })),
    ],
    [allGroups, placesInUse],
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "28rem",
        height: { xs: "auto", lg: "calc(100dvh - 11rem)" },
        maxHeight: { lg: "calc(100dvh - 11rem)" },
        overflow: { lg: "hidden" },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        sx={{
          mb: 2,
          flexShrink: 0,
          justifyContent: "space-between",
          alignItems: { sm: "flex-end" },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 700,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              <ChatIcon />
            </Box>
            Daily Sentences
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Chip label={`${allGroups.length} dialogues`} color="default" />
          {customDialogues.length > 0 ? (
            <Chip
              label={`${customDialogues.length} yours`}
              size="small"
              color="primary"
              variant="outlined"
            />
          ) : null}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setAddOpen(true)}
          >
            Add dialogue
          </Button>
        </Stack>
      </Stack>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          height: { lg: "100%" },
          overflow: { lg: "hidden" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "minmax(260px, 1fr) minmax(0, 3fr)" },
          gridTemplateRows: { lg: "1fr" },
          gap: 2,
          alignItems: "stretch",
        }}
      >
        <Card
          sx={{
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
            minHeight: 0,
            overflow: "hidden",
            gridRow: { lg: "1" },
            gridColumn: { lg: "1" },
          }}
        >
          <CardContent
            sx={{
              p: 1.5,
              flex: 1,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              "&:last-child": { pb: 1.5 },
            }}
          >
            <TextField
              size="small"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                px: 0.5,
                textTransform: "uppercase",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              Where are you?
            </Typography>
            <List
              dense
              disablePadding
              className="scrollbar-styled-slim"
              sx={{ flex: 1, minHeight: 0, overflowY: "auto", pr: 0.5 }}
            >
              {filters.map((f) => (
                <FilterButton
                  key={f.id}
                  id={f.id}
                  label={f.label}
                  count={f.count}
                  active={place === f.id}
                  onClick={() => setPlace(f.id)}
                />
              ))}
            </List>
          </CardContent>
        </Card>

        <Box sx={{ display: { lg: "none" }, minWidth: 0 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 1.5 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            className="scrollbar-styled"
            sx={{
              overflowX: "auto",
              pb: 0.5,
              mx: -0.5,
              px: 0.5,
            }}
          >
            {filters.map((f) => (
              <FilterButton
                key={f.id}
                id={f.id}
                label={f.label}
                count={f.count}
                active={place === f.id}
                onClick={() => setPlace(f.id)}
                compact
              />
            ))}
          </Stack>
        </Box>

        <Stack
          spacing={1.5}
          sx={{
            minWidth: 0,
            minHeight: 0,
            height: { lg: "100%" },
            maxHeight: { lg: "100%" },
            overflow: { lg: "hidden" },
            display: "flex",
            flexDirection: "column",
            gridColumn: { xs: "1", lg: "2" },
            gridRow: { lg: "1" },
          }}
        >
          <Paper variant="outlined" sx={{ px: 2, py: 1.5, flexShrink: 0 }}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography variant="body2">
                <Typography component="span" sx={{ fontWeight: 600 }}>
                  {activeLabel}
                </Typography>
                <Typography component="span" color="text.secondary">
                  {" "}
                  · {filtered.length} shown
                </Typography>
              </Typography>
              {query || place !== "all" ? (
                <Typography
                  component="button"
                  type="button"
                  variant="caption"
                  color="primary"
                  onClick={() => {
                    setQuery("");
                    setPlace("all");
                  }}
                  sx={{
                    border: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    fontWeight: 600,
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Reset
                </Typography>
              ) : null}
            </Stack>
          </Paper>

          <Paper
            variant="outlined"
            className="scrollbar-styled"
            sx={{
              flex: 1,
              minHeight: { xs: 280, lg: 0 },
              maxHeight: { xs: "65dvh", lg: "100%" },
              overflowY: "auto",
              bgcolor: "action.hover",
            }}
          >
            {filtered.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 192,
                  p: 4,
                  textAlign: "center",
                }}
              >
                <Typography color="text.secondary">
                  No dialogues match. Try another place or reset filters.
                </Typography>
              </Box>
            ) : (
              <List disablePadding sx={{ p: 1 }}>
                {filtered.map((g) => {
                  const groupPlace = getDailySentencePlace(g);
                  const isOpen = expandedId === g.id;
                  const isCustom = isCustomContentId(g.id);

                  return (
                    <Card
                      key={g.id}
                      sx={{
                        mb: 1.5,
                        overflow: "hidden",
                        ...(isOpen && {
                          outline: 2,
                          outlineColor: "primary.light",
                        }),
                      }}
                    >
                      <ListItemButton
                        onClick={() => setExpandedId(isOpen ? null : g.id)}
                        sx={{ alignItems: "flex-start", py: 1.25, px: 1.5 }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            fontWeight: 700,
                            fontSize: "0.8125rem",
                            flexShrink: 0,
                            mr: 1.25,
                          }}
                        >
                          {g.num}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, lineHeight: 1.35 }}
                          >
                            {g.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            noWrap
                            sx={{ mt: 0.25 }}
                          >
                            {g.situation}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            sx={{ mt: 0.5, flexWrap: "wrap" }}
                          >
                            {isCustom ? (
                              <Chip
                                label="My dialogue"
                                size="small"
                                color="primary"
                                sx={{ height: 22, fontSize: "0.7rem" }}
                              />
                            ) : null}
                            <Chip
                              label={DAILY_SENTENCE_PLACE_LABELS[groupPlace]}
                              size="small"
                              sx={{ height: 22, fontSize: "0.7rem" }}
                            />
                            <Chip
                              label={`${g.lines.length} lines`}
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: "0.7rem" }}
                            />
                          </Stack>
                        </Box>
                        {isCustom ? (
                          <IconButton
                            size="small"
                            aria-label="Delete dialogue"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeDialogue(g.id);
                              if (expandedId === g.id) setExpandedId(null);
                            }}
                            sx={{ flexShrink: 0, mt: 0.25 }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        ) : null}
                        <Typography
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            transform: isOpen ? "rotate(180deg)" : "none",
                            transition: "transform 0.2s",
                          }}
                          aria-hidden
                        >
                          ▾
                        </Typography>
                      </ListItemButton>

                      <Collapse in={isOpen}>
                        <CardContent
                          sx={{
                            borderTop: 1,
                            borderColor: "divider",
                            bgcolor: "action.hover",
                            px: 1.5,
                            py: 1.25,
                            "&:last-child": { pb: 1.25 },
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1, display: "block", fontSize: "0.7rem" }}
                          >
                            Read top to bottom — practice each line in order.
                          </Typography>
                          <Stack
                            component="ol"
                            spacing={0.75}
                            sx={{ m: 0, p: 0, listStyle: "none" }}
                          >
                            {g.lines.map((line, i) => {
                              const isB = line.speaker === "B";
                              const override =
                                lineOverrides[dialogueLineKey(g.id, i)];
                              const korean = override?.korean ?? line.korean;
                              const english = override?.english ?? line.english;
                              const khmer =
                                override?.khmer ??
                                (line.khmer?.trim() ||
                                  getDailySentenceLineKhmer(g.id, i));

                              return (
                                <Box
                                  component="li"
                                  key={i}
                                  sx={{
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: isB
                                      ? "primary.main"
                                      : "divider",
                                    borderLeftWidth: isB ? 3 : 1,
                                    bgcolor: isB
                                      ? (theme) =>
                                          `${theme.palette.primary.main}14`
                                      : "background.paper",
                                    px: 1.25,
                                    py: 0.875,
                                    position: "relative",
                                  }}
                                >
                                  <Typography
                                    component="p"
                                    sx={{
                                      m: 0,
                                      ...lineStyles.korean,
                                    }}
                                  >
                                    {korean}
                                  </Typography>
                                  <Typography
                                    component="p"
                                    sx={{
                                      m: 0,
                                      mt: 0.5,
                                      ...lineStyles.english,
                                    }}
                                  >
                                    {english}
                                  </Typography>
                                  {khmer ? (
                                    <Typography
                                      component="p"
                                      sx={{
                                        m: 0,
                                        mt: 0.5,
                                        fontFamily: KHMER_FONT,
                                        ...lineStyles.khmer,
                                      }}
                                    >
                                      {normalizeKhmer(khmer)}
                                    </Typography>
                                  ) : null}
                                  {isAdmin && !isCustom ? (
                                    <IconButton
                                      size="small"
                                      aria-label="Edit line"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLine({
                                          dialogueId: g.id,
                                          lineIndex: i,
                                          korean,
                                          english,
                                          khmer: khmer ?? "",
                                        });
                                      }}
                                      sx={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                      }}
                                    >
                                      <Pencil size={14} />
                                    </IconButton>
                                  ) : null}
                                </Box>
                              );
                            })}
                          </Stack>
                        </CardContent>
                      </Collapse>
                    </Card>
                  );
                })}
              </List>
            )}
          </Paper>
        </Stack>
      </Box>

      <AddDialogueDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(dialogue) => {
          const entry = addDialogue(dialogue);
          setExpandedId(entry.id);
        }}
      />

      <EditDialogueLineDialog
        open={editingLine !== null}
        line={editingLine}
        onClose={() => setEditingLine(null)}
        onSave={async (next) => {
          if (!editingLine) return;
          await setLineOverride(editingLine.dialogueId, editingLine.lineIndex, next);
        }}
      />
    </Box>
  );
}
