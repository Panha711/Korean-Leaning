import type { SubjectProgress, WeeklyStat } from "@/types";
import { SUBJECT_COLORS } from "@/lib/subjects";

export const subjectProgress: SubjectProgress[] = [
  { subject: "Korean", progress: 38, color: SUBJECT_COLORS.Korean },
];

export const weeklyStats: WeeklyStat[] = [
  { day: "Mon", minutes: 25, quizzes: 1 },
  { day: "Tue", minutes: 30, quizzes: 0 },
  { day: "Wed", minutes: 20, quizzes: 1 },
  { day: "Thu", minutes: 35, quizzes: 1 },
  { day: "Fri", minutes: 15, quizzes: 0 },
  { day: "Sat", minutes: 45, quizzes: 2 },
  { day: "Sun", minutes: 18, quizzes: 1 },
];

export const recentQuizScores = [
  { title: "Hangul Basics", score: 85, date: "May 17" },
  { title: "TOPIK I Mock Quiz", score: 73, date: "May 15" },
  { title: "Daily Vocabulary", score: 90, date: "May 12" },
];

export const weakSkills = [
  { name: "Grammar", progress: 15 },
  { name: "Listening", progress: 22 },
  { name: "Speaking", progress: 30 },
];
