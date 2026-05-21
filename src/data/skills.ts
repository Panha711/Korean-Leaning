import type { Skill } from "@/types";

export const skills: Skill[] = [

  {
    id: "korean-vocab",
    name: "Vocabulary",
    description: "Everyday words and phrases by theme",
    progress: 40,
    difficulty: "Beginner",
    exercises: 10,
    icon: "📚",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "korean-grammar",
    name: "Grammar",
    description: "Particles, verb endings",
    progress: 15,
    difficulty: "Intermediate",
    exercises: 10,
    icon: "✏️",
    color: "from-indigo-500 to-violet-600",
  },
  {
    id: "topik-1",
    name: "TOPIK I Prep",
    description: "Beginner exam-style vocab, grammar, reading & listening drills",
    progress: 5,
    difficulty: "Beginner",
    exercises: 20,
    icon: "📝",
    color: "from-amber-500 to-orange-600",
  },
];

export function getSkillById(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}
