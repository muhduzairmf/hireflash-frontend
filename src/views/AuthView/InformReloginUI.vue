<script setup>
import router from "../../router";

if (!window.sessionStorage.getItem("success-change")) {
    router.replace("/auth/login");
} else {
    window.sessionStorage.removeItem("success-change");
}
</script>

<template>
    <main class="bg-indigo-50 w-full min-h-screen grid place-items-center">
        <form
            class="px-10 py-5 rounded-lg shadow-xl bg-gray-50 w-fit max-sm:w-11/12 max-md:px-5"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">New password applied!</h2>
                <p>Please login with new password you just applied.</p>
            </div>
            <!-- Button -->
            <button
                type="submit"
                class="w-full h-10 mt-6 rounded-md bg-indigo-800 text-gray-50 flex justify-center items-center gap-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                v-on:click="
                    () => {
                        router.push('/auth/login');
                    }
                "
            >
                <p>Continue to login</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
        </form>
    </main>
</template>
