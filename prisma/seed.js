import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
async function seed() {
  // Insert all data here
  const hashedPassword = await bcrypt.hash("P@ssw0rd", bcrypt.genSaltSync(10));

  await prisma.user.create({
    data: {
      firstName: "app",
      lastName: "admin",
      username: "appadmin",
      role: "admin",
      password: hashedPassword,
    },
  });
}

try {
  await seed();
  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
