<script lang="ts">
    import Container from "../components/Container.svelte";
    import { noteFieldsData } from "./store";

    let notesFields = [
        { id: "notes", title: "Notes" },
        { id: "tags", title: "Tags" },
    ];
</script>

<Container class="notes-main">
    {#each notesFields as field}
        <Container class="textarea-main">
            <div>{field.title}</div>
            <textarea class="text-area" bind:value={$noteFieldsData[field.id]} />
        </Container>
    {/each}
</Container>

<style lang="scss">
    :global(.notes-main) {
        padding: 0px 10px 60px 10px !important;
    }

    :global(.textarea-main) {
        padding-bottom: 12px;
    }

    .text-area {
        height: 80px;
    }
</style>
