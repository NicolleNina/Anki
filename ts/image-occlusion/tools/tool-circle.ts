import { fabric } from "fabric";
import { getQuestionMaskColor, stopDraw } from "./lib";

export const drawCircle = (canvas: any) => {
    let ellipse, isDown, origX, origY;

    stopDraw(canvas);

    canvas.on("mouse:down", function (o) {
        isDown = true;

        let pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        ellipse = new fabric.Ellipse({
            left: pointer.x,
            top: pointer.y,
            rx: 1,
            ry: 1,
            fill: getQuestionMaskColor()!,
            originX: "center",
            originY: "center",
            transparentCorners: false,
            selectable: false,
        });

        canvas.add(ellipse);
    });

    canvas.on("mouse:move", function (o) {
        if (!isDown) return;

        let pointer = canvas.getPointer(o.e);
        ellipse.set({
            rx: Math.abs(origX - pointer.x),
            ry: Math.abs(origY - pointer.y),
        });

        canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
        isDown = false;

        let pointer = canvas.getPointer(o.e);
        let rx = Math.abs(origX - pointer.x);
        let ry = Math.abs(origY - pointer.y);
        if (rx < 5 || ry < 5) {
            canvas.remove(ellipse);
        }
        ellipse.setCoords();
    });
};
