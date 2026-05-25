/**
 * Creates (or resets) the admin user.
 *
 * Run: npm run db:create-admin
 * Env overrides: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const email = (process.env.ADMIN_EMAIL ?? "admin@admin.com").trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD ?? "admin123";
const name = process.env.ADMIN_NAME ?? "Admin";

async function main() {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      grade: "",
      learningGoals: [],
      favoriteSubjects: [],
      avatar: "",
    },
    update: {
      name,
      passwordHash,
      role: "ADMIN",
    },
    select: { id: true, email: true, name: true, role: true },
  });

  console.log("Admin account ready:");
  console.log("  id:       ", user.id);
  console.log("  email:    ", user.email);
  console.log("  name:     ", user.name);
  console.log("  role:     ", user.role);
  console.log("  password: ", password);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
