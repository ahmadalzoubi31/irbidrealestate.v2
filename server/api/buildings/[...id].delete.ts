import BuildingEditDto from "~/server/classes/dto/BuildingEditDto";
import prisma from "~/lib/prisma";
import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";

export default defineEventHandler(async (event) => {
  const body = await readBody<BuildingEditDto>(event);
  const id = Number(getRouterParams(event).id);

  if (isNaN(id)) {
    throw { message: "'id' is not a number" };
  }

  try {
    const building = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (!building) {
      setResponseStatus(event, 400);
      return {
        data: null,
        state: "Failed",
        errors: ["No building found"],
      };
    }

    // Modify data

    const res = await prisma.building.delete({
      where: {
        id: id,
      },
    });

    return res;
    // return {
    //   data: res,
    //   state: "Success",
    //   errors: [],
    // };
  } catch (error: any) {
    // const errorMsg = usePrismaErrorHandling(error);
    setResponseStatus(event, 400);
    return {
      data: null,
      state: "Failed",
      errors: [error.message],
    };
  }
});
