"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DialogTitleWithClose } from "@/components/common/DialogTitleWithClose";
import { translateEnglishToKhmer } from "@/lib/translate-en-km";

export type GrammarValue = {
  korean: string;
  english: string;
  patternKhmer?: string;
  exampleKorean: string;
  exampleEnglish: string;
  exampleKhmer: string;
};

type AddGrammarDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (item: GrammarValue) => void;
  initial?: GrammarValue | null;
};

export function AddGrammarDialog({
  open,
  onClose,
  onSave,
  initial,
}: AddGrammarDialogProps) {
  const isEdit = Boolean(initial);
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [patternKhmer, setPatternKhmer] = useState("");
  const [exampleKorean, setExampleKorean] = useState("");
  const [exampleEnglish, setExampleEnglish] = useState("");
  const [exampleKhmer, setExampleKhmer] = useState("");
  const [error, setError] = useState("");
  const [translating, setTranslating] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKorean(initial?.korean ?? "");
    setEnglish(initial?.english ?? "");
    setPatternKhmer(initial?.patternKhmer ?? "");
    setExampleKorean(initial?.exampleKorean ?? "");
    setExampleEnglish(initial?.exampleEnglish ?? "");
    setExampleKhmer(initial?.exampleKhmer ?? "");
    setError("");
  }, [open, initial]);

  const reset = () => {
    setKorean("");
    setEnglish("");
    setPatternKhmer("");
    setExampleKorean("");
    setExampleEnglish("");
    setExampleKhmer("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTranslateExample = async () => {
    if (!exampleEnglish.trim()) {
      setError("Enter the English example first, then translate.");
      return;
    }
    setError("");
    setTranslating(true);
    try {
      setExampleKhmer(await translateEnglishToKhmer(exampleEnglish));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not translate.");
    } finally {
      setTranslating(false);
    }
  };

  const handleSave = () => {
    if (!korean.trim() || !english.trim()) {
      setError("Pattern (Korean) and meaning (English) are required.");
      return;
    }
    onSave({
      korean: korean.trim(),
      english: english.trim(),
      patternKhmer: patternKhmer.trim() || undefined,
      exampleKorean: exampleKorean.trim(),
      exampleEnglish: exampleEnglish.trim(),
      exampleKhmer: exampleKhmer.trim(),
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitleWithClose onClose={handleClose}>
        {isEdit ? "Edit grammar pattern" : "Add your grammar pattern"}
      </DialogTitleWithClose>
      <DialogContent dividers className="scrollbar-styled-slim">
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          <TextField
            label="Pattern (Korean)"
            value={korean}
            onChange={(e) => setKorean(e.target.value)}
            required
            autoFocus
            fullWidth
            placeholder="e.g. -고 싶어요"
          />
          <TextField
            label="Meaning (English)"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            fullWidth
            placeholder="e.g. want to (do)"
          />
          <TextField
            label="Pattern (Khmer)"
            value={patternKhmer}
            onChange={(e) => setPatternKhmer(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Example sentence (Korean)"
            value={exampleKorean}
            onChange={(e) => setExampleKorean(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Example (English)"
            value={exampleEnglish}
            onChange={(e) => setExampleEnglish(e.target.value)}
            fullWidth
            multiline
            minRows={2}
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
                Example (Khmer)
              </Typography>
            </Stack>
            <TextField
              label="Example (Khmer)"
              value={exampleKhmer}
              onChange={(e) => setExampleKhmer(e.target.value)}
              fullWidth
              multiline
              minRows={2}
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
          {isEdit ? "Save changes" : "Save pattern"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
