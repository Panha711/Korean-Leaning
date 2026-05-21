"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { Skill } from "@/types";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)" },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ mb: 2, justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 2,
              fontSize: "1.5rem",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.light}50, ${theme.palette.secondary.light}50)`,
            }}
          >
            {skill.icon}
          </Box>
          <Chip label={skill.difficulty} size="small" variant="outlined" />
        </Stack>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
          {skill.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {skill.description}
        </Typography>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {skill.progress}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={skill.progress} sx={{ height: 6, borderRadius: 3 }} />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.5 }}>
          {skill.exercises} exercises available
        </Typography>
        <Button component={Link} href="/practice" variant="outlined" size="small" fullWidth>
          Practice
        </Button>
      </CardContent>
    </Card>
  );
}
