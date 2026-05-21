"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import type { QuizQuestion } from "@/types";

function getScoreLabel(percentage: number): string {
  if (percentage >= 80) return "Excellent!";
  if (percentage >= 60) return "Good effort!";
  return "Keep practicing!";
}

interface QuizResultsViewProps {
  percentage: number;
  score: number;
  total: number;
  questions: QuizQuestion[];
  answers: Record<string, number>;
  showAnswerReview: boolean;
  onToggleAnswerReview: () => void;
  onBack: () => void;
  onRetry?: () => void;
}

export function QuizResultsView({
  percentage,
  score,
  total,
  questions,
  answers,
  showAnswerReview,
  onToggleAnswerReview,
  onBack,
  onRetry,
}: QuizResultsViewProps) {
  const answerReviewRef = useRef<HTMLDivElement>(null);

  const handleToggleReview = () => {
    const next = !showAnswerReview;
    onToggleAnswerReview();
    if (next) {
      requestAnimationFrame(() => {
        answerReviewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  };

  return (
    <Box sx={{ mx: "auto", maxWidth: 560, width: "100%" }}>
      <Stack spacing={3}>
        <Card
          sx={{
            textAlign: "center",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 } }}>
            <EmojiEventsIcon
              sx={{
                fontSize: 72,
                color: "warning.main",
                mb: 2,
              }}
            />
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Quiz Complete!
            </Typography>
            <Typography
              variant="h2"
              component="p"
              color="primary.main"
             
              sx={{ mb: 1, fontWeight: 800 }}
            >
              {percentage}%
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You got {score} out of {total} correct
            </Typography>

            <Stack
              spacing={2}
             
              sx={{ mx: "auto", maxWidth: 320, width: "100%", alignItems: "center" }}
            >
              <Chip
                label={getScoreLabel(percentage)}
                color={percentage >= 80 ? "primary" : "default"}
                sx={{ fontWeight: 600, px: 1 }}
              />
              <Button
                fullWidth
                size="large"
                variant={showAnswerReview ? "outlined" : "contained"}
                startIcon={
                  showAnswerReview ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
                onClick={handleToggleReview}
                sx={{ minHeight: 48 }}
              >
                {showAnswerReview ? "Hide answers" : "View answers"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Collapse in={showAnswerReview}>
          <Card ref={answerReviewRef}>
            <CardContent sx={{ p: 0 }}>
              <Typography
                variant="subtitle1"
               
                sx={{ px: 3, pt: 2.5, pb: 1.5, fontWeight: 700 }}
              >
                Answer review
              </Typography>
              <Divider />
              <Box
                className="scrollbar-styled-slim"
                sx={{
                  maxHeight: "min(60vh, 36rem)",
                  overflowY: "auto",
                  p: 2,
                }}
              >
                <Stack spacing={1.5}>
                  {questions.map((q, i) => {
                    const userAnswer = answers[q.id];
                    const isCorrect = userAnswer === q.correctIndex;
                    return (
                      <Paper
                        key={q.id}
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderLeftWidth: 4,
                          borderLeftStyle: "solid",
                          borderLeftColor: isCorrect
                            ? "success.main"
                            : "error.main",
                        }}
                      >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                          {isCorrect ? (
                            <CheckCircleIcon
                              color="success"
                              fontSize="small"
                              sx={{ mt: 0.25 }}
                            />
                          ) : (
                            <CancelIcon
                              color="error"
                              fontSize="small"
                              sx={{ mt: 0.25 }}
                            />
                          )}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            {q.passage && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                component="p"
                                sx={{
                                  mb: 1,
                                  whiteSpace: "pre-wrap",
                                  display: "block",
                                }}
                              >
                                {q.passage}
                              </Typography>
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {i + 1}. {q.question}
                            </Typography>
                            {!isCorrect && userAnswer !== undefined && (
                              <Typography
                                variant="caption"
                                color="error.main"
                                sx={{ display: "block", mt: 0.75 }}
                              >
                                Your answer: {q.options[userAnswer]}
                              </Typography>
                            )}
                            <Typography
                              variant="caption"
                              color="success.main"
                                sx={{ display: "block", mt: 0.5 }}
                            >
                              Correct: {q.options[q.correctIndex]}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                                sx={{ display: "block", mt: 0.5 }}
                            >
                              {q.explanation}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Collapse>

        <Stack spacing={1.5}>
          {onRetry ? (
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={onRetry}
              sx={{ minHeight: 48 }}
            >
              Try again (new questions)
            </Button>
          ) : null}
          <Button
            fullWidth
            size="large"
            variant={onRetry ? "outlined" : "contained"}
            onClick={onBack}
            sx={{ minHeight: 48 }}
          >
            Back to Quizzes
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
