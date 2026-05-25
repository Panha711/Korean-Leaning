"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type DialogueLineEdit = {
  dialogueId: string;
  lineIndex: number;
  korean: string;
  english: string;
  khmer: string;
};

interface EditDialogueLineDialogProps {
  open: boolean;
  line: DialogueLineEdit | null;
  onClose: () => void;
  onSave: (next: { korean: string; english: string; khmer: string }) => Promise<void> | void;
}

export function EditDialogueLineDialog({
  open,
  line,
  onClose,
  onSave,
}: EditDialogueLineDialogProps) {
  const [korean, setKorean] = useState("");
  const [english, setEnglish] = useState("");
  const [khmer, setKhmer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setKorean(line?.korean ?? "");
    setEnglish(line?.english ?? "");
    setKhmer(line?.khmer ?? "");
    setError("");
    setSubmitting(false);
  }, [open, line?.dialogueId, line?.lineIndex]);

  const handleSave = async () => {
    if (submitting) return;
    if (!korean.trim() || !english.trim()) {
      setError("Korean and English are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSave({ korean: korean.trim(), english: english.trim(), khmer: khmer.trim() });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open && line !== null} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit dialogue line</DialogTitle>
      <DialogContent dividers className="scrollbar-styled-slim">
        <Stack spacing={2} sx={{ mt: 0.5 }}>
          {line ? (
            <Typography variant="caption" color="text.secondary">
              Dialogue {line.dialogueId} · line {line.lineIndex + 1}
            </Typography>
          ) : null}
          <TextField
            label="Korean"
            value={korean}
            onChange={(e) => setKorean(e.target.value)}
            required
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="English"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            required
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Khmer"
            value={khmer}
            onChange={(e) => setKhmer(e.target.value)}
            fullWidth
            multiline
            minRows={2}
            slotProps={{ inputLabel: { shrink: true } }}
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
        <Button variant="contained" onClick={handleSave} disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
