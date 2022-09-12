<script>
    import IconButton from "../components/IconButton.svelte";
    import { cursorTools, undoRedoTools, zoomTools } from "./tools/bottom-tools";

    export let activeTool = "cursor";
    export let canvas;
    export let instance;
</script>

<div class="bottom-toolbar">
    {#each undoRedoTools as undoRedoTool}
        <IconButton
            class="bottom-tool-icon"
            iconSize={110}
            on:click={() => {
                undoRedoTool.action(canvas);
            }}
        >
            {@html undoRedoTool.icon}
        </IconButton>
    {/each}

    {#if activeTool === "cursor"}
        {#each cursorTools as cursorBottomTool}
            <IconButton
                class="bottom-tool-icon"
                iconSize={110}
                on:click={() => {
                    cursorBottomTool.action(canvas);
                }}
            >
                {@html cursorBottomTool.icon}
            </IconButton>
        {/each}
    {/if}

    {#if activeTool === "magnify"}
        {#each zoomTools as zoomBottomTool}
            <IconButton
                class="bottom-tool-icon"
                iconSize={110}
                on:click={() => {
                    zoomBottomTool.action(instance);
                }}
            >
                {@html zoomBottomTool.icon}
            </IconButton>
        {/each}
    {/if}
</div>

<style lang="scss">
    :global(.bottom-toolbar) {
        position: fixed;
        bottom: 0px;
        left: 46px;
        z-index: 99;
        width: 100%;
    }

    :global(.bottom-tool-icon) {
        border-radius: 100px !important;
        width: 40px;
        height: 40px !important;
        color: white !important;
        background: var(--slightly-grey-text) !important;
        line-height: 1px;
        margin: 6px;
    }
</style>
