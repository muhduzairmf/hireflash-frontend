<script setup>
import TitleBorder from "../../components/TitleBorder.vue";

document.title = "Settings - Hireflash";
</script>

<template>
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <TitleBorder title="Settings" />
            <router-link
                to="/workspace/settings/edit-organization"
                class="flex justify-between items-center py-2 px-4 mt-2 rounded-md hover:shadow-inner hover:bg-indigo-100"
            >
                <p class="font-semibold">Edit Organization Info</p>
                <i class="bi bi-arrow-right text-xl"></i>
            </router-link>
            <router-link
                to="/workspace/settings/trash-bin"
                class="flex justify-between items-center py-2 px-4 mt-2 rounded-md hover:shadow-inner hover:bg-indigo-100"
            >
                <p class="font-semibold">Trash Bin</p>
                <i class="bi bi-arrow-right text-xl"></i>
            </router-link>
            <router-link
                to="/workspace/settings/add-officer"
                class="flex justify-between items-center py-2 px-4 mt-2 rounded-md hover:shadow-inner hover:bg-indigo-100"
            >
                <p class="font-semibold">Add Officer</p>
                <i class="bi bi-arrow-right text-xl"></i>
            </router-link>
            <router-link
                to="/workspace/settings/list-resign"
                class="flex justify-between items-center py-2 px-4 mt-2 rounded-md hover:shadow-inner hover:bg-indigo-100"
            >
                <p class="font-semibold">List of Resignation Request</p>
                <i class="bi bi-arrow-right text-xl"></i>
            </router-link>
        </div>
        <br />
    </div>
</template>
