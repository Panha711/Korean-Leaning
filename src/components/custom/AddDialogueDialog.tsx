"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Trash2 } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { DailySentenceLine, DailySentencePlace } from "@/data/daily-sentences";
import { DialogTitleWithClose } from "@/components/common/DialogTitleWithClose";
import { DAILY_PLACE_OPTIONS } from "@/lib/custom-content";
import { translateEnglishToKhmer } from "@/lib/translate-en-km";

type AddDialogueDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (dialogue: {
    title: string;
    situation: string;
    place: DailySentencePlace;
    lines: DailySentenceLine[];
  }) => void;
};

const emptyLine = (): DailySentenceLine => ({
  speaker: "",
  korean: "",
  english: "",
  khmer: "",
});

export function AddDialogueDialog({ open, onClose, onSave }: AddDialogueDialogProps) {
  const [title, setTitle] = useState("");
  const [situation, setSituation] = useState("");
  const [place, setPlace] = useState<DailySentencePlace>("friends");
  const [lines, setLines] = useState<DailySentenceLine[]>([emptyLine()]);
  const [error, setError] = useState("");
  const [translatingIndex, setTranslatingIndex] = useState<number | null>(null);

  const reset = () => {
    setTitle("");
    setSituation("");
    setPlace("friends");
    setLines([emptyLine()]);
    setError("");
    setTranslatingIndex(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const updateLine = (index: number, patch: Partial<DailySentenceLine>) => {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  };

  const handleTranslateLine = async (index: number) => {
    const english = lines[index]?.english.trim();
    if (!english) {
      setError("Enter the English line first, then translate.");
      return;
    }
    setError("");
    setTranslatingIndex(index);
    try {
      const khmer = await translateEnglishToKhmer(english);
      updateLine(index, { khmer });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not translate.");
    } finally {
      setTranslatingIndex(null);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    const validLines = lines
      .map((l) => ({
        speaker: l.speaker?.trim() || undefined,
        korean: l.korean.trim(),
        english: l.english.trim(),
        khmer: l.khmer?.trim() || undefined,
      }))
      .filter((l) => l.korean && l.english);

    if (validLines.length === 0) {
      setError("Add at least one line with Korean and English.");
      return;
    }

    onSave({
      title: title.trim(),
      situation: situation.trim() || title.trim(),
      place,
      lines: validLines,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitleWithClose onClose={handleClose}>Add your dialogue</DialogTitleWithClose>
      <DialogContent dividers className="scrollbar-styled-slim">
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            fullWidth
            placeholder="e.g. At the pharmacy"
          />
          <TextField
            label="Situation (optional)"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            fullWidth
            placeholder="Short context for the conversation"
          />
          <FormControl fullWidth>
            <InputLabel id="dialogue-place-label">Place</InputLabel>
            <Select
              labelId="dialogue-place-label"
              label="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value as DailySentencePlace)}
            >
              {DAILY_PLACE_OPTIONS.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Lines
          </Typography>

          {lines.map((line, index) => (
            <Box
              key={index}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <TextField
                    label="Speaker"
                    value={line.speaker ?? ""}
                    onChange={(e) => updateLine(index, { speaker: e.target.value })}
                    size="small"
                    sx={{ width: 88 }}
                    placeholder="A"
                  />
                  <Box sx={{ flex: 1 }} />
                  {lines.length > 1 ? (
                    <IconButton
                      size="small"
                      aria-label="Remove line"
                      onClick={() => setLines((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  ) : null}
                </Stack>
                <TextField
                  label="Korean"
                  value={line.korean}
                  onChange={(e) => updateLine(index, { korean: e.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="English"
                  value={line.english}
                  onChange={(e) => updateLine(index, { english: e.target.value })}
                  fullWidth
                  size="small"
                />
                <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
                  <TextField
                    label="Khmer"
                    value={line.khmer ?? ""}
                    onChange={(e) => updateLine(index, { khmer: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="Optional — or translate from English"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleTranslateLine(index)}
                    disabled={translatingIndex === index}
                    sx={{ mt: 0.5, flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    {translatingIndex === index ? "…" : "Translate"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={() => setLines((prev) => [...prev, emptyLine()])}
            sx={{ alignSelf: "flex-start" }}
          >
            Add line
          </Button>

          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save dialogue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
