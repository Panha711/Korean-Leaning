"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { translateKoreanWord } from "@/lib/translate-korean";

type WordValue = { korean: string; english: string; khmer: string };

type AddWordDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (word: WordValue) => void;
  initial?: WordValue | null;
};

export function AddWordDialog({
  open,
  onClose,
  onSave,
  initial,
}: AddWordDialogProps) {
  const isEdit = Boolean(initial);
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [khmer, setKhmer] = useState("");
  const [error, setError] = useState("");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKorean(initial?.korean ?? "");
    setEnglish(initial?.english ?? "");
    setKhmer(initial?.khmer ?? "");
    setError("");
    setTranslating(false);
  }, [open, initial]);

  const reset = () => {
    setKorean("");
    setEnglish("");
    setKhmer("");
    setError("");
    setTranslating(false);
  };

  const handleTranslate = async () => {
    const trimmed = korean.trim();
    if (!trimmed || translating) return;
    setError("");
    setTranslating(true);
    try {
      const result = await translateKoreanWord(trimmed);
      setEnglish(result.english);
      setKhmer(result.khmer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!korean.trim() || !english.trim()) {
      setError("Korean and English are required.");
      return;
    }
    onSave({
      korean: korean.trim(),
      english: english.trim(),
      khmer: khmer.trim(),
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit your word" : "Add your word"}</DialogTitle>
      <DialogContent dividers className="scrollbar-styled-slim">
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Korean"
            value={korean}
            onChange={(e) => setKorean(e.target.value)}
            required
            autoFocus
            fullWidth
          />
          <Box>
            <Button
              variant="outlined"
              size="small"
              onClick={handleTranslate}
              disabled={!korean.trim() || translating}
              startIcon={
                translating ? (
                  <CircularProgress size={14} />
                ) : (
                  <AutoAwesomeIcon fontSize="small" />
                )
              }
            >
              {translating ? "Translating…" : "Translate from Korean"}
            </Button>
          </Box>
          <TextField
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            fullWidth
          />
          <Box>
            <Stack
              direction="row"
              spacing={1}
              sx={{ mb: 2, alignItems: "center" }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flex: 1 }}
              >
                Khmer (optional)
              </Typography>
            </Stack>
            <TextField
              label="Khmer"
              value={khmer}
              onChange={(e) => setKhmer(e.target.value)}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
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
          {isEdit ? "Save changes" : "Save word"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
