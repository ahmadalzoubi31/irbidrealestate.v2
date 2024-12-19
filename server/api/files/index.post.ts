import prisma from "~/lib/prisma";
import { join } from "path";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

    const fileList: Array<ICreateFile> = [];
    const relatedType = queryList?.relatedType || '';
    const relatedId = queryList?.relatedId || '';

    // Fetch existing files from the database
    const existingFiles = await prisma.appFile.findMany({
        where: {
            relatedType: relatedType,
            relatedId: relatedId,
        },
    });

    // Create a set of incoming file names for quick lookup
    const incomingFileNames = new Set(body.map((file: any) => file.name));

    // Filter out existing files that are not in the incoming files
    const filesToUpdate = existingFiles.filter(existingFile => !incomingFileNames.has(existingFile.name));

    // Update the status of files that are not in the incoming files
    if (filesToUpdate.length > 0) {
        await prisma.appFile.updateMany({
            where: {
                id: { in: filesToUpdate.map(file => file.id) },
            },
            data: { status: false },
        });
    }

    for (const file of body) {
        const name = await storeFileLocally(
            file,
            16,
            `/${relatedType}/${relatedId}/`
        );

        const rootDir = process.cwd();
        const uploadDir = join(rootDir, "upload", "files");
        const filePath = join(uploadDir, relatedType, relatedId, name);

        const baseUrl = getRequestURL(event).origin;
        const fileUrl = `${baseUrl}${filePath.replace(rootDir, "")}`;


        const fileInfoToPush: ICreateFile = {
            name: name,
            path: filePath,
            type: file.type || "unknown",
            size: file.size.toString() || "unknown",
            url: fileUrl,
            relatedId: relatedId,
            relatedType: relatedType,
            adId: relatedType === "ads" ? Number(relatedId) : null,
            apartmentId: relatedType === "apartments" ? Number(relatedId) : null,
            paymentId: relatedType === "payments" ? Number(relatedId) : null,
        };

        // Check if the file already exists in the database
        const existingFile = existingFiles.find((f) => f.name === name);
        if (!existingFile) {
            fileList.push(fileInfoToPush);
        }
    }

    try {
        if (fileList.length > 0) {
            await prisma.appFile.createMany({ data: fileList });
        }
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode,
            message: error.message,
        });
    }

    return "success";
});