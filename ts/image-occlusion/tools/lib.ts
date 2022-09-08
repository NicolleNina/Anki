import { zoomResetValue } from "../store";
import { get } from "svelte/store";

let _clipboard: any;

export const stopDraw = (canvas: any) => {
    canvas.off("mouse:down");
    canvas.off("mouse:up");
    canvas.off("mouse:move");
};

export const enableSelectable = (canvas: any, select: boolean) => {
    canvas.selection = select;
    canvas.forEachObject(function (o) {
        o.selectable = select;
    });
    canvas.renderAll();
};

export const deleteItem = (canvas: any) => {
    let active = canvas.getActiveObject();
    if (active) {
        canvas.remove(active);
        if (active.type == "activeSelection") {
            active.getObjects().forEach((x) => canvas.remove(x));
            canvas.discardActiveObject().renderAll();
        }
    }
};

export const duplicateItem = (canvas: any) => {
    copyItem(canvas);
    pasteItem(canvas);
};

export const groupShapes = (canvas: any) => {
    if (
        !canvas.getActiveObject() ||
        canvas.getActiveObject().type !== "activeSelection"
    ) {
        return;
    }

    canvas.getActiveObject().toGroup();
    canvas.requestRenderAll();
};

export const getQuestionMaskColor = () => {
    return localStorage.getItem("ques-color")
        ? localStorage.getItem("ques-color")
        : "#424242";
};

export const getAnswerMaskColor = () => {
    return localStorage.getItem("ans-color")
        ? localStorage.getItem("ans-color")
        : "#424242";
};

export const zoomIn = (instance) => {
    instance.smoothZoom(0, 0, 1.25);
};

export const zoomOut = (instance) => {
    instance.smoothZoom(0, 0, 0.5);
};

export const zoomReset = (instance) => {
    instance.moveTo(0, 0);
    instance.zoomAbs(0, 0, get(zoomResetValue));
};

const copyItem = (canvas: any) => {
    if (!canvas.getActiveObject()) {
        return;
    }

    // clone what are you copying since you
    // may want copy and paste on different moment.
    // and you do not want the changes happened
    // later to reflect on the copy.
    canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
    });
};

const pasteItem = (canvas: any) => {
    // clone again, so you can do multiple copies.
    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();

        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });

        if (clonedObj.type === "activeSelection") {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                canvas.add(obj);
            });

            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }

        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
};
