<script setup>
import { ref } from "vue";
import { isNotWorkspace } from "../stores";

const showSearchbar = ref(isNotWorkspace);
</script>

<template>
    <div
        class="mx-4 mt-2 mb-4 bg-gray-50 flex px-8 py-1 gap-4 rounded-md shadow-lg max-md:mx-2 max-md:px-4"
        v-show="showSearchbar"
    >
        <button><i class="bi bi-search text-gray-500"></i></button>
        <input
            type="text"
            placeholder="Search..."
            class="py-3 flex-grow hover:outline-none focus:outline-none bg-transparent"
        />
    </div>
</template>
