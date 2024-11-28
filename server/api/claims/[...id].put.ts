import { Claim, Collection, Detail } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: any = await readBody(event); // Use any because `body` contains nested objects
  const id: number = Number(getRouterParams(event).id);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
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
    // Separate `collections, details` from the main body
    const { collections, details, ...claimData } = body;
    // Validate claim existence
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { collections: true, details: true },
    });

    if (!claim) {
      throw createError({
        statusCode: 400,
        message: "No claim found",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Update the claim data
      await tx.claim.update({ where: { id }, data: claimData });

      // Fetch existing related records
      const existingCollection = await tx.collection.findMany({
        where: { claimId: id },
        
      });
      const existingDetail = await tx.detail.findMany({
        where: { claimId: id },
      });

      // Extract IDs from the incoming request
      const incomingCollectionIds = collections
        .filter((c: Collection) => c.id) // Only include those with IDs
        .map((c: Collection) => c.id);

      const incomingDetailIds = details
        .filter((d: Detail) => d.id) // Only include those with IDs
        .map((d: Detail) => d.id);

      // Find IDs to delete (existing IDs not in the incoming list)
      const idsCollectionToDelete = existingCollection
        .filter((c) => !incomingCollectionIds.includes(c.id))
        .map((c) => c.id);
      const idsDetailToDelete = existingDetail
        .filter((d) => !incomingDetailIds.includes(d.id))
        .map((d) => d.id);

      // Perform deletions
      const deleteCollectionOperations = idsCollectionToDelete.map((id) =>
        tx.collection.delete({ where: { id: id } })
      );
      // Perform deletions
      const deleteDetailOperations = idsDetailToDelete.map((id) =>
        tx.detail.delete({ where: { id: id } })
      );

      // Handle updates and creations
      const upsertCollectionOperations = collections.map((c: Collection) =>
        c.id
          ? tx.collection.update({
              where: { id: c.id },
              data: {
                dateTime: c.dateTime,
                payment: c.payment,
                notes: c.notes,
              },
            })
          : tx.collection.create({
              data: {
                dateTime: c.dateTime,
                payment: c.payment,
                notes: c.notes,
                claimId: id,
              },
            })
      );

      // Handle updates and creations
      const upsertDetailOperations = details.map((d: Detail) =>
        d.id
          ? tx.detail.update({
              where: { id: d.id },
              data: {
                item: d.item,
                price: d.price,
              },
            })
          : tx.detail.create({
              data: {
                item: d.item,
                price: d.price,
                claimId: id,
              },
            })
      );

      // Execute deletions, updates, and creations
      await Promise.all([
        ...deleteCollectionOperations,
        ...upsertCollectionOperations,
        ...deleteDetailOperations,
        ...upsertDetailOperations,
      ]);
    });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
