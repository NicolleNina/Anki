import { fabric } from "fabric";
import { getQuestionMaskColor } from "./lib";

export const addText = (canvas: any) => {
    let text;
    
    canvas.on("mouse:down", function (o) {
        if (o.target == null) {
            text = new fabric.IText("Tap and Type", {
                fontFamily: "helvetica",
                fontSize: 30,
                fill: getQuestionMaskColor()!,
                fontStyle: "normal",
                top: o.e.offsetY,
                cursorDuration: 500,
                left: o.e.offsetX,
            });

            canvas.add(text);
        }
    });

    canvas.on("mouse:up", function (o) {
        text.setCoords();
    });
};
