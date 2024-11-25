import { Ad, InterestedPeople } from "@prisma/client";
import prisma from "~/lib/prisma";

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

  if (isNaN(id)) {
    throw createError({
      statusCode: 500,
      message: "Invalid id",
    });
  }

  try {
    // Separate `interestedPeople` from the main body
    const { interestedPeople, ...adData } = body;
    // Validate ad existence
    const ad = await prisma.ad.findUnique({
      where: { id },
      include: { interestedPeople: true },
    });

    if (!ad) {
      throw createError({
        statusCode: 400,
        message: "No ad found",
      });
    }

    // *** Update and Create
    // await prisma.$transaction([
    //   prisma.ad.update({ where: { id }, data: { ...adData, interestedPeople: { deleteMany: {} } } }),
    //   prisma.interestedPeople.createMany({ data: interestedPeople }),
    //   ...interestedPeople.map((person: InterestedPeople) =>
    //     prisma.interestedPeople.create({
    //       data: { name: person.name, number: person.number, adId: id },
    //     })
    //   ),
    // ]);

    await prisma.$transaction(async (tx) => {
      // Update the ad data
      await tx.ad.update({ where: { id }, data: adData });

      // Fetch existing related records
      const existingPeople = await tx.interestedPeople.findMany({
        where: { adId: id },
      });

      // Extract IDs from the incoming request
      const incomingIds = interestedPeople
        .filter((person: InterestedPeople) => person.id) // Only include those with IDs
        .map((person: InterestedPeople) => person.id);

      // Find IDs to delete (existing IDs not in the incoming list)
      const idsToDelete = existingPeople.filter((person) => !incomingIds.includes(person.id)).map((person) => person.id);

      // Perform deletions
      const deleteOperations = idsToDelete.map((idToDelete) => tx.interestedPeople.delete({ where: { id: idToDelete } }));

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
      await Promise.all([...deleteOperations, ...upsertOperations]);
    });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
