<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint } from "../../stores";
import router from "../../router";

document.title = "Trash Bin - Hireflash";

function applyingFilter() {
    alert("Filter applied");
}
</script>

<template>
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <div class="mt-2 flex items-center gap-2">
                <router-link
                    to="/workspace/settings"
                    class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    ><i class="bi bi-arrow-left text-xl"></i
                ></router-link>
                <h2>Settings</h2>
            </div>
            <div class="mt-4 flex justify-between max-md:block">
                <div>
                    <TitleBorder title="Trash Bin" />
                </div>
                <select
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 h-7 transition ease-in-out focus:scale-95 hover:-translate-y-1 text-sm cursor-pointer"
                    v-on:change="applyingFilter()"
                >
                    <option value="">Apply filter</option>
                    <option value="">Filter 1</option>
                    <option value="">Filter 2</option>
                </select>
            </div>
            <div class="mt-4">
                <div class="relative group">
                    <button class="absolute top-0 right-0">
                        <i
                            class="bi bi-three-dots-vertical text-lg relative"
                        ></i>
                    </button>
                    <div
                        class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 min-w-fit py-4 px-2 rounded-md shadow-lg outline outline-2 outline-indigo-200"
                    >
                        <div class="flex flex-col">
                            <button
                                class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                Cancel Request
                            </button>
                            <button
                                class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                Confirm Resign
                            </button>
                        </div>
                    </div>
                </div>
                <div class="py-4">
                    <div class="">
                        <h4 class="text-xl font-semibold">
                            Full Stack Developer
                        </h4>
                        <p class="max-md:text-sm">
                            <i class="bi bi-journal-bookmark"></i>
                            <span class="max-md:hidden">&nbsp;</span>&nbsp;
                            Recruitment by Lucas Anderson
                        </p>
                    </div>
                </div>
            </div>
            <div class="mt-4">
                <div class="relative group">
                    <button class="absolute top-0 right-0">
                        <i
                            class="bi bi-three-dots-vertical text-lg relative"
                        ></i>
                    </button>
                    <div
                        class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 min-w-fit py-4 px-2 rounded-md shadow-lg outline outline-2 outline-gray-300"
                    >
                        <div class="flex flex-col">
                            <button
                                class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                Cancel Request
                            </button>
                            <button
                                class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                Confirm Resign
                            </button>
                        </div>
                    </div>
                </div>
                <div class="py-4">
                    <div class="">
                        <h4 class="text-xl font-semibold">Chen Yi Fei</h4>
                        <p class="max-md:text-sm">
                            <i class="bi bi-people"></i>
                            <span class="max-md:hidden">&nbsp;</span>&nbsp;
                            Candidate from Applicant List (Full Stack Developer)
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <br />
    </div>
</template>
