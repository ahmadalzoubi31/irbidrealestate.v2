import prisma from "~/lib/prisma";
import type { user } from "@prisma/client";

export default defineEventHandler(async () => {
  try {
    // Simulate delay (e.g., fetching huge data)
    // await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate delay

    // Fetch all users
    const users: user[] = await prisma.user.findMany();
    return users;
  } catch (error: any) {
    // Handle errors gracefully
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred",
    });
  }
});
