import prisma from "~/lib/prisma";
import type { ad, interestedPeople } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event); // Use any because `body` contains nested objects
  const id: string = getRouterParams(event).id;

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const { files, interestedPeople, ...interestedPeopleData } = body;

  try {
    // Check if the interestedPeople exists
    const interestedPeople = await prisma.interestedPeople.findUnique({
      where: { id },
    });

    if (!interestedPeople) {
      const msg = "ERROR: No interested People found with the given ID";
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    // Update the interestedPeople
    const updatedInterestedPeople: interestedPeople =
      await prisma.interestedPeople.update({
        where: { id },
        data: interestedPeopleData,
      });

    return {
      success: true,
      message: "Interested People updated successfully",
      data: updatedInterestedPeople,
    };
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
