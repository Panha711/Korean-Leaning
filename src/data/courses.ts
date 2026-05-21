import type { Course } from "@/types";

export const courses: Course[] = [
  {
    id: "korean-basics",
    title: "Hangul & First Steps",
    subject: "Korean",
    level: "Beginner",
    description:
      "Learn the Korean alphabet, pronunciation, and essential greetings from zero.",
    progress: 45,
    totalLessons: 20,
    completedLessons: 9,
    duration: "4 weeks",
    instructor: "Self-paced",
    image: "🇰🇷",
    color: "from-rose-500 to-red-600",
  },
  {
    id: "korean-phrases",
    title: "Everyday Phrases",
    subject: "Korean",
    level: "Beginner",
    description:
      "Ordering food, asking directions, shopping, and polite expressions for daily life.",
    progress: 20,
    totalLessons: 16,
    completedLessons: 3,
    duration: "3 weeks",
    instructor: "Self-paced",
    image: "💬",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: "korean-grammar",
    title: "Basic Grammar",
    subject: "Korean",
    level: "Intermediate",
    description:
      "Particles, verb endings, honorifics, and sentence patterns for clear communication.",
    progress: 10,
    totalLessons: 22,
    completedLessons: 2,
    duration: "6 weeks",
    instructor: "Self-paced",
    image: "📖",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "korean-listening",
    title: "Listening Practice",
    subject: "Korean",
    level: "Intermediate",
    description:
      "Train your ear with slow dialogues, podcasts snippets, and comprehension drills.",
    progress: 0,
    totalLessons: 18,
    completedLessons: 0,
    duration: "5 weeks",
    instructor: "Self-paced",
    image: "🎧",
    color: "from-fuchsia-500 to-pink-600",
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}
