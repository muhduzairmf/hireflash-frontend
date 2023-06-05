<script setup>
import { ref } from "vue";

const props = defineProps({
    color: String,
});

const white = ref(false);
const indigo = ref(false);

if (props.color === "white") {
    white.value = true;
} else if (props.color === "indigo") {
    indigo.value = true;
}
</script>

<template>
    <span
        v-bind:class="{ 'loader-white': white, 'loader-indigo': indigo }"
    ></span>
</template>

<style>
.loader-white {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #f9fafb;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
.loader-white::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border-left: 4px solid #f9fafb;
    border-bottom: 4px solid transparent;
    animation: rotation 0.5s linear infinite reverse;
}
.loader-indigo {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #3730a3;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
.loader-indigo::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border-left: 4px solid #3730a3;
    border-bottom: 4px solid transparent;
    animation: rotation 0.5s linear infinite reverse;
}
@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
