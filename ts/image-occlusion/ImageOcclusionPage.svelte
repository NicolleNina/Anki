<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import { fabric } from "fabric";
    import { generate } from "./generate";
    import { getImageClozeMetadata } from "./lib";
    import SideToolbar from "./SideToolbar.svelte";
    import StickyFooter from "./StickyFooter.svelte";
    import panzoom, { PanZoom } from "panzoom";
    import Tabs from "./Tabs.svelte";
    import Notes from "./Notes.svelte";
    import DeckSelector from "./DeckSelector.svelte";
    import type { Decks, ImageOcclusion, Notetypes } from "../lib/proto";
    import Container from "../components/Container.svelte";
    import Col from "../components/Col.svelte";
    import Row from "../components/Row.svelte";
    import NotetypeSelector from "./NotetypeSelector.svelte";

    export let path: string;
    export let data: string;
    export let deckNameIds: Decks.DeckNameId[];
    export let deckId: number | null;
    export let notetypeNameIds: Notetypes.NotetypeNameId[];
    export let globalNotetype: ImageOcclusion.ImageClozeMetadata.MappedNotetype | null;

    let instance: PanZoom;

    let canvas: fabric.Canvas;
    getImageClozeMetadata(path).then((meta) => {
        canvas = new fabric.Canvas("canvas", {
            hoverCursor: "pointer",
            selection: true,
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
        instance = panzoom(node);
        instance.pause();
    }

    async function hideAllGuessOne(): Promise<void> {
        generate(canvas, path, "hidden", deckId!);
    }

    async function hideOneGuessOne(): Promise<void> {
        generate(canvas, path, "shown", deckId!);
    }

    let items = ["Masks Editor", "Fields"];
    let activeItem = "Masks Editor";
    const tabChange = (e: { detail: string }) => (activeItem = e.detail);
</script>

<Container class="image-occlusion">
    <Tabs {activeItem} {items} on:tabChange={tabChange} />

    <div hidden={activeItem !== "Masks Editor"}>
        <div><SideToolbar {instance} {canvas} /></div>
        <div class="editor-main">
            <div class="editor-container" use:initPanzoom>
                <canvas id="canvas" />
            </div>
        </div>
    </div>

    <div hidden={activeItem !== "Fields"}>
        <Row --cols={2}>
            <Col --col-size={1} breakpoint="md">
                <Container>
                    {#if globalNotetype}
                        <NotetypeSelector
                            {notetypeNameIds}
                            bind:notetypeId={globalNotetype.id}
                        />
                    {/if}
                    {#if deckId}
                        <DeckSelector {deckNameIds} bind:deckId />
                    {/if}
                </Container>
            </Col>
        </Row>
        <Notes />
    </div>

    <StickyFooter {hideAllGuessOne} {hideOneGuessOne} />
</Container>

<style lang="scss">
    :global(.image-occlusion) {
        --gutter-inline: 0.25rem;

        :global(.row) {
            // rows have negative margins by default
            --bs-gutter-x: 0;
            // ensure equal spacing between tall rows like
            // dropdowns, and short rows like checkboxes
            min-height: 3em;
        }
    }
    .editor-main {
        position: absolute;
        top: 46px;
        left: 40px;
        bottom: 46px;
        right: 2px;
        border: 2px solid rgb(96, 141, 225);
        overflow: auto;
    }

    .editor-container {
        width: 100%;
        height: 100%;
    }
</style>
