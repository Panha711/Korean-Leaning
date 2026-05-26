"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SpeakKoreanIconButton } from "@/components/common/SpeakableKorean";
import type { QuizQuestion } from "@/types";

function getScoreInfo(percentage: number) {
  if (percentage >= 80) {
    return { label: "Excellent!", emoji: "🎉", tone: "success" as const };
  }
  if (percentage >= 60) {
    return { label: "Good effort!", emoji: "👍", tone: "primary" as const };
  }
  if (percentage >= 40) {
    return { label: "Keep practicing", emoji: "💪", tone: "warning" as const };
  }
  return { label: "Don't give up", emoji: "📚", tone: "error" as const };
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

const RING_SIZE = 200;
const RING_STROKE = 14;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

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
  const theme = useTheme();
  const answerReviewRef = useRef<HTMLDivElement>(null);
  const info = getScoreInfo(percentage);
  const incorrect = total - score;
  const toneColor =
    info.tone === "success"
      ? theme.palette.success.main
      : info.tone === "warning"
        ? theme.palette.warning.main
        : info.tone === "error"
          ? theme.palette.error.main
          : theme.palette.primary.main;
  const dashOffset = RING_CIRC * (1 - percentage / 100);

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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card
            elevation={0}
            sx={{
              textAlign: "center",
              overflow: "visible",
              borderRadius: 4,
              border: 1,
              borderColor: alpha(toneColor, 0.2),
              background: `radial-gradient(circle at top, ${alpha(toneColor, 0.12)} 0%, transparent 60%), ${theme.palette.background.paper}`,
              boxShadow: `0 20px 60px -20px ${alpha(toneColor, 0.35)}`,
            }}
          >
            <CardContent sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 } }}>
              <Box
                sx={{
                  position: "relative",
                  width: RING_SIZE,
                  height: RING_SIZE,
                  mx: "auto",
                  mb: 3,
                }}
              >
                <svg
                  width={RING_SIZE}
                  height={RING_SIZE}
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke={alpha(toneColor, 0.15)}
                    strokeWidth={RING_STROKE}
                  />
                  <motion.circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke={toneColor}
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRC}
                    initial={{ strokeDashoffset: RING_CIRC }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{ fontSize: "2.25rem", lineHeight: 1 }}
                  >
                    {info.emoji}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "2.5rem", sm: "3rem" },
                      fontWeight: 800,
                      lineHeight: 1,
                      color: toneColor,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {percentage}%
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                {info.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {score} of {total} answered correctly
              </Typography>

              <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: "center", mb: 3 }}
              >
                <StatPill
                  icon={<CheckCircleIcon fontSize="small" />}
                  label={`${score} correct`}
                  color={theme.palette.success.main}
                />
                <StatPill
                  icon={<CancelIcon fontSize="small" />}
                  label={`${incorrect} incorrect`}
                  color={theme.palette.error.main}
                />
              </Stack>

              <Button
                fullWidth
                size="large"
                variant={showAnswerReview ? "outlined" : "contained"}
                startIcon={
                  showAnswerReview ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
                onClick={handleToggleReview}
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  minHeight: 52,
                  boxShadow: showAnswerReview
                    ? "none"
                    : `0 10px 24px -10px ${alpha(theme.palette.primary.main, 0.5)}`,
                }}
              >
                {showAnswerReview ? "Hide answers" : "View answers"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <Collapse in={showAnswerReview}>
          <Card ref={answerReviewRef} elevation={0} sx={{ borderRadius: 4, border: 1, borderColor: "divider" }}>
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
                          borderRadius: 3,
                          borderLeftWidth: 4,
                          borderLeftStyle: "solid",
                          borderLeftColor: isCorrect ? "success.main" : "error.main",
                          bgcolor: isCorrect
                            ? alpha(theme.palette.success.main, 0.04)
                            : alpha(theme.palette.error.main, 0.04),
                        }}
                      >
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
                          {isCorrect ? (
                            <CheckCircleIcon color="success" fontSize="small" sx={{ mt: 0.25 }} />
                          ) : (
                            <CancelIcon color="error" fontSize="small" sx={{ mt: 0.25 }} />
                          )}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            {q.passage && (
                              <Stack
                                direction="row"
                                spacing={0.5}
                                sx={{ alignItems: "flex-start", mb: 1 }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  component="p"
                                  sx={{ whiteSpace: "pre-wrap", display: "block", flex: 1, m: 0 }}
                                >
                                  {q.passage}
                                </Typography>
                                <SpeakKoreanIconButton text={q.passage} />
                              </Stack>
                            )}
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "flex-start" }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, flex: 1 }}>
                                {i + 1}. {q.question}
                              </Typography>
                              <SpeakKoreanIconButton text={q.question} />
                            </Stack>
                            {!isCorrect && userAnswer !== undefined && (
                              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.75 }}>
                                <Typography
                                  variant="caption"
                                  color="error.main"
                                  sx={{ flex: 1 }}
                                >
                                  Your answer: {q.options[userAnswer]}
                                </Typography>
                                <SpeakKoreanIconButton text={q.options[userAnswer]} />
                              </Stack>
                            )}
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                color="success.main"
                                sx={{ flex: 1 }}
                              >
                                Correct: {q.options[q.correctIndex]}
                              </Typography>
                              <SpeakKoreanIconButton text={q.options[q.correctIndex]} />
                            </Stack>
                            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", mt: 0.5 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ flex: 1 }}
                              >
                                {q.explanation}
                              </Typography>
                              <SpeakKoreanIconButton text={q.explanation} />
                            </Stack>
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

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 700,
              minHeight: 52,
            }}
          >
            Back to quizzes
          </Button>
          {onRetry ? (
            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<RestartAltIcon />}
              onClick={onRetry}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 700,
                minHeight: 52,
                boxShadow: `0 10px 24px -10px ${alpha(theme.palette.primary.main, 0.5)}`,
              }}
            >
              Try again
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}

function StatPill({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <Stack
      direction="row"
      spacing={0.75}
      sx={{
        alignItems: "center",
        px: 1.5,
        py: 0.75,
        borderRadius: 999,
        bgcolor: alpha(color, 0.1),
        color,
        fontWeight: 700,
      }}
    >
      {icon}
      <Typography variant="body2" sx={{ fontWeight: 700, color }}>
        {label}
      </Typography>
    </Stack>
  );
}
