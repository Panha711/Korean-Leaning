import type { User } from "@/types";

/** Personal learner profile — no account required */
export const mockUser: User = {
  id: "local-learner",
  name: "Learner",
  email: "",
  grade: "Self-study",
  learningGoals: [
    "Learn Hangul and read simple words",
    "Memorize 50 everyday phrases",
    "Practice listening 15 minutes daily",
    "Hold a short self-introduction in Korean",
  ],
  favoriteSubjects: ["Korean"],
  completedLessons: 12,
  streak: 7,
  dailyGoal: 30,
  dailyProgress: 18,
  avatar: "KR",
};
