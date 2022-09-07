import type { fabric } from "fabric";
import { addImageOcclusionNotes } from "./lib";
import { getAnswerMaskColor } from "./tools";
import { noteFieldsData } from "./store";
import { get } from "svelte/store";

export function generate(
    imagePath: string,
    generateTye: string,
    deckId: number
): void {
    let canvas = globalThis.canvas;
    let canvasObjects = canvas.getObjects();

    let occlusionNotes = `<div id='io_cloze' answer-mask-color='${getAnswerMaskColor()}'>`;
    let clozeDiv = "";

    canvasObjects.forEach((object, index) => {
        let obJson = object.toJSON();
        let type = obJson.type;
        let xywh =
            obJson.left + "," + obJson.top + "," + obJson.width + "," + obJson.height;

        switch (obJson.type) {
            case "rect":
                clozeDiv += `<div shape='${type}' ioxywh='${xywh}' 
                fill='${obJson.fill}'>
                    {{c${index + 1}::${generateTye}::prompted}}
                </div>\n`;
                break;
            case "circle":
                clozeDiv += `<div shape='${type}' ioxywh='${xywh}' 
                ior='${obJson.radius}' fill='${obJson.fill}'>
                    {{c${index + 1}::${generateTye}::prompted}}
                </div>\n`;
                break;
        }
    });

    occlusionNotes += clozeDiv + "</div>";
    console.log(occlusionNotes);

    saveImageNotes(imagePath, occlusionNotes);
}

const saveImageNotes = async function (imagePath: string, notes: string) {
    const fieldsData = get(noteFieldsData);
    fieldsData["occlusions"] = notes;

    const fieldsDataStr = JSON.stringify(fieldsData);
    const noteData = Uint8Array.from(
        fieldsDataStr.split("").map((x) => x.charCodeAt(0)),
    );

    await addImageOcclusionNotes(imagePath, noteData);
};
