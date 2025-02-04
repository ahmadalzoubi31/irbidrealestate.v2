import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
async function seed() {
  // Insert all data here
  const hashedPassword = await bcrypt.hash("P@ssw0rd", bcrypt.genSaltSync(10));

  await prisma.user.upsert({
    where: {
      username: "appadmin",
    },
    update: {},
    create: {
      firstName: "app",
      lastName: "admin",
      username: "appadmin",
      role: "admin",
      password: hashedPassword,
    },
  });

  await prisma.building.upsert({
    where: {
      name: "---",
    },
    update: {},
    create: {
      id: 1,
      name: "---",
      apartmentsCount: 0,
      basinName: "-",
      basinNumber: "-",
      landNumber: "-",
      status: false,
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
