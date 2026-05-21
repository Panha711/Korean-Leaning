export type Subject = "Korean";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Course {
  id: string;
  title: string;
  subject: Subject;
  level: Difficulty;
  description: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  instructor: string;
  image: string;
  color: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  completed: boolean;
  order: number;
  content: string;
  keyPoints: string[];
  examples: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  passage?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  timeLimit: number;
  questions: QuizQuestion[];
  /** Shown on quiz card when questions are built at start (not stored in questions). */
  questionCount?: number;
  level?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  progress: number;
  difficulty: Difficulty;
  exercises: number;
  icon: string;
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  learningGoals: string[];
  favoriteSubjects: Subject[];
  completedLessons: number;
  streak: number;
  dailyGoal: number;
  dailyProgress: number;
  avatar: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SubjectProgress {
  subject: Subject;
  progress: number;
  color: string;
}

export interface WeeklyStat {
  day: string;
  minutes: number;
  quizzes: number;
}
