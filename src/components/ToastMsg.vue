<script setup>
defineProps({
    msg: String,
});
</script>

<template>
    <div
        class="fixed bg-gray-50 rounded-md shadow-lg w-fit top-6 right-6 flex items-center z-40 max-md:right-0 max-md:mx-6 border-2 border-indigo-200"
    >
        <div
            class="bg-indigo-800 py-4 px-6 text-gray-50 rounded-tl-md rounded-bl-md h-full"
        >
            <i class="bi bi-quote"></i>
        </div>
        <p class="py-4 px-8 max-md:py-1 max-md:px-4">
            {{ msg }}
        </p>
    </div>
</template>
