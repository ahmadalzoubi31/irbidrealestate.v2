import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParams(event).id);

  try {
    const building = await prisma.building.findUnique({
      where: {
        id: id,
      },
    });

    if (!building) {
      return "No building";
    }

    return building;
  } catch (error) {
    // const errorMsg = usePrismaErrorHandling(error);
    console.log("🚀 ~ defineEventHandler ~ errorMsg:", error);
  }
});
