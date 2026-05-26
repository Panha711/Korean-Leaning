"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpIcon from "@mui/icons-material/Help";
import type { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz;
  onStart?: () => void;
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  const minutes = Math.floor(quiz.timeLimit / 60);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "0 8px 24px -8px rgba(124, 58, 237, 0.2)"
              : "0 8px 24px -8px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.75, sm: 2.5 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          "&:last-child": { pb: { xs: 1.75, sm: 2.5 } },
        }}
      >
        <Stack
          direction="row"
          sx={{
            mb: { xs: 1, sm: 1.5 },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
            <Chip label={quiz.subject} size="small" color="primary" />
            {quiz.level ? (
              <Chip label={quiz.level} size="small" variant="outlined" />
            ) : null}
          </Stack>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ color: "text.secondary", flexShrink: 0, alignItems: "center" }}
          >
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{minutes} min</Typography>
          </Stack>
        </Stack>

        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 0.5,
            fontWeight: 700,
            fontSize: { xs: "1.05rem", sm: "1.25rem" },
            lineHeight: 1.25,
          }}
        >
          {quiz.title}
        </Typography>

        {quiz.description ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {quiz.description}
          </Typography>
        ) : null}

        <Stack
          direction="row"
          spacing={0.5}
          sx={{
            color: "text.secondary",
            mt: "auto",
            mb: { xs: 1, sm: 2 },
            alignItems: "center",
          }}
        >
          <HelpIcon sx={{ fontSize: 16 }} />
          <Typography variant="body2" sx={{ fontSize: { xs: "0.8125rem", sm: "0.875rem" } }}>
            {quiz.questionCount ?? quiz.questions.length} questions
          </Typography>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onStart?.();
          }}
          sx={{
            py: { xs: 1, sm: 1.25 },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 700,
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
          }}
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
