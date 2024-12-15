import {ServerFile} from "nuxt-file-storage";
import prisma from "~/lib/prisma"
import {join} from "path";


export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    // const id: number = Number(getRouterParams(event).id);
    const queryList = getQuery<{ relatedType: string, relatedId: string }>(event);

    const fileList: Array<ICreateFile> = [];

    const relatedType = queryList?.relatedType || '';
    const relatedId = queryList?.relatedId || '';

    for (const file of body) {
        const name = await storeFileLocally(
            file, // the file object
            16, // you can add a name for the file or length of Unique ID that will be automatically generated!
            `/${relatedType}/${relatedId}/` // the folder the file will be stored in
        );

        // Use process.cwd() to get the project root path.
        // Define your upload directory relative to the root path
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
        };

        fileList.push(fileInfoToPush);

        // Parses a data URL and returns an object with the binary data and the file extension.
        // const { binaryString, ext } = parseDataUrl(file.content);
    }

    try {
        await prisma.appFile.createMany({data: fileList});
        await prisma.appFile.updateMany({where: {relatedId}, data: {ad: {connect: [{id: 1}]}}})
    } catch (error: any) {
        throw createError({
            statusCode: error.statusCode,
            message: error.message,
        });
    }

    return "success";
});
