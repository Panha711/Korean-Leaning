"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CancelIcon from "@mui/icons-material/Cancel";
import { toast } from "sonner";
import { SkillCard } from "@/components/cards/SkillCard";
import {
  AddQuestionDialog,
  type NewQuestionPayload,
} from "@/components/common/AddQuestionDialog";
import {
  getExercisesForSkill,
  getCategoryLabel,
  type PracticeExercise,
} from "@/data/practice-exercises";
import { skills } from "@/data/skills";
import {
  addCustomPracticeExercise,
  getCustomPracticeExercises,
} from "@/lib/custom-questions";

export default function PracticePage() {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const skill = skills.find((s) => s.id === activeSkill);
  const exercise = exercises[exerciseIndex];
  const categoryLabel = exercise ? getCategoryLabel(exercise.category) : null;

  useEffect(() => {
    if (!activeSkill) {
      setExercises([]);
      return;
    }
    setExercises([
      ...getExercisesForSkill(activeSkill),
      ...getCustomPracticeExercises(activeSkill),
    ]);
    setExerciseIndex(0);
    setSelected(null);
    setShowFeedback(false);
  }, [activeSkill]);

  const handleSaveQuestion = (payload: NewQuestionPayload) => {
    if (!activeSkill) return;
    const saved = addCustomPracticeExercise(activeSkill, {
      question: payload.question,
      options: payload.options,
      correctIndex: payload.correctIndex,
      explanation: payload.explanation,
      passage: payload.passage,
      category: payload.category,
    });
    setExercises((prev) => {
      const next = [...prev, saved];
      setExerciseIndex(next.length - 1);
      return next;
    });
    setAddDialogOpen(false);
    setSelected(null);
    setShowFeedback(false);
    toast.success("Question saved! It is added to this skill.");
  };

  const handleAnswer = (index: number) => {
    if (showFeedback || !exercise) return;
    setSelected(index);
    setShowFeedback(true);
    if (index === exercise.correctIndex) {
      toast.success("Correct!");
    } else {
      toast.error("Not quite — check the explanation.");
    }
  };

  const handleNext = () => {
    if (!exercises.length || !showFeedback) return;
    const isLast = exerciseIndex === exercises.length - 1;
    if (isLast) {
      setAddDialogOpen(true);
      return;
    }
    setExerciseIndex((i) => i + 1);
    setSelected(null);
    setShowFeedback(false);
  };

  const handleDialogClose = () => {
    setAddDialogOpen(false);
    setExerciseIndex(0);
    setSelected(null);
    setShowFeedback(false);
    toast.message("Session complete — restart or pick another skill.");
  };

  const handleReset = () => {
    setExerciseIndex(0);
    setSelected(null);
    setShowFeedback(false);
  };

  const selectSkill = (skillId: string) => {
    setActiveSkill(skillId);
    setExerciseIndex(0);
    setSelected(null);
    setShowFeedback(false);
  };

  return (
    <>
      <AddQuestionDialog
        open={addDialogOpen}
        onClose={handleDialogClose}
        contextLabel={skill?.name ?? "Practice"}
        mode="practice"
        onSave={handleSaveQuestion}
      />
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Skills Practice
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a skill — includes{" "}
            <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
              TOPIK I
            </Typography>{" "}
            exam-style drills (vocabulary, grammar, reading, listening).
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {skills.map((s) => (
            <Grid key={s.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box
                onClick={() => selectSkill(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectSkill(s.id);
                  }
                }}
                role="button"
                tabIndex={0}
                sx={{
                  cursor: "pointer",
                  borderRadius: 2,
                  outline: activeSkill === s.id ? 2 : 0,
                  outlineColor: "primary.main",
                  outlineOffset: 2,
                }}
              >
                <SkillCard skill={s} />
              </Box>
            </Grid>
          ))}
        </Grid>

        <AnimatePresence>
          {activeSkill && exercise ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <Card sx={{ borderColor: "primary.light" }}>
                <CardHeader
                  title={
                    activeSkill === "topik-1" ? "TOPIK I Question" : "Practice Exercise"
                  }
                  action={
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      {skill ? <Chip label={skill.name} size="small" /> : null}
                      {categoryLabel ? (
                        <Chip label={categoryLabel} size="small" variant="outlined" />
                      ) : null}
                      <Typography variant="caption" color="text.secondary">
                        {exerciseIndex + 1} / {exercises.length}
                      </Typography>
                    </Stack>
                  }
                  sx={{ flexWrap: "wrap", gap: 1 }}
                />
                <CardContent>
                  <Stack spacing={2}>
                    {exercise.passage ? (
                      <Box
                        component="pre"
                        sx={{
                          whiteSpace: "pre-wrap",
                          borderRadius: 2,
                          border: 1,
                          borderColor: "divider",
                          bgcolor: "action.hover",
                          p: 2,
                          fontFamily: "inherit",
                          fontSize: "0.875rem",
                          lineHeight: 1.6,
                          m: 0,
                        }}
                      >
                        {exercise.passage}
                      </Box>
                    ) : null}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {exercise.question}
                    </Typography>
                    <Grid container spacing={1}>
                      {exercise.options.map((option, index) => {
                        const isCorrect = index === exercise.correctIndex;
                        const isSelected = selected === index;
                        const feedbackSx =
                          showFeedback && isCorrect
                            ? { borderColor: "success.main", bgcolor: "success.light" }
                            : showFeedback && isSelected && !isCorrect
                              ? { borderColor: "error.main", bgcolor: "error.light" }
                              : {};
                        return (
                          <Grid key={option} size={{ xs: 12, sm: 6 }}>
                            <Button
                              fullWidth
                              variant="outlined"
                              disabled={showFeedback}
                              onClick={() => handleAnswer(index)}
                              sx={{
                                justifyContent: "flex-start",
                                textAlign: "left",
                                textTransform: "none",
                                py: 1.5,
                                ...feedbackSx,
                                "&:hover": showFeedback
                                  ? undefined
                                  : { bgcolor: "action.hover" },
                              }}
                            >
                              <Typography component="span" sx={{ mr: 1, fontWeight: 600 }}>
                                {String.fromCharCode(65 + index)}.
                              </Typography>
                              {option}
                              {showFeedback && isCorrect ? (
                                <CheckCircleIcon
                                  sx={{ ml: 1, fontSize: 18, color: "success.main" }}
                                />
                              ) : null}
                              {showFeedback && isSelected && !isCorrect ? (
                                <CancelIcon
                                  sx={{ ml: 1, fontSize: 18, color: "error.main" }}
                                />
                              ) : null}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                    {showFeedback ? (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ borderRadius: 2, bgcolor: "action.hover", p: 2 }}
                      >
                        {exercise.explanation}
                      </Typography>
                    ) : null}
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained" onClick={handleNext} disabled={!showFeedback}>
                        Next question
                      </Button>
                      <Button variant="outlined" onClick={handleReset} startIcon={<RestartAltIcon />}>
                        Restart
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
          {activeSkill && exercises.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No practice questions for this skill yet.
            </Typography>
          ) : null}
        </AnimatePresence>
      </Stack>
    </>
  );
}
