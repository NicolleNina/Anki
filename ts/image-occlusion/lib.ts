import { ImageOcclusion, imageOcclusion } from "../lib/proto";

export async function getImageClozeMetadata(path: string): Promise<ImageOcclusion.ImageClozeMetadata> {
    return imageOcclusion.getImageClozeMetadata(
        ImageOcclusion.ImageClozeMetadataRequest.create({
            path,
        }),
    );
}

export async function addImageOcclusionNotes(
    imagePath: string,
    notesData: Uint8Array,
): Promise<ImageOcclusion.ResultAddNotes> {
    return imageOcclusion.addImageOcclusionNotes(
        ImageOcclusion.AddImageOcclusionNotesRequest.create({
            imagePath,
            notesData,
        }),
    );
}
