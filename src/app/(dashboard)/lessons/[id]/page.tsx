"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type SvgIcon from "@mui/material/SvgIcon";
import { toast } from "sonner";
import { getCourseById } from "@/data/courses";
import { getLessonById, lessons } from "@/data/lessons";

const aiHelpers: { label: string; icon: typeof SvgIcon }[] = [
  { label: "Explain easier", icon: LightbulbIcon },
  { label: "Give examples", icon: AutoAwesomeIcon },
  { label: "Summarize lesson", icon: FormatListBulletedIcon },
  { label: "Create practice questions", icon: SmartToyIcon },
];

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lesson = getLessonById(id);
  const [completed, setCompleted] = useState(lesson?.completed ?? false);

  if (!lesson) notFound();

  const course = getCourseById(lesson.courseId);
  const courseLessons = lessons
    .filter((l) => l.courseId === lesson.courseId)
    .sort((a, b) => a.order - b.order);
  const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = courseLessons[currentIndex + 1];

  const handleAIHelper = (label: string) => {
    toast.info(`AI: ${label}`, {
      description: "Sure! Let me explain this step by step...",
    });
  };

  const handleComplete = () => {
    setCompleted(true);
    toast.success("Lesson marked as completed! 🎉");
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: 896, mx: "auto" }}>
      <Box>
        {course ? (
          <Typography
            component={Link}
            href={`/courses/${course.id}`}
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: "none", "&:hover": { color: "text.primary" } }}
          >
            ← Back to {course.title}
          </Typography>
        ) : null}
        <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 700 }}>
          {lesson.title}
        </Typography>
        <Chip label={lesson.duration} size="small" sx={{ mt: 1 }} />
      </Box>

      <Card sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            position: "relative",
            aspectRatio: "16 / 9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light}40, ${theme.palette.secondary.light}40)`,
          }}
        >
          <Button variant="contained" color="secondary" size="large" startIcon={<PlayArrowIcon />}>
            Play Video
          </Button>
        </Box>
      </Card>

      <Card>
        <CardHeader title="Lesson Content" />
        <CardContent>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
          >
            {lesson.content}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Key Points" titleTypographyProps={{ variant: "subtitle1" }} />
            <CardContent>
              <Stack component="ul" spacing={1} sx={{ m: 0, p: 0, listStyle: "none" }}>
                {lesson.keyPoints.map((point) => (
                  <Stack
                    component="li"
                    key={point}
                    direction="row"
                    spacing={1}
                   
                   sx={{ alignItems: "flex-start" }}>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 18, mt: 0.25 }} />
                    <Typography variant="body2">{point}</Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader title="Examples" titleTypographyProps={{ variant: "subtitle1" }} />
            <CardContent>
              <Stack spacing={1.5}>
                {lesson.examples.map((ex) => (
                  <Box
                    component="pre"
                    key={ex}
                    sx={{
                      m: 0,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      p: 1.5,
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                      overflowX: "auto",
                    }}
                  >
                    {ex}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          title={
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <SmartToyIcon color="primary" />
              <span>AI Learning Assistant</span>
            </Stack>
          }
          titleTypographyProps={{ variant: "subtitle1" }}
        />
        <CardContent>
          <Grid container spacing={1}>
            {aiHelpers.map(({ label, icon: Icon }) => (
              <Grid key={label} size={{ xs: 12, sm: 6 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handleAIHelper(label)}
                  startIcon={<Icon color="primary" />}
                  sx={{ justifyContent: "flex-start", py: 1.5, textTransform: "none" }}
                >
                  {label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <Button
          onClick={handleComplete}
          disabled={completed}
          variant={completed ? "outlined" : "contained"}
          startIcon={<CheckCircleIcon />}
          sx={{ flex: 1 }}
        >
          {completed ? "Completed ✓" : "Mark as Completed"}
        </Button>
        {nextLesson ? (
          <Button
            component={Link}
            href={`/lessons/${nextLesson.id}`}
            variant="contained"
            color="secondary"
            endIcon={<ChevronRightIcon />}
            sx={{ flex: 1 }}
          >
            Next Lesson
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
