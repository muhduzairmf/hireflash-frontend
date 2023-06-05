<script setup>
import { ref } from "vue";

const props = defineProps({
    modaltype: String,
});

// suitable for small content
const small = ref(false);
// suitable for big content
const big = ref(false);

if (props.modaltype === "small") {
    small.value = true;
} else if (props.modaltype === "big") {
    big.value = true;
}
</script>

<template>
    <div>
        <!-- dialog modal for displaying company information -->
        <dialog
            v-bind:class="{
                'bg-gray-50 max-w-5xl h-[95vh] overflow-auto px-8 py-6 rounded-md shadow-lg mb-4 z-40 fixed top-4 max-md:w-full max-md:px-4 max-md:py-3':
                    big,
                'bg-gray-50 w-fit h-fit overflow-auto px-8 py-6 rounded-md shadow-lg mb-4 z-40 fixed top-[50%] translate-y-[-50%]':
                    small,
            }"
            open
        >
            <button
                class="absolute top-2 right-2 py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="$emit('toggle')"
            >
                <i class="bi bi-x text-2xl"></i>
            </button>
            <slot></slot>
        </dialog>
        <!-- overlay effect -->
        <div
            class="fixed inset-0 bg-gray-700 bg-opacity-60 overflow-y-auto h-full w-full z-30"
            v-on:click="$emit('toggle')"
        ></div>
    </div>
</template>
