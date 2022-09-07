<script lang="ts">
    import Container from "../components/Container.svelte";
    import { noteFieldsData } from "./store";
    import Col from "../components/Col.svelte";
    import Row from "../components/Row.svelte";
    import NotetypeSelector from "./NotetypeSelector.svelte";
    import DeckSelector from "./DeckSelector.svelte";
    import type { Decks, ImageOcclusion, Notetypes } from "../lib/proto";

    export let deckNameIds: Decks.DeckNameId[];
    export let deckId: number | null;
    export let notetypeNameIds: Notetypes.NotetypeNameId[];
    export let globalNotetype: ImageOcclusion.ImageClozeMetadata.MappedNotetype | null;

    let notesFields = [
        { id: "notes", title: "Notes" },
        { id: "tags", title: "Tags" },
    ];
</script>

<Container>
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
    {#each notesFields as field}
        <Container>
            <div>{field.title}</div>
            <textarea class="text-area" bind:value={$noteFieldsData[field.id]} />
        </Container>
    {/each}
</Container>

<style lang="scss">
    .text-area {
        height: 80px;
    }
</style>
