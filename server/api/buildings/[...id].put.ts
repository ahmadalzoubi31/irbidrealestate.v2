import type { Building } from "@prisma/client";
import { Prisma } from "@prisma/client";
import prisma from "~/lib/prisma";

// Utility function to validate incoming data
const validateBuildingData = (data: Building) => {
    // TODO: Add any additional field validation as needed
    if (!data.basinName) {
        throw new Error("Missing required field: basinName");
    }
};

export default defineEventHandler(async (event) => {
    const body: Building = await readBody(event);
    const id: string = getRouterParams(event).id;

    if (!body) {
        const msg = "ERROR: Argument data is missing";
        console.log(msg);
        throw createError({
            statusCode: 400,
            message: msg,
        });
    }

    try {
        // Validate the incoming data
        validateBuildingData(body);
        // Check if the building exists
        const building = await prisma.building.findUnique({
            where: { id },
        });


        if (!building) {
            const msg = "ERROR: No building found with the given ID";
            console.log(msg);
            throw createError({
                statusCode: 404,
                message: msg,
            });
        }

        // Calucalte the number of related apartments
        const registeredApartmentsCount = await prisma.apartment.count({
            where: {
                buildingId: body.id,
            },
        })
        // Perform the update
        const updatedBuilding = await prisma.building.update({
            where: { id },
            data: { ...body, registeredApartmentsCount },
        });

        // Return success response
        return {
            success: true,
            message: "Building updated successfully",
            data: updatedBuilding,
        };

    } catch (error: any) {
        console.log({ prisma_code: error.code });

        // Handle Prisma specific errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const msg = "ERROR: There is a unique constraint violation";
                console.log(msg);
                throw createError({
                    statusCode: 400,
                    message: msg,
                });
            }
        }

        // Handle other errors
        const msg = error.message || "An unexpected error occurred during the update.";
        console.log(msg);
        throw createError({
            statusCode: 500,
            message: msg,
        });
    }
});
