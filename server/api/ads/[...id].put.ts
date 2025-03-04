import prisma from "~/lib/prisma";
import type { Ad, InterestedPeople } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event); // Use any because `body` contains nested objects
  const id: number = Number(getRouterParams(event).id);

  if (!body) {
    const msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const { interestedPeople, ...adData } = body;

  try {
    // Check if the ad exists
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { interestedPeople: true },
    });

    if (!ad) {
      const msg = "ERROR: No ad found with the given ID";
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    await prisma.$transaction(async (tx) => {
      // Update the ad data
      await tx.ad.update({ where: { id }, data: adData });

      // Fetch existing related people records
      const existingPeople = await tx.interestedPeople.findMany({
        where: { adId: id },
      });

      // Extract IDs from the incoming request
      const incomingIds: string[] = interestedPeople
        .filter((person: InterestedPeople) => person.id) // Only include those with IDs
        .map((person: InterestedPeople) => person.id);

      // Find IDs to delete (existing IDs not in the incoming list)
      // const idsToDelete = existingPeople.filter((person) => !incomingIds.includes(person.id.toString())).map((person) => person.id);

      // Perform deletions
      // const deleteOperations = idsToDelete.map((idToDelete) => tx.interestedPeople.delete({ where: { id: idToDelete } }));

      // Handle updates and creations
      const upsertOperations = interestedPeople.map((person: InterestedPeople) =>
        person.id
          ? tx.interestedPeople.update({
              where: { id: person.id },
              data: { name: person.name, number: person.number },
            })
          : tx.interestedPeople.create({
              data: { name: person.name, number: person.number, adId: id },
            })
      );

      // Execute deletions, updates, and creations
      await Promise.all([...upsertOperations]);

      // Return success response
      return {
        success: true,
        message: "Ad updated successfully",
      };
    });
  } catch (error: any) {
    console.log("🚀 ~ defineEventHandler ~ error:", error);
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
