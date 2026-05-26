"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import { QuizCard } from "@/components/cards/QuizCard";
import { QuizResultsView } from "@/components/quiz/QuizResultsView";
import { SpeakKoreanIconButton } from "@/components/common/SpeakableKorean";
import { quizzes } from "@/data/quizzes";
import { getCustomQuizQuestions } from "@/lib/custom-questions";
import { buildGrammarQuizQuestions } from "@/lib/grammar-quiz";
import { buildTopikIQuizQuestions } from "@/lib/topik-i-quiz";
import { buildTopikIIQuizQuestions } from "@/lib/topik-ii-quiz";
import { buildRandomVocabQuizQuestions } from "@/lib/vocab-quiz";
import type { Quiz, QuizQuestion } from "@/types";

const DAILY_VOCAB_QUIZ_ID = "quiz-vocab-1";
const GRAMMAR_QUIZ_ID = "quiz-grammar-1";
const TOPIK_I_QUIZ_ID = "quiz-topik-1-mock";
const TOPIK_II_QUIZ_ID = "quiz-topik-2-mock";
const DAILY_VOCAB_QUESTION_COUNT = 10;
const GRAMMAR_QUESTION_COUNT = 10;
const TOPIK_I_QUESTION_COUNT = 15;
const TOPIK_II_QUESTION_COUNT = 15;

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAnswerReview, setShowAnswerReview] = useState(false);

  const exitQuiz = () => {
    setActiveQuiz(null);
    setQuizQuestions([]);
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setShowResult(false);
    setSubmitted(false);
    setShowAnswerReview(false);
  };

  const startQuiz = (quiz: Quiz) => {
    const custom = getCustomQuizQuestions(quiz.id);
    const baseQuestions =
      quiz.id === DAILY_VOCAB_QUIZ_ID
        ? buildRandomVocabQuizQuestions(DAILY_VOCAB_QUESTION_COUNT)
        : quiz.id === GRAMMAR_QUIZ_ID
          ? buildGrammarQuizQuestions(GRAMMAR_QUESTION_COUNT)
          : quiz.id === TOPIK_I_QUIZ_ID
            ? buildTopikIQuizQuestions(TOPIK_I_QUESTION_COUNT)
            : quiz.id === TOPIK_II_QUIZ_ID
              ? buildTopikIIQuizQuestions(TOPIK_II_QUESTION_COUNT)
              : quiz.questions;
    setQuizQuestions([...baseQuestions, ...custom]);
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers({});
    setSelected(null);
    setShowResult(false);
    setSubmitted(false);
    setShowAnswerReview(false);
  };

  if (!activeQuiz) {
    return (
      <Stack spacing={{ xs: 1.5, sm: 3 }}>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Quizzes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Five quizzes including{" "}
            <Typography component="span" color="text.primary" sx={{ fontWeight: 600 }}>
              TOPIK I & II
            </Typography>{" "}
            mocks — 10–15 questions each with answer review.
          </Typography>
        </Box>
        <Grid container spacing={{ xs: 1.25, sm: 3 }}>
          {quizzes.map((quiz) => (
            <Grid key={quiz.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <QuizCard quiz={quiz} onStart={() => startQuiz(quiz)} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  const question = quizQuestions[currentQ];
  const progress =
    quizQuestions.length > 0
      ? ((currentQ + 1) / quizQuestions.length) * 100
      : 0;
  const isLast = currentQ === quizQuestions.length - 1;

  const handleNext = () => {
    if (selected === null || !question) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);

    if (isLast) {
      setSubmitted(true);
      setShowResult(true);
    } else {
      setCurrentQ((q) => q + 1);
    }
  };

  const score = submitted
    ? quizQuestions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;
  const percentage =
    quizQuestions.length > 0
      ? Math.round((score / quizQuestions.length) * 100)
      : 0;

  if (showResult && submitted) {
    return (
      <QuizResultsView
        percentage={percentage}
        score={score}
        total={quizQuestions.length}
        questions={quizQuestions}
        answers={answers}
        showAnswerReview={showAnswerReview}
        onToggleAnswerReview={() => setShowAnswerReview((v) => !v)}
        onBack={exitQuiz}
        onRetry={() => startQuiz(activeQuiz)}
      />
    );
  }

  if (!question) {
    return (
      <Typography variant="body2" color="text.secondary">
        This quiz has no questions yet.
      </Typography>
    );
  }

  return (
    <Box sx={{ mx: "auto", maxWidth: 896, width: "100%", px: { xs: 1, sm: 2 } }}>
      <Stack spacing={4}>
        <Box>
          <Stack
            direction="row"
            sx={{
              mb: 1,
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Button variant="text" onClick={exitQuiz} sx={{ minWidth: 0, px: 1 }}>
              ← Back
            </Button>
          </Stack>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            {activeQuiz.title}
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography variant="body1" color="text.secondary">
                Question {currentQ + 1} of {quizQuestions.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Stack>
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Stack spacing={3}>
                  {question.passage ? (
                    <Box
                      sx={{
                        borderRadius: 2,
                        border: 1,
                        borderColor: "divider",
                        bgcolor: "action.hover",
                        p: { xs: 2.5, sm: 3 },
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 1,
                          }}
                        >
                          Read this
                        </Typography>
                        <SpeakKoreanIconButton text={question.passage} />
                      </Stack>
                      <Typography
                        variant="h6"
                        component="p"
                        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                      >
                        {question.passage}
                      </Typography>
                    </Box>
                  ) : null}
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "flex-start" }}
                  >
                    <Typography
                      variant="h6"
                      component="p"
                      sx={{ fontWeight: 700, lineHeight: 1.4, flex: 1 }}
                    >
                      {question.question}
                    </Typography>
                    <SpeakKoreanIconButton text={question.question} />
                  </Stack>
                  <Stack spacing={1.5}>
                    {question.options.map((opt, i) => (
                      <Stack
                        key={`${question.id}-${opt}`}
                        direction="row"
                        spacing={0.5}
                        sx={{ alignItems: "stretch" }}
                      >
                        <Button
                          variant={selected === i ? "contained" : "outlined"}
                          onClick={() => setSelected(i)}
                          sx={{
                            flex: 1,
                            justifyContent: "flex-start",
                            textAlign: "left",
                            py: { xs: 1.5, sm: 2 },
                            px: { xs: 2, sm: 2.5 },
                            textTransform: "none",
                            borderColor: selected === i ? "primary.main" : "divider",
                          }}
                        >
                          <Typography
                            component="span"
                            color={selected === i ? "inherit" : "primary"}
                            sx={{ fontWeight: 700, mr: 1.5 }}
                          >
                            {String.fromCharCode(65 + i)}.
                          </Typography>
                          <Typography component="span" variant="body1" sx={{ lineHeight: 1.5 }}>
                            {opt}
                          </Typography>
                        </Button>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <SpeakKoreanIconButton text={opt} />
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{ justifyContent: "flex-end", alignItems: "center" }}
        >
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            startIcon={<CloseIcon />}
            onClick={exitQuiz}
            sx={{ minWidth: 100, py: 1.25 }}
          >
            Exit
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={handleNext}
            disabled={selected === null}
            sx={{ minWidth: 160, py: 1.25 }}
          >
            {isLast ? "Submit Quiz" : "Next Question"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
