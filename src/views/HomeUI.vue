<script setup>
import { ref } from "vue";

document.title = "Hireflash - Recruitment and application just in one place";

const sidebarHidden = ref(true);

function toggleSidebar() {
    sidebarHidden.value = !sidebarHidden.value;
}
</script>

<template>
    <main class="relative">
        <nav
            class="fixed w-screen bg-indigo-800 py-4 px-2 shadow-lg shadow-indigo-200"
        >
            <div class="max-w-7xl mx-auto flex justify-between items-center">
                <div class="flex gap-2">
                    <div class="grid place-items-center">
                        <a href="/" class="max-md:mx-4"
                            ><img
                                src="/hireflash-white.png"
                                alt=""
                                class="w-36 h-auto"
                        /></a>
                    </div>
                    <p
                        class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out max-md:hidden"
                    >
                        Get Started
                    </p>
                    <p
                        class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out max-md:hidden"
                    >
                        Features
                    </p>
                    <p
                        class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out max-md:hidden"
                    >
                        Learn
                    </p>
                    <p
                        class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out max-md:hidden"
                    >
                        About Us
                    </p>
                </div>
                <div class="flex flex-row-reverse gap-2">
                    <router-link
                        to="/auth/signup"
                        class="px-4 py-2 text-white hover:text-indigo-800 transition ease-in-out hover:bg-white rounded-md hover:shadow-lg max-md:hidden"
                        >Sign Up</router-link
                    >
                    <router-link
                        to="/auth/login"
                        class="px-4 py-2 text-white hover:text-indigo-800 transition ease-in-out hover:bg-white rounded-md hover:shadow-lg max-md:hidden"
                        >Login</router-link
                    >
                    <button
                        class="md:hidden text-2xl transition ease-in-out"
                        v-on:click="toggleSidebar()"
                    >
                        <i
                            class="bi px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg"
                            v-bind:class="{
                                'bi-list': sidebarHidden,
                                'bi-x-lg': !sidebarHidden,
                            }"
                        ></i>
                    </button>
                </div>
            </div>
        </nav>

        <nav
            class="fixed h-full w-2/3 top-16 right-0 bg-indigo-800 py-2 px-4 duration-1000"
            v-bind:class="{ hidden: sidebarHidden, block: !sidebarHidden }"
        >
            <br /><br /><br />
            <div class="flex flex-col gap-2">
                <router-link
                    to="/get-started"
                    class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out"
                >
                    Get Started
                </router-link>
                <p
                    class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out"
                >
                    Features
                </p>
                <p
                    class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out"
                >
                    Learn
                </p>
                <p
                    class="px-4 py-2 text-white hover:text-indigo-800 hover:bg-white rounded-md hover:shadow-lg cursor-pointer transition ease-in-out"
                >
                    About Us
                </p>
                <router-link
                    to="/auth/signup"
                    class="px-4 py-2 text-white hover:text-indigo-800 transition ease-in-out hover:bg-white rounded-md hover:shadow-lg"
                    >Sign Up</router-link
                >
                <router-link
                    to="/auth/login"
                    class="px-4 py-2 text-white hover:text-indigo-800 transition ease-in-out hover:bg-white rounded-md hover:shadow-lg"
                    >Login</router-link
                >
            </div>
        </nav>

        <div class="py-16"></div>
        <section class="py-32 h-screen">
            <h1 class="text-6xl max-md:text-4xl font-bold text-center">
                One platform to combine both
            </h1>
            <h4 class="text-2xl text-center">
                Recruitment and application just in one place
            </h4>
            <br />
            <p class="text-xl text-center mb-4">Get started now as</p>
            <div class="flex justify-center items-center gap-4">
                <router-link
                    to="/get-started"
                    class="bg-indigo-800 text-white px-4 py-2 rounded-md shadow-lg hover:outline hover:bg-white hover:outline-2 hover:outline-indigo-800 hover:text-indigo-800 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    >Organization</router-link
                >
                <router-link
                    to="/auth/signup"
                    class="bg-indigo-800 text-white px-4 py-2 rounded-md shadow-lg hover:outline hover:bg-white hover:outline-2 hover:outline-indigo-800 hover:text-indigo-800 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    >Applicant</router-link
                >
            </div>
        </section>
    </main>
</template>
