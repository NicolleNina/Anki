<script lang="ts">
    import { createEventDispatcher } from "svelte";
    let dispatch = createEventDispatcher();

    export let items: string[];
    export let activeItem: string;
</script>

<div>
    <ul>
        {#each items as item}
            <li on:click={() => dispatch("tabChange", item)}>
                <div class:active={item === activeItem}>{item}</div>
            </li>
        {/each}
    </ul>
</div>

<style>
    ul {
        display: flex;
        list-style-type: none;
    }

    li {
        font-size: 18px;
        cursor: pointer;
        padding-left: 8px;
        padding-right: 8px;
    }

    .active {
        border-bottom: 2px solid rgb(96, 141, 225);
    }
</style>
