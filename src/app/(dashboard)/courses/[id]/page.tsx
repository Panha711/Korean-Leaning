"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getCourseById } from "@/data/courses";
import { getLessonsByCourseId } from "@/data/lessons";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const course = getCourseById(id);
  const courseLessons = getLessonsByCourseId(id);

  if (!course) notFound();

  const nextLesson = courseLessons.find((l) => !l.completed) ?? courseLessons[0];

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          borderRadius: 3,
          p: { xs: 3, sm: 4 },
          color: "common.white",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" } }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: "wrap" }}>
              <Chip label={course.subject} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
              <Chip label={course.level} size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
            </Stack>
            <Stack direction="row" spacing={1.5} sx={{ mb: 1, alignItems: "center" }}>
              <Typography component="span" sx={{ fontSize: "2.25rem" }}>
                {course.image}
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
                {course.title}
              </Typography>
            </Stack>
            <Typography sx={{ color: "rgba(255,255,255,0.85)", maxWidth: 640 }}>
              {course.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "rgba(255,255,255,0.65)" }}>
              Instructor: {course.instructor}
            </Typography>
          </Box>
          <Button
            component={Link}
            href={nextLesson ? `/lessons/${nextLesson.id}` : "#"}
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<PlayArrowIcon />}
            sx={{ flexShrink: 0 }}
          >
            Start Learning
          </Button>
        </Stack>
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" sx={{ mb: 1, justifyContent: "space-between" }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
              {course.completedLessons} of {course.totalLessons} lessons completed
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
              {course.progress}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={course.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: "rgba(255,255,255,0.25)",
              "& .MuiLinearProgress-bar": { bgcolor: "common.white" },
            }}
          />
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, fontWeight: 600 }}>
          <MenuBookIcon color="primary" />
          Lessons
        </Typography>
        {courseLessons.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 4, textAlign: "center" }}>
              <Typography color="text.secondary">
                Lessons coming soon for this course.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1}>
            {courseLessons.map((lesson) => (
              <Card
                key={lesson.id}
                component={Link}
                href={`/lessons/${lesson.id}`}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-2px)" },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    {lesson.completed ? (
                      <CheckCircleIcon color="primary" />
                    ) : (
                      <RadioButtonUncheckedIcon color="disabled" />
                    )}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                       
                        color={lesson.completed ? "text.secondary" : "text.primary"}
                       sx={{ fontWeight: 500 }}>
                        {lesson.order}. {lesson.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {lesson.duration}
                        </Typography>
                      </Stack>
                    </Box>
                    <Button
                      size="small"
                      variant={lesson.completed ? "outlined" : "contained"}
                      onClick={(e) => e.preventDefault()}
                    >
                      {lesson.completed ? "Review" : "Start"}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
