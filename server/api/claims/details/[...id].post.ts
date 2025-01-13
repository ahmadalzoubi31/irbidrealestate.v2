import { Prisma } from "@prisma/client";
import { useUpload } from "~/composables/useUpload";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const { uploadFile } = useUpload();
  const body: any = await readBody(event);
  const id: string = getRouterParams(event).id;

  try {
    // Validate the Claim by ID
    const claim = await prisma.claim.findUnique({
      where: { id },
    });

    if (!claim) {
      const msg = `ERROR: No claim found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    await prisma.$transaction(async (tx) => {
      // Create an array of promises to create the claim details
      const createOperations = body.map((detail: { item: any; price: any; billImage: any }) => {
        // upload the bill image and return the file id

        if (detail.billImage) {
          uploadFile(detail.billImage, "claims", id, "billImage");

          const res = await $fetch(`/api/upload?relatedType=${relatedType}&relatedId=${relatedId}&purpose=${purpose}`, {
            method: "POST",
            body: files,
          });
        }
        const newClaimDetails = {
          item: detail.item,
          price: detail.price,
          claimId: id,
          appFileId: detail.billImage ? detail.billImage.id : null,
        };

        // Relate the claim with the related records
        if (detail.billImage) {
          // Upload().uploadFile(detail.billImage, "claims", id, "billImage");
          const data = {
            ...newClaimDetails,
          };
          return tx.claimDetail.create({
            data: data,
          });
        }

        return tx.claimDetail.create({
          data: newClaimDetails,
        });
      });
      // Execute deletions, updates, and creations
      await Promise.all([...createOperations]);

      // Return success response
      return {
        success: true,
        message: "Claim details created successfully",
      };
    });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle unique constraint violation error (e.g., name already exists)
      if (error.code === "P2002") {
        console.log("ERROR: There is a unique constraint violation, a new record cannot be created with this name");
        throw createError({
          statusCode: 400,
          message: "ERROR: There is a unique constraint violation, a new record cannot be created with this name",
        });
      }
    }

    // Handle other errors
    console.log(error.message || "An unexpected error occurred while creating the claim details.");
    throw createError({
      statusCode: 500,
      message: error.message || "An unexpected error occurred while creating the claim details.",
    });
  }
});
