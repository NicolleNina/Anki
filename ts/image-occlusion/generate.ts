import { addImageOcclusionNotes } from "./lib";
import { getAnswerMaskColor } from "./tools/lib";
import { noteFieldsData } from "./store";
import { get } from "svelte/store";

export function generate(imagePath: string, generateTye: string, deckId: number): void {
    let canvas = globalThis.canvas;
    let canvasObjects = canvas.getObjects();

    let occlusionNotes = `<div id='io_cloze' data-answer-mask-color='${getAnswerMaskColor()}'>`;
    let clozeDiv = "";

    canvasObjects.forEach((object, index) => {
        let obJson = object.toJSON();

        switch (obJson.type) {
            case "rect":
                clozeDiv += getRectCloze(object, index, generateTye, null);
                break;
            case "ellipse":
                clozeDiv += getEllipseCloze(object, index, generateTye, null);
                break;
            case "group":
                clozeDiv += getGroupCloze(object, index, generateTye);
                break;
        }
    });

    occlusionNotes += clozeDiv + "</div>";
    console.log(occlusionNotes);

    saveImageNotes(imagePath, occlusionNotes, deckId);
}

const getRectCloze = (object, index, generateTye, points) => {
    let obJson = object.toJSON();
    let type = obJson.type;

    let xywh = "";
    if (points) {
        xywh += points.left + "," + points.top + ",";
    } else {
        xywh += obJson.left + "," + obJson.top + ",";
    }

    xywh += obJson.width * obJson.scaleX + "," + obJson.height * obJson.scaleY;

    let clozeDiv = `<div data-shape='${type}' data-xywh='${xywh}' 
    data-fill='${obJson.fill}'>{{c${index + 1}::${generateTye}::prompted}}</div>\n`;

    return clozeDiv;
};

const getEllipseCloze = (object, index, generateTye, points) => {
    let obJson = object.toJSON();
    let type = obJson.type;

    let xywh = "";
    if (points) {
        xywh += points.left + "," + points.top + ",";
    } else {
        xywh += obJson.left + "," + obJson.top + ",";
    }

    xywh += obJson.width * obJson.scaleX + "," + obJson.height * obJson.scaleY;
    let rx = obJson.rx * obJson.scaleX;
    let ry = obJson.ry * obJson.scaleY;

    let clozeDiv = `<div data-shape='${type}' data-xywh='${xywh}' 
    data-rx='${rx}' data-ry='${ry}' data-fill='${obJson.fill}'>
        {{c${index + 1}::${generateTye}::prompted}}</div>\n`;

    return clozeDiv;
};

const getGroupCloze = (group, index, generateTye) => {
    let clozeDiv = "";

    for (let ob of group._objects) {
        let obJson = ob.toJSON();
        let points = getObjectPositionInGroup(group, ob);

        switch (obJson.type) {
            case "rect":
                clozeDiv += getRectCloze(ob, index, generateTye, points);
                break;
            case "ellipse":
                clozeDiv += getEllipseCloze(ob, index, generateTye, points);
                break;
        }
    }

    return clozeDiv;
};

const getObjectPositionInGroup = (group, object) => {
    let left = object.left + group.left + group.width / 2;
    let top = object.top + group.top + group.height / 2;
    left = left.toFixed(2);
    top = top.toFixed(2);
    return { top, left };
};

const saveImageNotes = async function (
    imagePath: string,
    notes: string,
    deckId: number,
) {
    const fieldsData = get(noteFieldsData);
    fieldsData["occlusions"] = notes;

    const fieldsDataStr = JSON.stringify(fieldsData);
    const noteData = Uint8Array.from(
        fieldsDataStr.split("").map((x) => x.charCodeAt(0)),
    );

    await addImageOcclusionNotes(imagePath, noteData, deckId);
};
