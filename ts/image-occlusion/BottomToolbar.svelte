<script>
    import IconButton from "../components/IconButton.svelte";
    import { cursorTools, zoomTools } from "./tools/bottom-tools";

    export let activeTool = "cursor";
    export let canvas;
    export let instance;
</script>

<div class="bottom-toolbar">
    {#if activeTool === "cursor"}
        {#each cursorTools as cursorBottomTool}
            <IconButton
                class="bottom-tool-icon"
                iconSize={120}
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
                iconSize={120}
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
        bottom: 64px;
        z-index: 99;
        width: 100%;
        text-align: center;
    }

    :global(.bottom-tool-icon) {
        border-radius: 100px !important;
        width: 48px;
        height: 48px !important;
        color: white !important;
        background: var(--slightly-grey-text) !important;
        line-height: 1px;
        margin: 6px;
    }
</style>
