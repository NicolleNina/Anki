<script>
    import IconButton from "../components/IconButton.svelte";
    import { tools } from "./tool-buttons";
    import {
        deleteItem,
        disableSelectable,
        drawCircle,
        drawRectangle,
        enableSelectable,
        stopDraw,
    } from "./tools";

    export let instance;
    export let canvas;

    let activeTool = "cursor";

    function setActive(toolId) {
        activeTool = toolId;
        disableFunctions();

        if (toolId === "magnify") {
            instance.resume();
        } else if (toolId === "draw-rectangle") {
            drawRectangle(canvas);
        } else if (toolId === "draw-circle") {
            drawCircle(canvas);
        } else if (toolId === "delete-item") {
            deleteItem(canvas);
        } else if (toolId === "choose-color") {
            document.querySelector(".color-dialog").style.display = "flex";
        } else {
            enableSelectable(canvas);
        }
    }

    const disableFunctions = () => {
        instance.pause();
        stopDraw(canvas);
        disableSelectable(canvas);
        document.querySelector(".color-dialog").style.display = "none";
    };

    const setColor = (type, color) => {
        localStorage.setItem(type, color);
    };
</script>

<div class="tool-bar-container">
    <div>
        {#each tools as tool}
            <IconButton
                class="tool-icon-button {activeTool == tool.id ? 'active-tool' : ''}"
                iconSize={124}
                active={activeTool === tool.id}
                on:click={() => setActive(tool.id)}>{@html tool.icon}</IconButton
            >
        {/each}
    </div>
</div>

<div class="color-dialog">
    <div class="color-btn-container">
        <label for="ques-color">Question Mask Color</label>
        <input
            type="color"
            id="ques-color"
            value={localStorage.getItem("ques-color")
                ? localStorage.getItem("ques-color")
                : "#000"}
            on:change={(e) => setColor("ques-color", e.target.value)}
        />
    </div>
    <div class="color-btn-container">
        <label for="ans-color">Answer Mask Color</label>
        <input
            type="color"
            id="ans-color"
            value={localStorage.getItem("ans-color")
                ? localStorage.getItem("ans-color")
                : "#000"}
            on:change={(e) => setColor("ans-color", e.target.value)}
        />
    </div>
</div>

<style>
    .tool-bar-container {
        position: fixed;
        top: 46px;
        left: 0;
        height: 100%;
        border-right: 1px solid #e3e3e3;
        overflow-y: auto;
        width: 36px;
        z-index: 99;
        background: white;
    }

    :global(.tool-icon-button) {
        border: unset;
        display: block;
        width: 36px;
        height: 36px;
        margin: unset;
        padding: 8px !important;
    }

    :global(.active-tool) {
        color: red !important;
        background: unset !important;
    }
    :global(.color-dialog) {
        display: none;
        flex-direction: column;
        position: fixed;
        z-index: 1;
        left: 40px;
        top: 200px;
        overflow: auto;
        background: white;
        padding: 16px;
    }

    :global(.color-btn-container) {
        display: inline-grid;
        text-align: left;
        justify-items: left;
        margin: 2px;
    }
</style>
