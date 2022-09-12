var isRedoing = false;
var stack: any = [];

export const undoRedoInit = (canvas: any) => {
    canvas.on("object:added", function () {
        if (!isRedoing) {
            stack = [];
        }
        isRedoing = false;
    });
};

export const undoAction = (canvas: any) => {
    if (canvas._objects.length > 0) {
        stack.push(canvas._objects.pop());
        canvas.renderAll();
    }
};

export const redoAction = (canvas: any) => {
    if (stack.length > 0) {
        isRedoing = true;
        canvas.add(stack.pop());
    }
};
