import prisma from "~/lib/prisma";
import { join } from "path";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

    const fileList: Array<IAppFile> = [];
    const relatedType = queryList?.relatedType || '';
    const relatedId = queryList?.relatedId || '';

    for (const file of body) {

        const rootDir = process.cwd();
        const uploadDir = join(rootDir, "public", "upload", "files");
        const filePath = join(uploadDir, relatedType, relatedId, name);

        const baseUrl = getRequestURL(event).origin;
        const fileUrl = `${baseUrl}${filePath.replace(rootDir, "")}`;


        const fileInfoToPush: IAppFile = {
            name: name,
            path: filePath,
            type: file.type || "unknown",
            size: file.size.toString() || "unknown",
            url: fileUrl,
            relatedId: relatedId,
            relatedType: relatedType,
            adId: relatedType === "ads" ? relatedId : null,
            apartmentId: relatedType === "apartments" ? relatedId : null,
            paymentId: relatedType === "payments" ? relatedId : null,
        };

        fileList.push(fileInfoToPush);
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