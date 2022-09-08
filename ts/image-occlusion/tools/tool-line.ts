import { fabric } from "fabric";
import { getQuestionMaskColor, stopDraw } from "./lib";

export const drawLine = (canvas: any) => {
    let line, isDown;

    stopDraw(canvas);

    let strokeColor = getQuestionMaskColor()!;
    let fillColor = getQuestionMaskColor()!;

    canvas.on("mouse:down", function (o) {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        let points = [pointer.x, pointer.y, pointer.x, pointer.y];
        line = new fabric.Line(points, {
            strokeWidth: 20,
            fill: fillColor,
            stroke: strokeColor,
            originX: "center",
            originY: "center",
        });
        canvas.add(line);
    });

    canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        let pointer = canvas.getPointer(o.e);
        line.set({
            x2: pointer.x,
            y2: pointer.y,
        });
        canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
        isDown = false;
        line.setCoords();
    });
};
