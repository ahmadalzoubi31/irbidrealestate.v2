import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const id: string = getRouterParams(event).id;


  try {
    // Check if the order exists
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

    // Delete the order
    await prisma.order.delete({
      where: { id },
    });

    // Return success response
    return {
      success: true,
      message: `Order with ID ${id} successfully deleted.`,
    };

  } catch (error: any) {
    // Log error and return it
    console.error("Error deleting order:", error.message);

    throw createError({
      statusCode: error.statusCode || 500,  // Default to 500 if statusCode is not available
      message: error.message || "An unexpected error occurred while deleting the order.",
    });
  }
});
