import prisma from "~/lib/prisma";
import fs from "fs";
import { join } from "path";

export default defineEventHandler(async (event) => {
    const body: { files: number[] } = await readBody(event);

    if (!body || !body.files || body.files.length === 0) {
        throw createError({
            statusCode: 400,
            message: "No files specified for deletion",
        });
    }

    try {
        // Fetch the file records from the database
        const files = await prisma.appFile.findMany({
            where: { id: { in: body.files } },
        });

        // Delete the file records from the database
        await prisma.appFile.deleteMany({
            where: { id: { in: body.files } },
        });

        // Delete the actual files from the upload folder
        files.forEach((file) => {

            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });

        return {
            success: true,
            message: "Files deleted successfully",
        };
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            message: error.message || "An error occurred while deleting files",
        });
    }
});