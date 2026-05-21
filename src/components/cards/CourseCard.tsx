"use client";

import Link from "next/link";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <Box
        sx={{
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.25rem",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.light}40, ${theme.palette.secondary.light}40)`,
        }}
      >
        {course.image}
      </Box>
      <CardContent sx={{ flex: 1, p: 2 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
          <Chip label={course.subject} size="small" />
          <Chip label={course.level} size="small" variant="outlined" />
        </Stack>
        <Typography variant="subtitle1" noWrap gutterBottom sx={{ fontWeight: 600 }}>
          {course.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {course.description}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <MenuBookIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {course.completedLessons}/{course.totalLessons} lessons
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary">
              {course.duration}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={0.5}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {course.progress}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={course.progress} sx={{ height: 6, borderRadius: 3 }} />
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={`/courses/${course.id}`}
          variant="contained"
          fullWidth
          size="small"
          endIcon={<ArrowForwardIcon />}
        >
          {course.progress > 0 ? "Continue" : "Start"}
        </Button>
      </CardActions>
    </Card>
  );
}
