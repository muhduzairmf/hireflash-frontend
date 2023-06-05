<script setup>
import router from "../router";
import { candidate_profile, officer, user } from "../stores";
import { getRoleAndUserId } from "../lib/Auth";

document.title = "404 Not Found - Hireflash";

const { role } = getRoleAndUserId();
</script>

<template>
    <main class="bg-indigo-100 w-full min-h-screen grid place-items-center">
        <nav class="bg-gray-50 shadow-md w-screen py-4 px-2 fixed top-0">
            <div
                class="max-w-7xl mx-auto relative flex justify-center items-center"
            >
                <a href="/"
                    ><img src="/hireflash.png" alt="" class="w-40 h-auto"
                /></a>
            </div>
        </nav>
        <div class="flex flex-col items-center gap-2">
            <img src="/not-found.png" class="w-56 h-auto" alt="not found" />
            <h1 class="text-4xl max-md:text-2xl max-md:text-center">
                404 Not Found. Page that you are looking is not exists.
            </h1>
            <p
                v-on:click="router.back()"
                class="text-indigo-500 hover:underline cursor-pointer select-none"
            >
                <i class="bi bi-arrow-left"></i>&nbsp;Back to previous page
            </p>
            <template
                v-if="
                    role === 'admin' ||
                    role === 'admin,hr' ||
                    role === 'admin,manager' ||
                    role === 'hr' ||
                    role === 'manager' ||
                    role === 'guest'
                "
            >
                <router-link
                    class="text-indigo-500 hover:underline cursor-pointer select-none"
                    to="/workspace"
                    ><i class="bi bi-arrow-left"></i>&nbsp;Back to
                    workspace</router-link
                >
            </template>
            <template v-if="role === 'applicant'">
                <router-link
                    class="text-indigo-500 hover:underline cursor-pointer select-none"
                    to="/profile"
                    ><i class="bi bi-arrow-left"></i>&nbsp;Back to profile
                    page</router-link
                >
            </template>
        </div>
    </main>
</template>
