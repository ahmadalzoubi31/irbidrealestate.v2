import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
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
  } catch (error) {
    // const errorMsg = usePrismaErrorHandling(error);
    console.log("🚀 ~ defineEventHandler ~ errorMsg:", error);
  }
});
