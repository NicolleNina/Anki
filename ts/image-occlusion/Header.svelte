<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import type { Decks } from "../lib/proto";
    import StickyContainer from "../components/StickyContainer.svelte";
    import DeckSelector from "./DeckSelector.svelte";

    export let deckNameIds: Decks.DeckNameId[];
    export let deckId: number | null;
</script>

<StickyContainer --sticky-border="var(--border)" --sticky-borders="0px 0 1px">
    {#if deckId}
        <DeckSelector {deckNameIds} bind:deckId />
    {/if}
</StickyContainer>

<style lang="scss">
</style>
