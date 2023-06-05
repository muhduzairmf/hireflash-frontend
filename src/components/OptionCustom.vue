<script setup>
import { ref } from "vue";

const props = defineProps({
    optionvalue: String,
});

const opt = ref(props.optionvalue);
</script>

<template>
    <button
        class="p-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100 text-left"
        type="button"
    >
        {{ opt }}
    </button>
</template>
