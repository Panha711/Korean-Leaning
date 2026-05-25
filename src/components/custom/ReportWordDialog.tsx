"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type ReportWord = {
  id: string;
  korean: string;
  english: string;
  khmer: string;
};

interface ReportWordDialogProps {
  open: boolean;
  word: ReportWord | null;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ReportWordDialog({
  open,
  word,
  onClose,
  onSubmitted,
}: ReportWordDialogProps) {
  const [reason, setReason] = useState("");
  const [suggestedKorean, setSuggestedKorean] = useState("");
  const [suggestedEnglish, setSuggestedEnglish] = useState("");
  const [suggestedKhmer, setSuggestedKhmer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReason("");
    setSuggestedKorean("");
    setSuggestedEnglish("");
    setSuggestedKhmer("");
    setError("");
    setSubmitting(false);
  }, [open, word?.id]);

  const handleSubmit = async () => {
    if (!word || submitting) return;
    if (!reason.trim() && !suggestedKorean.trim() && !suggestedEnglish.trim() && !suggestedKhmer.trim()) {
      setError("Tell us what's wrong, or suggest a correct translation.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/word-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wordId: word.id,
          wordKorean: word.korean,
          wordEnglish: word.english,
          wordKhmer: word.khmer,
          suggestedKorean: suggestedKorean.trim() || undefined,
          suggestedEnglish: suggestedEnglish.trim() || undefined,
          suggestedKhmer: suggestedKhmer.trim() || undefined,
          reason: reason.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Failed to submit report");
        return;
      }
      onSubmitted?.();
      onClose();
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open && word !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Report wrong translation</DialogTitle>
      <DialogContent dividers className="scrollbar-styled-slim">
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          {word ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: "action.hover",
                border: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Current entry
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: "1.125rem" }}>
                {word.korean}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {word.english}
                {word.khmer ? ` · ${word.khmer}` : ""}
              </Typography>
            </Box>
          ) : null}

          <TextField
            label="What's wrong?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            placeholder="e.g. The Khmer translation doesn't match the Korean meaning."
          />

          <Typography variant="body2" color="text.secondary">
            Optional: suggest a correction
          </Typography>
          <TextField
            label="Suggested Korean"
            value={suggestedKorean}
            onChange={(e) => setSuggestedKorean(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder={word?.korean ?? ""}
          />
          <TextField
            label="Suggested English"
            value={suggestedEnglish}
            onChange={(e) => setSuggestedEnglish(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder={word?.english ?? ""}
          />
          <TextField
            label="Suggested Khmer"
            value={suggestedKhmer}
            onChange={(e) => setSuggestedKhmer(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder={word?.khmer ?? ""}
          />
          {error ? (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting…" : "Submit report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
