import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "7-day study streak",
    icon: "🔥",
    earned: true,
    earnedAt: "2026-05-10",
    color: "from-orange-400 to-red-500",
  },
  {
    id: "hangul-hero",
    title: "Hangul Hero",
    description: "Finished the alphabet intro lessons",
    icon: "ㄱ",
    earned: true,
    earnedAt: "2026-05-08",
    color: "from-rose-400 to-red-500",
  },
  {
    id: "korean-star",
    title: "Phrase Master",
    description: "Completed 10 phrase lessons",
    icon: "💬",
    earned: false,
    color: "from-pink-400 to-rose-500",
  },
  {
    id: "listening-ear",
    title: "Good Ear",
    description: "Scored 80%+ on a listening quiz",
    icon: "🎧",
    earned: false,
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    id: "ai-explorer",
    title: "AI Study Buddy",
    description: "50 AI tutor conversations",
    icon: "🤖",
    earned: true,
    earnedAt: "2026-05-15",
    color: "from-cyan-400 to-teal-500",
  },
];
