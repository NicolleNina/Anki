<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import { generate } from "./generate";
    import StickyFooter from "./StickyFooter.svelte";
    import Notes from "./Notes.svelte";
    import type { Decks, ImageOcclusion, Notetypes } from "../lib/proto";
    import MasksEditor from "./MasksEditor.svelte";
    import Container from "../components/Container.svelte";

    export let path: string;
    export let data: string;
    export let deckNameIds: Decks.DeckNameId[];
    export let deckId: number | null;
    export let notetypeNameIds: Notetypes.NotetypeNameId[];
    export let globalNotetype: ImageOcclusion.ImageClozeMetadata.MappedNotetype | null;

    async function hideAllGuessOne(): Promise<void> {
        generate(path, "hidden", deckId!);
    }

    async function hideOneGuessOne(): Promise<void> {
        generate(path, "shown", deckId!);
    }

    let items = [
        { label: "Masks", value: 1 },
        { label: "Notes", value: 2 },
    ];

    let activeTabValue = 1;
    const tabChange = (tabValue) => () => (activeTabValue = tabValue);
</script>

<Container class="image-occlusion">
    <ul>
        {#each items as item}
            <li class={activeTabValue === item.value ? "active" : ""}>
                <span on:click={tabChange(item.value)}>{item.label}</span>
            </li>
        {/each}
    </ul>

    <div hidden={activeTabValue != 1}>
        <MasksEditor {path} {data} />
    </div>

    <div hidden={activeTabValue != 2}>
        <Notes {deckNameIds} {deckId} {notetypeNameIds} {globalNotetype} />
    </div>
</Container>

<StickyFooter {hideAllGuessOne} {hideOneGuessOne} />

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
    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        list-style: none;
        border-bottom: 1px solid #dee2e6;
    }
    li {
        margin-bottom: -1px;
    }

    span {
        border: 1px solid transparent;
        border-top-left-radius: 0.25rem;
        border-top-right-radius: 0.25rem;
        display: block;
        padding: 0.5rem 1rem;
        cursor: pointer;
    }

    span:hover {
        border-color: #e9ecef #e9ecef #dee2e6;
    }

    li.active > span {
        color: #495057;
        background-color: #fff;
        border-color: #dee2e6 #dee2e6 #fff;
    }
</style>
