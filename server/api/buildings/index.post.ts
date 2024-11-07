import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";
import prisma from "~/lib/prisma";
import BuildingCreateDto from "~/server/classes/dto/BuildingCreateDto";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const body = await readBody<BuildingCreateDto>(event);

  try {
    const res = await prisma.building.create({ data: body });
    return res;
  } catch (error: any) {
    const errorMsg = usePrismaErrorHandling(error);
    console.log("🚀 ~ defineEventHandler ~ errorMsg:", errorMsg);
    return handleError(errorMsg, event);
  }
});
