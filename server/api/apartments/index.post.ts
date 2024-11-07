import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";
import prisma from "~/lib/prisma";
import ApartmentCreateDto from "~/server/classes/dto/ApartmentCreateDto";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const body = await readBody<ApartmentCreateDto>(event);

  try {
    const res = await prisma.apartment.create({ data: body });
    return res;
  } catch (error: any) {
    const errorMsg = usePrismaErrorHandling(error);
    return handleError(errorMsg, event);
  }
});
