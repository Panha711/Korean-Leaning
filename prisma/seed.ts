import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { courses } from "../src/data/courses";
import { lessons } from "../src/data/lessons";
import { quizzes } from "../src/data/quizzes";
import { skills } from "../src/data/skills";
import { achievements } from "../src/data/achievements";
import { testimonials } from "../src/data/testimonials";
import { mockUser } from "../src/data/mockUser";
import { adminUser } from "../src/data/adminUser";
import { weeklyStats, recentQuizScores } from "../src/data/progress";
import { initialAIMessages } from "../src/data/aiMessages";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./dev.db";
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

async function main() {
  // Catalog ──────────────────────────────────────────────────────────────────
  for (const c of courses) {
    await prisma.course.upsert({
      where: { id: c.id },
      update: {
        title: c.title,
        subject: c.subject,
        level: c.level,
        description: c.description,
        totalLessons: c.totalLessons,
        duration: c.duration,
        instructor: c.instructor,
        image: c.image,
        color: c.color,
      },
      create: {
        id: c.id,
        title: c.title,
        subject: c.subject,
        level: c.level,
        description: c.description,
        totalLessons: c.totalLessons,
        duration: c.duration,
        instructor: c.instructor,
        image: c.image,
        color: c.color,
      },
    });
  }

  for (const l of lessons) {
    await prisma.lesson.upsert({
      where: { id: l.id },
      update: {
        courseId: l.courseId,
        title: l.title,
        duration: l.duration,
        order: l.order,
        content: l.content,
        keyPoints: l.keyPoints,
        examples: l.examples,
      },
      create: {
        id: l.id,
        courseId: l.courseId,
        title: l.title,
        duration: l.duration,
        order: l.order,
        content: l.content,
        keyPoints: l.keyPoints,
        examples: l.examples,
      },
    });
  }

  for (const q of quizzes) {
    await prisma.quiz.upsert({
      where: { id: q.id },
      update: { title: q.title, subject: q.subject, timeLimit: q.timeLimit },
      create: {
        id: q.id,
        title: q.title,
        subject: q.subject,
        timeLimit: q.timeLimit,
      },
    });

    for (const [idx, question] of q.questions.entries()) {
      await prisma.quizQuestion.upsert({
        where: { id: question.id },
        update: {
          quizId: q.id,
          order: idx,
          question: question.question,
          options: question.options,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
        },
        create: {
          id: question.id,
          quizId: q.id,
          order: idx,
          question: question.question,
          options: question.options,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
        },
      });
    }
  }

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: s.id },
      update: {
        name: s.name,
        description: s.description,
        difficulty: s.difficulty,
        exercises: s.exercises,
        icon: s.icon,
        color: s.color,
      },
      create: {
        id: s.id,
        name: s.name,
        description: s.description,
        difficulty: s.difficulty,
        exercises: s.exercises,
        icon: s.icon,
        color: s.color,
      },
    });
  }

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: {
        title: a.title,
        description: a.description,
        icon: a.icon,
        color: a.color,
      },
      create: {
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        color: a.color,
      },
    });
  }

  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: t.avatar,
        rating: t.rating,
      },
      create: {
        id: t.id,
        name: t.name,
        role: t.role,
        content: t.content,
        avatar: t.avatar,
        rating: t.rating,
      },
    });
  }

  // Admin account ────────────────────────────────────────────────────────────
  const adminPasswordHash = await bcrypt.hash(adminUser.password, 10);
  await prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      passwordHash: adminPasswordHash,
      name: adminUser.name,
      role: adminUser.role,
      grade: adminUser.grade,
      learningGoals: adminUser.learningGoals,
      favoriteSubjects: adminUser.favoriteSubjects,
      avatar: adminUser.avatar,
    },
    create: {
      id: adminUser.id,
      email: adminUser.email,
      passwordHash: adminPasswordHash,
      name: adminUser.name,
      role: adminUser.role,
      grade: adminUser.grade,
      learningGoals: adminUser.learningGoals,
      favoriteSubjects: adminUser.favoriteSubjects,
      streak: adminUser.streak,
      dailyGoal: adminUser.dailyGoal,
      avatar: adminUser.avatar,
    },
  });

  // Demo student ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: mockUser.email },
    update: {
      name: mockUser.name,
      role: "STUDENT",
      grade: mockUser.grade,
      learningGoals: mockUser.learningGoals,
      favoriteSubjects: mockUser.favoriteSubjects,
      streak: mockUser.streak,
      avatar: mockUser.avatar,
    },
    create: {
      id: mockUser.id,
      email: mockUser.email,
      passwordHash,
      name: mockUser.name,
      role: "STUDENT",
      grade: mockUser.grade,
      learningGoals: mockUser.learningGoals,
      favoriteSubjects: mockUser.favoriteSubjects,
      streak: mockUser.streak,
      dailyGoal: mockUser.dailyGoal,
      avatar: mockUser.avatar,
    },
  });

  // Per-user progress derived from the mock data ─────────────────────────────
  for (const c of courses) {
    await prisma.userCourseProgress.upsert({
      where: { userId_courseId: { userId: user.id, courseId: c.id } },
      update: { progress: c.progress, completedLessons: c.completedLessons },
      create: {
        userId: user.id,
        courseId: c.id,
        progress: c.progress,
        completedLessons: c.completedLessons,
      },
    });
  }

  for (const l of lessons) {
    await prisma.userLessonProgress.upsert({
      where: { userId_lessonId: { userId: user.id, lessonId: l.id } },
      update: { completed: l.completed },
      create: {
        userId: user.id,
        lessonId: l.id,
        completed: l.completed,
        completedAt: l.completed ? new Date() : null,
      },
    });
  }

  for (const s of skills) {
    await prisma.userSkillProgress.upsert({
      where: { userId_skillId: { userId: user.id, skillId: s.id } },
      update: { progress: s.progress },
      create: { userId: user.id, skillId: s.id, progress: s.progress },
    });
  }

  for (const a of achievements) {
    if (!a.earned) continue;
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: user.id, achievementId: a.id } },
      update: {},
      create: {
        userId: user.id,
        achievementId: a.id,
        earnedAt: a.earnedAt ? new Date(a.earnedAt) : new Date(),
      },
    });
  }

  for (const m of initialAIMessages) {
    await prisma.aIMessage.upsert({
      where: { id: m.id },
      update: { content: m.content, role: m.role },
      create: {
        id: m.id,
        userId: user.id,
        role: m.role,
        content: m.content,
        createdAt: new Date(m.timestamp),
      },
    });
  }

  // Study sessions for the past week
  const today = new Date();
  for (const [i, w] of weeklyStats.entries()) {
    const date = new Date(today);
    date.setDate(today.getDate() - (weeklyStats.length - 1 - i));
    date.setHours(0, 0, 0, 0);
    await prisma.studySession.deleteMany({ where: { userId: user.id, date } });
    await prisma.studySession.create({
      data: { userId: user.id, date, minutes: w.minutes, quizzes: w.quizzes },
    });
  }

  // Recent quiz attempts (synthetic — the mock data lacks per-quiz IDs)
  const quiz = quizzes[0];
  if (quiz) {
    for (const [i, r] of recentQuizScores.entries()) {
      const completedAt = new Date(today);
      completedAt.setDate(today.getDate() - i);
      await prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quiz.id,
          score: r.score,
          completedAt,
        },
      });
    }
  }

  console.log(`Seeded admin: ${adminUser.email} (password: ${adminUser.password})`);
  console.log(`Seeded student: ${user.email} (password: password123)`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
