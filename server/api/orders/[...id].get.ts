import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: number = Number(getRouterParams(event).id);

  try {
    // Fetch the order by ID
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      const msg = `ERROR: No order found with ID ${id}`;
      console.log(msg);
      throw createError({
        statusCode: 404,
        message: msg,
      });
    }

    return order;
  } catch (error: any) {
    console.log("Error fetching order:", error);

    // Handle errors gracefully and log error details
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "An unexpected error occurred while fetching the order",
    });
  }
});
