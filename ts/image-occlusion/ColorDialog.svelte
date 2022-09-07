<script lang="ts">
    import { getAnswerMaskColor, getQuestionMaskColor } from "./tools/lib";

    const setColor = (type: string, e: any) => {
        localStorage.setItem(type, e.target.value);
    };
</script>

<div class="color-dialog">
    <div class="color-btn-container">
        <label for="ques-color">Question Mask Color</label>
        <input
            type="color"
            id="ques-color"
            value={getQuestionMaskColor()}
            on:change={(e) => setColor("ques-color", e)}
        />
    </div>
    <div class="color-btn-container">
        <label for="ans-color">Answer Mask Color</label>
        <input
            type="color"
            id="ans-color"
            value={getAnswerMaskColor()}
            on:change={(e) => setColor("ans-color", e)}
        />
    </div>
</div>

<style lang="scss">
    .color-dialog {
        display: flex;
        flex-direction: column;
        position: fixed;
        z-index: 1;
        left: 40px;
        top: 200px;
        overflow: auto;
        background: white;
        padding: 16px;
    }

    .color-btn-container {
        display: inline-grid;
        text-align: left;
        justify-items: left;
        margin: 2px;
    }
</style>
