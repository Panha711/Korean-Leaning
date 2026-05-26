"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DialogTitleWithClose } from "@/components/common/DialogTitleWithClose";
import type { ExerciseCategory } from "@/data/practice-exercises";

export interface NewQuestionPayload {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  passage?: string;
  category?: ExerciseCategory;
}

interface AddQuestionDialogProps {
  open: boolean;
  onClose: () => void;
  contextLabel: string;
  mode: "quiz" | "practice";
  onSave: (payload: NewQuestionPayload) => void;
}

const practiceCategories: { value: ExerciseCategory; label: string }[] = [
  { value: "vocabulary", label: "Vocabulary" },
  { value: "grammar", label: "Grammar" },
  { value: "reading", label: "Reading" },
  { value: "listening", label: "Listening" },
  { value: "hangul", label: "Hangul" },
];

const emptyForm = {
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctIndex: "0",
  explanation: "",
  passage: "",
  category: "vocabulary" as ExerciseCategory,
};

const dialogPaperSx = {
  borderRadius: 3,
  maxHeight: "min(92vh, 900px)",
};

const titleSx = {
  fontSize: { xs: "1.35rem", sm: "1.5rem" },
  fontWeight: 700,
  lineHeight: 1.3,
  pr: 2,
};

const contentSx = {
  px: { xs: 2.5, sm: 4 },
  py: { xs: 2.5, sm: 3 },
};

const fieldProps = {
  fullWidth: true,
  size: "medium" as const,
  slotProps: {
    input: { sx: { fontSize: "1rem" } },
    inputLabel: { sx: { fontSize: "1rem" } },
  },
};

const actionsSx = {
  px: { xs: 2.5, sm: 4 },
  py: 2.5,
  gap: 1.5,
  flexWrap: "wrap" as const,
};

export function AddQuestionDialog({
  open,
  onClose,
  contextLabel,
  mode,
  onSave,
}: AddQuestionDialogProps) {
  const [step, setStep] = useState<"confirm" | "form">("confirm");
  const [form, setForm] = useState(emptyForm);

  const handleClose = () => {
    setStep("confirm");
    setForm(emptyForm);
    onClose();
  };

  const handleSave = () => {
    const options = [form.optionA, form.optionB, form.optionC, form.optionD].map(
      (o) => o.trim(),
    );
    if (!form.question.trim() || options.some((o) => !o) || !form.explanation.trim()) {
      return;
    }
    onSave({
      question: form.question.trim(),
      options,
      correctIndex: Number(form.correctIndex),
      explanation: form.explanation.trim(),
      passage: form.passage.trim() || undefined,
      category: mode === "practice" ? form.category : undefined,
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      slotProps={{
        paper: { sx: dialogPaperSx },
      }}
    >
      {step === "confirm" ? (
        <>
          <DialogTitleWithClose onClose={handleClose} sx={titleSx}>
            All questions completed
          </DialogTitleWithClose>
          <DialogContent sx={contentSx}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              You finished every question in{" "}
              <Box component="strong" sx={{ color: "text.primary", fontWeight: 600 }}>
                {contextLabel}
              </Box>
              . Would you like to add your own question for next time?
            </Typography>
          </DialogContent>
          <DialogActions sx={actionsSx}>
            <Button variant="outlined" size="large" onClick={handleClose} sx={{ px: 3 }}>
              No, thanks
            </Button>
            <Button variant="contained" size="large" onClick={() => setStep("form")} sx={{ px: 3 }}>
              Yes, add question
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitleWithClose onClose={handleClose} sx={titleSx}>
            Add a question — {contextLabel}
          </DialogTitleWithClose>
          <DialogContent dividers sx={contentSx}>
            <Stack spacing={3}>
              <TextField
                {...fieldProps}
                label="Question"
                multiline
                minRows={3}
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
              />

              {mode === "practice" && (
                <TextField
                  {...fieldProps}
                  select
                  label="Category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as ExerciseCategory,
                    })
                  }
                >
                  {practiceCategories.map((c) => (
                    <MenuItem key={c.value} value={c.value}>
                      {c.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                {...fieldProps}
                label="Passage / dialogue (optional)"
                multiline
                minRows={3}
                value={form.passage}
                onChange={(e) => setForm({ ...form, passage: e.target.value })}
                placeholder="For reading or listening-style items"
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 3,
                }}
              >
                <TextField
                  {...fieldProps}
                  label="Option A"
                  value={form.optionA}
                  onChange={(e) => setForm({ ...form, optionA: e.target.value })}
                />
                <TextField
                  {...fieldProps}
                  label="Option B"
                  value={form.optionB}
                  onChange={(e) => setForm({ ...form, optionB: e.target.value })}
                />
                <TextField
                  {...fieldProps}
                  label="Option C"
                  value={form.optionC}
                  onChange={(e) => setForm({ ...form, optionC: e.target.value })}
                />
                <TextField
                  {...fieldProps}
                  label="Option D"
                  value={form.optionD}
                  onChange={(e) => setForm({ ...form, optionD: e.target.value })}
                />
              </Box>

              <TextField
                {...fieldProps}
                select
                label="Correct answer"
                value={form.correctIndex}
                onChange={(e) =>
                  setForm({ ...form, correctIndex: e.target.value })
                }
              >
                <MenuItem value="0">A</MenuItem>
                <MenuItem value="1">B</MenuItem>
                <MenuItem value="2">C</MenuItem>
                <MenuItem value="3">D</MenuItem>
              </TextField>

              <TextField
                {...fieldProps}
                label="Explanation"
                multiline
                minRows={3}
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={actionsSx}>
            <Button variant="outlined" size="large" onClick={() => setStep("confirm")} sx={{ px: 3 }}>
              Back
            </Button>
            <Button variant="contained" size="large" onClick={handleSave} sx={{ px: 3 }}>
              Save question
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
