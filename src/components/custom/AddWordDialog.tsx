"use client";

import { useState } from "react";
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
import { translateEnglishToKhmer } from "@/lib/translate-en-km";

type AddWordDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (word: { korean: string; english: string; khmer: string }) => void;
};

export function AddWordDialog({ open, onClose, onSave }: AddWordDialogProps) {
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [khmer, setKhmer] = useState("");
  const [error, setError] = useState("");
  const [translating, setTranslating] = useState(false);

  const reset = () => {
    setKorean("");
    setEnglish("");
    setKhmer("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTranslateKhmer = async () => {
    if (!english.trim()) {
      setError("Enter English first, then translate.");
      return;
    }
    setError("");
    setTranslating(true);
    try {
      setKhmer(await translateEnglishToKhmer(english));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not translate.");
    } finally {
      setTranslating(false);
    }
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
      <DialogTitle>Add your word</DialogTitle>
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
          Save word
        </Button>
      </DialogActions>
    </Dialog>
  );
}
