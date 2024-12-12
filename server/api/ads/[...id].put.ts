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
    const msg = "ERROR: Invalid ID";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const { files, interestedPeople, ...adData } = body;

  // try {
  // Check if the building exists
  const ad = await prisma.ad.findUnique({
    where: { id },
    include: { interestedPeople: true, files: true },
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


    // Fetch existing related records
    const existingFiles = await tx.adFile.findMany({ where: { adId: id } });

    debugger;

    const uniqueNameForFiles: Array<IEditAdFile> = [];
    for (const file of files) {
      if (existingFiles.includes(file) && file.status === true) {
        // If the file already exists, skip it
        continue;
      } else if (existingFiles.includes(file) && file.status === false) {
        uniqueNameForFiles.push({ name: file.name, adId: id, status: false });
      } else {
        const name = await storeFileLocally(
          file, // the file object
          16, // you can add a name for the file or length of Unique ID that will be automatically generated!
          `/ads/${id}/` // the folder the file will be stored in
        );

        uniqueNameForFiles.push({ name: name, adId: id, status: true });
      }

    }







    const uploadOperations = await tx.adFile.createMany({ data: uniqueNameForFiles });
    // Execute deletions, updates, and creations
    await Promise.all([...deleteOperations, ...upsertOperations, uploadOperations]);

  });
  // } catch (error: any) {
  //   console.log("🚀 ~ defineEventHandler ~ error:", error)
  //   console.log({ prisma_code: error.code });

  //   throw createError({
  //     statusCode: error.statusCode,
  //     message: error.message,
  //   });
  // }
});
