<script lang="ts">
    import { getImageClozeMetadata } from "./lib";
    import panzoom, { PanZoom } from "panzoom";
    import { fabric } from "fabric";
    import SideToolbar from "./SideToolbar.svelte";

    export let path: string;
    export let data: string;

    let instance: PanZoom;

    let canvas: fabric.Canvas;
    getImageClozeMetadata(path).then((meta) => {
        canvas = new fabric.Canvas("canvas", {
            hoverCursor: "pointer",
            selectionBorderColor: "green",
        });

        // for debug in devtools
        globalThis.canvas = canvas;

        // get image width and height
        let image = new Image();
        image.onload = function () {
            canvas.setWidth(image.width);
            canvas.setHeight(image.height);

            fabric.Image.fromURL(image.src, function (image) {
                canvas.setBackgroundImage(image, canvas.renderAll.bind(canvas), {
                    scaleX: canvas.width! / image.width!,
                    scaleY: canvas.height! / image.height!,
                });
            });
        };

        image.src = data;
        image.remove();
    });

    function initPanzoom(node) {
        instance = panzoom(node, {
            bounds: true,
            maxZoom: 3,
            minZoom: 0.1,
            zoomDoubleClickSpeed: 1,
        });
        instance.pause();
    }
</script>

<div><SideToolbar {instance} {canvas} /></div>
<div class="editor-main">
    <div class="editor-container" use:initPanzoom>
        <canvas id="canvas" />
    </div>
</div>

<style lang="scss">
    .editor-main {
        position: absolute;
        top: 52px;
        left: 38px;
        bottom: 46px;
        right: 2px;
        border: 1px solid rgb(96, 141, 225);
        overflow: auto;
    }

    .editor-container {
        width: 100%;
        height: 100%;
    }
</style>
