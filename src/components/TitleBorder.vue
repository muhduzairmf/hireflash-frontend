<script setup>
defineProps({
    title: String,
});
</script>

<template>
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <p class="w-10 border-b-2 border-black mt-1 mb-2"></p>
</template>
