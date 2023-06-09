<script setup>
import router from "../router";
import { deleteCookie } from "../lib/Auth";
import { officer, user } from "../stores";
import { ref } from "vue";

function logout() {
    // Delete cookie
    deleteCookie();

    router.push("/");
}

const onlyAdmin = ref(officer.value.position.includes("admin"));
</script>

<template>
    <div
        class="bg-gray-50 min-w-full px-4 py-2 flex flex-col gap-1 sticky top-0 h-screen max-md:items-center max-md:px-2"
        style="
            box-shadow: 4px 0 6px -1px rgb(0 0 0 / 0.1),
                2px 0 4px -2px rgb(0 0 0 / 0.1);
        "
    >
        <img
            src="/hireflash.png"
            alt=""
            class="w-44 h-auto mt-2 mb-5 max-md:hidden"
        />
        <img src="/icon.png" alt="" class="w-8 h-auto mt-2 mb-5 md:hidden" />
        <router-link
            to="/workspace"
            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2 max-md:text-lg"
        >
            <i class="bi bi-house"></i>
            <span class="max-md:hidden">&nbsp;&nbsp;Home</span>
        </router-link>
        <router-link
            to="/workspace/notifications"
            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2 max-md:text-lg"
        >
            <i class="bi bi-bell"></i>
            <span class="max-md:hidden">&nbsp;&nbsp;Notifications</span>
        </router-link>
        <router-link
            to="/workspace/inbox"
            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2 max-md:text-lg"
        >
            <i class="bi bi-envelope"></i>
            <span class="max-md:hidden">&nbsp;&nbsp;Inbox</span>
        </router-link>
        <div class="group relative">
            <button
                class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 group w-full max-md:py-2 max-md:px-2 max-md:text-lg"
            >
                <i class="bi bi-journal-bookmark"></i>
                <span class="max-md:hidden">&nbsp;&nbsp;Recruitments</span>
            </button>
            <div
                class="relative top-2 hidden group-focus-within:grid place-items-center bg-gray-50 w-44 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200 mb-4 max-md:py-0 max-md:w-full"
            >
                <div class="flex flex-col gap-1">
                    <router-link
                        to="/workspace/recruitment/new"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2"
                    >
                        <i class="bi bi-file-earmark-plus"></i
                        ><span class="inline max-md:hidden"
                            >&nbsp;&nbsp; Add New</span
                        >
                    </router-link>
                    <router-link
                        to="/workspace/recruitment/view-all"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2"
                    >
                        <i class="bi bi-person-lines-fill"></i
                        ><span class="inline max-md:hidden"
                            >&nbsp;&nbsp; View All</span
                        >
                    </router-link>
                </div>
            </div>
        </div>
        <router-link
            to="/workspace/settings"
            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-2 max-md:text-lg"
            v-show="onlyAdmin"
        >
            <i class="bi bi-gear"></i>
            <span class="max-md:hidden">&nbsp;&nbsp;Settings</span>
        </router-link>

        <div class="absolute bottom-5 group">
            <div class="relative">
                <div
                    class="hidden group-focus-within:grid place-items-center bg-gray-50 w-44 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200 mb-2 max-md:group-focus-within:absolute max-md:bottom-0 max-md:left-0.5 max-md:py-0 max-md:w-fit"
                >
                    <div class="flex flex-col gap-1">
                        <router-link
                            to="/workspace/user-info"
                            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-[0.6rem]"
                        >
                            <i class="bi bi-person-badge"></i
                            ><span class="inline max-md:hidden"
                                >&nbsp;&nbsp; User Profile</span
                            >
                        </router-link>
                        <button
                            class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-2 max-md:px-[0.6rem]"
                            v-on:click="logout()"
                        >
                            <i class="bi bi-box-arrow-left"></i
                            ><span class="inline max-md:hidden"
                                >&nbsp;&nbsp; Logout</span
                            >
                        </button>
                    </div>
                </div>
            </div>
            <button>
                <img
                    v-bind:src="
                        user.pic ||
                        `https://api.dicebear.com/5.x/initials/svg?seed=${user.name}&backgroundColor=3730a3&scale=83`
                    "
                    alt=""
                    class="border-2 border-indigo-200 rounded-full w-14 h-14 max-md:w-10 max-md:h-10"
                />
            </button>
        </div>
    </div>
</template>
