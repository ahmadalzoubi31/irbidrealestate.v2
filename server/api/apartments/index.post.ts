import { Prisma, Apartment } from "@prisma/client";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const body: Apartment = await readBody(event);

  if (!body) {
    var msg = "ERROR: Argument data is missing";
    console.log(msg);
    throw createError({
      statusCode: 400,
      message: msg,
    });
  }

  const newApartment = {
    buildingName: body.buildingName,
    apartmentNumber: body.apartmentNumber,
    ownerName: body.ownerName,
    ownerNumber: body.ownerNumber,
    agentName: body.agentName,
    agentNumber: body.agentNumber,
    electricSub: body.electricSub,
    waterSub: body.waterSub,
    renterName: body.renterName,
    renterNumber: body.renterNumber,
    rentDuration: body.rentDuration,
    rentAmount: body.rentAmount,
    rentDate: body.rentDate,
    rentPaymentWay: body.rentPaymentWay,
    isFurniture: body.isFurniture,
    rentStatus: body.rentStatus,
    renterNationality: body.renterNationality,
    renterIdentification: body.renterIdentification,
    isServiceIncluded: body.isServiceIncluded,
    insurance: body.insurance,
    commissionAmount: body.commissionAmount,
    realLocation: body.realLocation,
  };

  try {
    await prisma.apartment.create({ data: newApartment });
  } catch (error: any) {
    console.log({ prisma_code: error.code });

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (error.code === "P2002") {
        var msg = "ERROR: There is a unique constraint violation, a new record cannot be created with this name";
        console.log(msg);
        throw createError({
          statusCode: 400,
          message: msg,
        });
      }
    }

    // console.log(error.message);

    throw createError({
      statusCode: error.statusCode,
      message: error.message,
    });
  }
});
