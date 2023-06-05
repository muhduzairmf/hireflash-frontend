<script setup></script>

<template>
    <!-- overlay effect -->
    <div class="fixed inset-0 bg-gray-50 overflow-y-auto h-full w-full z-30">
        <div class="relative h-full w-full grid place-items-center">
            <span class="loader"></span>
        </div>
    </div>
</template>

<style>
.loader {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: inline-block;
    border-top: 4px solid #4f46e5;
    border-right: 4px solid transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
.loader::after {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    top: 0;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border-left: 4px solid #4f46e5;
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
