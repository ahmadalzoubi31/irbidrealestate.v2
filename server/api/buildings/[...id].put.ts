import prisma from "~/lib/prisma";
import { Building } from "@prisma/client";
import BuildingEditDto from "~/server/classes/dto/BuildingEditDto";
import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";
import handleError from "~/server/helpers/handleError";

export default defineEventHandler(async (event) => {
  const body = await readBody<BuildingEditDto>(event);
  const id = Number(getRouterParams(event).id);

  try {
    const building: Building | null = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (building == null) {
      handleError("No building found", event);
    }

    // @ts-ignore
    delete body.name;

    const res = await prisma.building.update({
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
