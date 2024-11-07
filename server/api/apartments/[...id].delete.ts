import ApartmentEditDto from "~/server/classes/dto/ApartmentEditDto";
import prisma from "~/lib/prisma";
import { usePrismaErrorHandling } from "~/composable/usePrismaErrorHandling";

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

  if (isNaN(id)) {
    throw { message: "'id' is not a number" };
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: {
        id: id,
      },
    });

    if (!apartment) {
      setResponseStatus(event, 400);
      return {
        data: null,
        state: "Failed",
        errors: ["No apartment found"],
      };
    }

    // Modify data

    const res = await prisma.apartment.delete({
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
