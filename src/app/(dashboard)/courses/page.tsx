"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
import { CourseCard } from "@/components/cards/CourseCard";
import { EmptyState } from "@/components/common/EmptyState";
import { courses } from "@/data/courses";
import type { Difficulty } from "@/types";

const levels: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState<string>("all");

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchLevel = level === "all" || c.level === level;
      return matchSearch && matchLevel;
    });
  }, [search, level]);

  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Korean courses for Hangul, phrases, grammar, and listening — study at your own pace.
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          fullWidth
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl sx={{ minWidth: { sm: 176 }, width: { xs: 1, sm: "auto" } }}>
          <InputLabel id="course-level-label">Level</InputLabel>
          <Select
            labelId="course-level-label"
            label="Level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <MenuItem value="all">All levels</MenuItem>
            {levels.map((l) => (
              <MenuItem key={l} value={l}>
                {l}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {filtered.length === 0 ? (
        <EmptyState
          icon={MenuBookIcon}
          title="No courses found"
          description="Try a different search or level filter."
        />
      ) : (
        <Grid container spacing={3}>
          {filtered.map((course) => (
            <Grid key={course.id} size={{ xs: 12, sm: 6, lg: 4 }}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
