import { ClaimDetail, Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: ClaimDetail = await readBody(event);
  console.log("🚀 ~ defineEventHandler ~ body:", body);

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

    // create the details for the claim by ID
    const newClaimDetails = {
      item: body.item,
      price: body.price,
      claimId: id,
    };

    // Relate the claim with the related records
    const data = {
      ...newClaimDetails,
      // @ts-ignore
      files: { create: body.files },
    };

    const claimDetails: ClaimDetail = await prisma.claimDetail.create({
      data: data,
    });

    // Upload the bill image with the new claim detail's ID as the related ID
    // if (body..length > 0) {
    //   const res: boolean = await uploadFile(billImage, "claims", newClaimDetails.data.id.toString(), "bill");
    //   if (!res) {
    //     // Optionally, you can delete the created claim if file upload fails
    //     await $fetch("/api/claims/" + newClaimDetails.data.id, { method: "DELETE" });
    //     throw new Error("تم إنشاء المطالبة ولكن فشل رفع الملفات. تم حذف المطالبة.");
    //   }
    // }

    // Return success response
    return {
      success: true,
      message: "Claim created successfully",
      data: claimDetails,
    };
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
    console.log(error.message || "An unexpected error occurred while creating the claim.");
    throw createError({
      statusCode: 500,
      message: error.message || "An unexpected error occurred while creating the claim.",
    });
  }
});
