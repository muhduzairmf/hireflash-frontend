<script setup>
import { ref } from "vue";

const sidebarHidden = ref(true);

function toggleSidebar() {
    sidebarHidden.value = !sidebarHidden.value;
}

const props = defineProps({
    shownav: Boolean,
});

const showNav = ref(props.shownav);
</script>

<template>
    <!-- for pc, desktop -->
    <nav
        class="max-md:hidden fixed bg-gray-50 shadow-lg w-screen py-4 px-2 z-10"
        v-show="showNav"
    >
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex gap-2">
                <div class="grid place-items-center">
                    <img src="/hireflash.png" alt="" class="w-36 h-auto" />
                </div>
            </div>
            <div class="flex flex-row-reverse gap-2">
                <div class="group relative">
                    <button class="flex items-center gap-1">
                        <img
                            src="/person-circle.svg"
                            alt=""
                            class="border-2 border-indigo-200 rounded-full w-9 h-9"
                        />
                    </button>
                    <div
                        class="absolute top-12 right-0 hidden group-focus-within:grid place-items-center bg-gray-50 w-44 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200"
                    >
                        <div class="flex flex-col gap-1">
                            <router-link
                                to="/job/search"
                                class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                <i class="bi bi-compass"></i>&nbsp;&nbsp; Search
                                a job
                            </router-link>
                            <router-link
                                to="/auth/login"
                                class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                <i class="bi bi-box-arrow-in-right"></i
                                >&nbsp;&nbsp; Login
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    <!-- for tab, mobile -->
    <nav
        class="hidden max-md:block fixed bg-gray-50 shadow-md w-screen py-3 px-2 z-10"
        v-show="showNav"
    >
        <div
            class="max-w-7xl mx-auto relative flex justify-center items-center"
        >
            <button
                class="md:hidden text-2xl transition ease-in-out absolute left-0"
                v-on:click="toggleSidebar()"
            >
                <i
                    class="bi px-2 py-1 text-indigo-800 hover:bg-indigo-800 hover:text-white rounded-md hover:shadow-lg"
                    v-bind:class="{
                        'bi-list': sidebarHidden,
                        'bi-x-lg': !sidebarHidden,
                    }"
                ></i>
            </button>
            <div class="grid place-items-center">
                <img src="/hireflash.png" alt="" class="w-36 h-auto" />
            </div>
        </div>
    </nav>
    <nav
        class="fixed h-screen w-10/12 top-0 left-0 bg-gray-50 py-2 px-4 z-40"
        v-bind:class="{ hidden: sidebarHidden, block: !sidebarHidden }"
        v-show="showNav"
    >
        <div class="relative">
            <button
                class="md:hidden text-2xl transition ease-in-out absolute right-0 top-2"
                v-on:click="toggleSidebar()"
            >
                <i
                    class="bi px-2 py-1 text-indigo-800 hover:bg-indigo-800 hover:text-white rounded-md hover:shadow-lg"
                    v-bind:class="{
                        'bi-list': sidebarHidden,
                        'bi-x-lg': !sidebarHidden,
                    }"
                ></i>
            </button>
        </div>
        <div class="flex flex-col h-full justify-center text-base">
            <div class="mb-4 flex flex-col">
                <div class="flex items-center gap-3 mb-2">
                    <img
                        src="/person-circle.svg"
                        alt=""
                        class="border-2 border-indigo-200 rounded-full w-16 h-16 block"
                    />
                    <h3 class="font-medium text-2xl hover:underline">User</h3>
                </div>
                <div
                    class="mt-2 w-full border-t-[1.5px] border-indigo-200"
                ></div>
            </div>
            <router-link
                to="/auth/login"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                Login
            </router-link>
            <router-link
                to="/auth/signup"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                Sign up
            </router-link>
            <br /><br />
        </div>
    </nav>
    <!-- overlay effect -->
    <div
        class="fixed inset-0 bg-gray-700 bg-opacity-60 overflow-y-auto h-full w-full z-30"
        v-on:click="toggleSidebar()"
        v-bind:class="{ hidden: sidebarHidden, block: !sidebarHidden }"
        v-show="showNav"
    ></div>
    <div class="py-6" v-show="showNav"></div>
</template>
