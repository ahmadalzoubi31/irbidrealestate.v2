import prisma from "~/lib/prisma";
import { Apartment } from "@prisma/client";
import ApartmentEditDto from "~/server/classes/dto/ApartmentEditDto";
import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const body = await readBody<ApartmentEditDto>(event);
  const id = Number(getRouterParams(event).id);

  try {
    const apartment: Apartment | null = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    if (apartment == null) {
      handleError("No apartment found", event);
    }

    // @ts-ignore
    // delete body.name;

    const res = await prisma.apartment.update({
      data: body,
      where: {
        id: id,
      },
    });

    return res;
  } catch (error: any) {
    const errorMsg = usePrismaErrorHandling(error);
    handleError(errorMsg, event);
  }
});
