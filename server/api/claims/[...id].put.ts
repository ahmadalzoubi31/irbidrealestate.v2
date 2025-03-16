import { Claim, Apartment, ClaimCollection, ClaimDetail } from "@prisma/client";
import prisma from "~/lib/prisma";

// Declare interface
interface ClaimWithDetailsAndCollections extends Claim {
  claimDetails: ClaimDetail[];
  claimCollections: ClaimCollection[];
}

export default defineEventHandler(async (event) => {
  const body: ClaimWithDetailsAndCollections = await readBody(event); // Use any because `body` contains nested objects
  const id: number = Number(getRouterParams(event).id);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  try {
    // Separate `claimCollections, claimDetails` from the main body
    const { claimCollections, claimDetails, ...claimData } = body;
    // Validate claim existence
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: { claimCollections: true, claimDetails: true },
    });

    if (!claim) {
      const msg = "ERROR: No claim found with the given ID";
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    await prisma.$transaction(async (tx) => {
      // Update the claim data
      await tx.claim.update({ where: { id }, data: claimData });

      // Fetch existing related records
      const existingCollection = await tx.claimCollection.findMany({
        where: { claimId: id },
      });
      const existingDetail = await tx.claimDetail.findMany({
        where: { claimId: id },
      });

      // Extract IDs from the incoming request
      const incomingCollectionIds = claimCollections
        .filter((c: ClaimCollection) => c.id) // Only include those with IDs
        .map((c: ClaimCollection) => c.id);

      const incomingDetailIds = claimDetails
        .filter((d: ClaimDetail) => d.id) // Only include those with IDs
        .map((d: ClaimDetail) => d.id);

      // Find IDs to delete (existing IDs not in the incoming list)
      const idsCollectionToDelete = existingCollection.filter((c) => !incomingCollectionIds.includes(c.id)).map((c) => c.id);
      const idsDetailToDelete = existingDetail.filter((d) => !incomingDetailIds.includes(d.id)).map((d) => d.id);

      // Perform deletions
      const deleteCollectionOperations = idsCollectionToDelete.map((id) => tx.claimCollection.delete({ where: { id: id } }));
      // Perform deletions
      const deleteDetailOperations = idsDetailToDelete.map((id) => tx.claimDetail.delete({ where: { id: id } }));

      // Handle updates and creations
      const upsertCollectionOperations = claimCollections.map((c: ClaimCollection) =>
        c.id
          ? tx.claimCollection.update({
              where: { id: c.id },
              data: {
                dateTime: c.dateTime,
                payment: c.payment,
                notes: c.notes,
              },
            })
          : tx.claimCollection.create({
              data: {
                dateTime: c.dateTime,
                payment: c.payment,
                notes: c.notes,
                claimId: id,
              },
            })
      );

      // Handle updates and creations
      const upsertDetailOperations = claimDetails.map((d: ClaimDetail) =>
        d.id
          ? tx.claimDetail.update({
              where: { id: d.id },
              data: {
                item: d.item,
                price: d.price,
                specialPrice: d.specialPrice,
                dateTime: d.dateTime,
                image: d.image,
              },
            })
          : tx.claimDetail.create({
              data: {
                item: d.item,
                price: d.price,
                specialPrice: d.specialPrice,
                dateTime: d.dateTime,
                image: d.image,
                claimId: id,
              },
            })
      );

      // Execute deletions, updates, and creations
      await Promise.all([...deleteCollectionOperations, ...upsertCollectionOperations, ...deleteDetailOperations, ...upsertDetailOperations]);
    });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
