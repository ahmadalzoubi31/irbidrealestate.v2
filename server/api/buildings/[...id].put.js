import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = (await readBody) < BuildingEditDto > event;
  const id = Number(getRouterParams(event).id);

  try {
    const building = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (building == null) {
      return "No building found";
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
  } catch (error) {
    // const errorMsg = usePrismaErrorHandling(error);
    console.log("🚀 ~ defineEventHandler ~ errorMsg:", error);
  }
});
