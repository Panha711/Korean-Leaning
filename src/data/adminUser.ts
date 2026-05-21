/** Default admin account for local DB seed scripts (see `.env.example`). */
export const adminUser = {
  id: "admin-user",
  email: process.env.ADMIN_EMAIL ?? "admin@learnnova.com",
  password: process.env.ADMIN_PASSWORD ?? "Admin@123",
  name: "Admin",
  role: "ADMIN" as const,
  grade: "Staff",
  learningGoals: ["Manage learners and content"],
  favoriteSubjects: ["Korean"],
  streak: 0,
  dailyGoal: 60,
  avatar: "AD",
};
