<script>
    import IconButton from "../components/IconButton.svelte";
    import { tools } from "./tools/tool-buttons";
    import { enableSelectable, stopDraw } from "./tools/lib";
    import { addText, drawCircle, drawRectangle } from "./tools/index";
    import ColorDialog from "./ColorDialog.svelte";
    import BottomToolbar from "./BottomToolbar.svelte";

    export let instance;
    export let canvas;

    let activeTool = "cursor";

    function setActive(toolId) {
        activeTool = toolId;
        disableFunctions();

        if (toolId === "cursor") {
            enableSelectable(canvas, true);
        } else if (toolId === "magnify") {
            instance.resume();
        } else if (toolId === "draw-rectangle") {
            drawRectangle(canvas);
        } else if (toolId === "draw-circle") {
            drawCircle(canvas);
        } else if (toolId === "add-text") {
            addText(canvas);
        }
    }

    const disableFunctions = () => {
        instance.pause();
        stopDraw(canvas);
        enableSelectable(canvas, false);
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

{#if activeTool === "choose-color"}
    <ColorDialog />
{/if}

<BottomToolbar {canvas} {activeTool} {instance} />

<style>
    .tool-bar-container {
        position: fixed;
        top: 52px;
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
</style>
