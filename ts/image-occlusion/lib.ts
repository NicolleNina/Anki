import { ImageOcclusion, imageOcclusion } from "../lib/proto";
import type { Collection } from "../lib/proto";

export async function getImageClozeMetadata(
    path: string,
): Promise<ImageOcclusion.ImageClozeMetadata> {
    return imageOcclusion.getImageClozeMetadata(
        ImageOcclusion.ImageClozeMetadataRequest.create({
            path,
        }),
    );
}

export async function addImageOcclusionNotes(
    imagePath: string,
    notesData: Uint8Array,
    deckId: number,
): Promise<Collection.OpChanges> {
    return imageOcclusion.addImageOcclusionNotes(
        ImageOcclusion.AddImageOcclusionNotesRequest.create({
            imagePath,
            notesData,
            deckId,
        }),
    );
}
