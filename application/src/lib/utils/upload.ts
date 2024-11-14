import {writeFile } from "fs/promises";
import path from "path"; 


export async function saveFile(
    file: File,
    type: "images" | "videos" | "pdfs"
): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes):

    const filename = `${Date.now()}-${file.name}`;

    const publicDir = path.join(process.cwd(), "public");

    const uploadDir = path.join(publicDir, type);

    const filePath = path.join(uploadDir, filename);


    await writeFile(filePath, buffer);

    return `/${type}/${filename}`;
}