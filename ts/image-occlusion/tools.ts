import { fabric } from "fabric";

let line, isDown;

export const drawLine = (canvas: any) => {
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
    });
};

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
    });
};

export const drawRectangle = (canvas: any) => {
    let rect, isDown, origX, origY;

    stopDraw(canvas);

    canvas.on("mouse:down", function (o) {
        isDown = true;

        let pointer = canvas.getPointer(o.e);
        origX = pointer.x;
        origY = pointer.y;

        rect = new fabric.Rect({
            left: origX,
            top: origY,
            originX: "left",
            originY: "top",
            width: pointer.x - origX,
            height: pointer.y - origY,
            angle: 0,
            fill: getQuestionMaskColor()!,
            transparentCorners: false,
            selectable: false,
        });

        canvas.add(rect);
    });

    canvas.on("mouse:move", function (o) {
        if (!isDown) return;
        let pointer = canvas.getPointer(o.e);

        if (origX > pointer.x) {
            rect.set({
                left: Math.abs(pointer.x),
            });
        }
        if (origY > pointer.y) {
            rect.set({
                top: Math.abs(pointer.y),
            });
        }

        rect.set({
            width: Math.abs(origX - pointer.x),
        });
        rect.set({
            height: Math.abs(origY - pointer.y),
        });

        canvas.renderAll();
    });

    canvas.on("mouse:up", function (o) {
        isDown = false;

        let pointer = canvas.getPointer(o.e);
        let height = Math.abs(origY - pointer.y);
        let width = Math.abs(origX - pointer.x);

        if (height < 5 && width < 5) {
            canvas.remove(rect);
        }
    });
};

export const stopDraw = (canvas: any) => {
    canvas.off("mouse:down");
    canvas.off("mouse:up");
    canvas.off("mouse:move");
};

export const disableSelectable = (canvas: any) => {
    canvas.selection = false;
    canvas.forEachObject(function (o) {
        o.selectable = false;
    });
};

export const enableSelectable = (canvas: any) => {
    canvas.selection = true;
    canvas.forEachObject(function (o) {
        o.selectable = true;
    });
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
