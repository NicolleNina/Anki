<!--
Copyright: Ankitects Pty Ltd and contributors
License: GNU AGPL, version 3 or later; http://www.gnu.org/licenses/agpl.html
-->
<script lang="ts">
    import IconButton from "../../components/IconButton.svelte";
    import { bridgeCommand } from "../../lib/bridgecommand";
    import { imagePlus } from "./icons";
</script>

<IconButton on:click={(event) => {bridgeCommand("imageOcclusion")}}>
    {@html imagePlus}
</IconButton>
