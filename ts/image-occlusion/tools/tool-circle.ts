import { fabric } from "fabric";
import { getQuestionMaskColor, stopDraw } from "./lib";

export const drawCircle = (canvas: any) => {
    let circle, isDown, origX, origY;

    stopDraw(canvas);

    canvas.on("mouse:down", function (o) {
        isDown = true;

        let pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        circle = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 1,
            fill: getQuestionMaskColor()!,
            originX: "center",
            originY: "center",
            transparentCorners: false,
            selectable: false,
        });

        canvas.add(circle);
    });

    canvas.on("mouse:move", function (o) {
        if (!isDown) return;

        let pointer = canvas.getPointer(o.e);
        circle.set({
            radius: Math.abs(origX - pointer.x),
        });

        canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
        isDown = false;

        let pointer = canvas.getPointer(o.e);
        let radius = Math.abs(origX - pointer.x);
        if (radius < 5) {
            canvas.remove(circle);
        }        
        circle.setCoords();
    });
};
