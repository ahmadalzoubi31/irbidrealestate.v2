import { getServerSession } from "#auth";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const loggedUserName = session?.user?.name; // Replace this with the actual logged in user name

  prisma.$use(async (params, next) => {
    const models = ["Building", "User", "Apartment", "Payment", "Ad", "Order", "Claim", "BuildingFlat"];
    if (models.includes(params.model as string)) {
      if (params.action === "create") {
        params.args.data.createdBy = loggedUserName;
      }
      if (params.action === "update") {
        params.args.data.updatedBy = loggedUserName;
      }
    }

    return next(params);
  });
});
