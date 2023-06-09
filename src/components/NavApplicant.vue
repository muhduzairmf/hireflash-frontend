<script setup>
import router from "../router";
import { onMounted, ref } from "vue";
import { deleteCookie, getRoleAndUserId } from "../lib/Auth";
import {
    user,
    baseEndpoint,
    candidate_profile,
    isAuthenticated,
    redirectLogin,
    messageRedirect,
} from "../stores";

const isLoaded = ref(false);

onMounted(async () => {
    if (!isAuthenticated.value) {
        return;
    }

    const { user_id } = getRoleAndUserId();

    const response = await fetch(baseEndpoint + "/user/" + user_id, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });

    const res = await response.json();

    if (response.status !== 200) {
        redirectLogin.value = true;
        messageRedirect.value = "Error occured after login. Please try again.";
        router.push("/auth/login");
    } else {
        user.value = res.data;

        const response2 = await fetch(
            baseEndpoint + "/candidate-profile/" + res.data.id,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                // body: JSON.stringify({}),
            }
        );

        const res2 = await response2.json();

        if (response2.status !== 200) {
            redirectLogin.value = true;
            messageRedirect.value =
                "Error occured after login. Please try again.";
            router.push("/auth/login");
        } else {
            candidate_profile.value = res2.data;

            isLoaded.value = true;
        }
    }
});

function logout() {
    // Delete cookie
    deleteCookie();

    router.push("/");
}

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
                            v-bind:src="
                                user.pic ||
                                `https://api.dicebear.com/5.x/initials/svg?seed=` +
                                    user.name +
                                    `&backgroundColor=3730a3&scale=83`
                            "
                            alt=""
                            class="border-2 border-indigo-200 rounded-full w-9 h-9"
                        />
                        <p>{{ user.name }}</p>
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
                                to="/profile/user-info"
                                class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                            >
                                <i class="bi bi-person-badge"></i>&nbsp;&nbsp;
                                User Profile
                            </router-link>
                            <button
                                class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                v-on:click="logout()"
                            >
                                <i class="bi bi-box-arrow-left"></i>&nbsp;&nbsp;
                                Logout
                            </button>
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
                    class="bi px-2 py-1 text-xl text-indigo-800 hover:bg-indigo-800 hover:text-white rounded-md hover:shadow-lg"
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
                    class="bi px-2 py-1 text-xl text-indigo-800 hover:bg-indigo-800 hover:text-white rounded-md hover:shadow-lg"
                    v-bind:class="{
                        'bi-list': sidebarHidden,
                        'bi-x-lg': !sidebarHidden,
                    }"
                ></i>
            </button>
        </div>
        <div class="flex flex-col h-full justify-center text-base">
            <button
                v-on:click="
                    () => {
                        router.push('/profile/user-info');
                    }
                "
                class="mb-4 flex flex-col"
            >
                <div class="flex items-center gap-3 mb-2">
                    <img
                        v-bind:src="
                            `https://api.dicebear.com/5.x/initials/svg?seed=` +
                            user.name +
                            `&backgroundColor=3730a3&scale=83`
                        "
                        alt=""
                        class="border-2 border-indigo-200 rounded-full w-16 h-16 block"
                    />
                    <h3 class="font-medium text-2xl hover:underline">
                        {{ user.name }}
                    </h3>
                </div>
                <div
                    class="mt-2 w-full border-t-[1.5px] border-indigo-200"
                ></div>
            </button>
            <router-link
                to="/profile/education"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-book"></i>&nbsp;&nbsp; Education
            </router-link>
            <router-link
                to="/profile/work-experience"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-briefcase"></i>&nbsp;&nbsp; Work experience
            </router-link>
            <router-link
                to="/profile/lang-ability"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-translate"></i>&nbsp;&nbsp; Language ability
            </router-link>
            <router-link
                to="/profile/skill"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-hourglass-split"></i>&nbsp;&nbsp; Skill
            </router-link>
            <router-link
                to="/profile/resume"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-file-earmark-text"></i>&nbsp;&nbsp; Resume
            </router-link>
            <router-link
                to="/profile/wishlist"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-stickies"></i>&nbsp;&nbsp; Wishlist
            </router-link>
            <router-link
                to="/profile/applied-job"
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="toggleSidebar()"
            >
                <i class="bi bi-folder-check"></i>&nbsp;&nbsp; Applied Job
            </router-link>
            <button
                class="py-3 px-6 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                v-on:click="logout()"
            >
                <i class="bi bi-box-arrow-left"></i>&nbsp;&nbsp; Logout
            </button>
            <br /><br />
        </div>
    </nav>
    <nav
        class="hidden max-md:flex justify-around items-center fixed bg-gray-50 w-screen px-1 py-2 z-10 bottom-0"
        style="
            box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1),
                0 -2px 4px -2px rgb(0 0 0 / 0.1);
        "
        v-show="showNav"
    >
        <router-link
            to="/profile/applied-job"
            class="py-1 px-4 rounded-md hover:shadow-inner"
        >
            <i class="bi bi-folder-check text-lg"></i>
        </router-link>
        <router-link
            to="/profile/wishlist"
            class="py-1 px-4 rounded-md hover:shadow-inner"
        >
            <i class="bi bi-stickies text-lg"></i>
        </router-link>
        <router-link
            to="/job/search"
            class="py-1 px-4 rounded-md hover:shadow-inner"
        >
            <i class="bi bi-compass text-lg"></i>
        </router-link>
        <router-link
            to="/profile/notifications"
            class="py-1 px-4 rounded-md hover:shadow-inner"
        >
            <i class="bi bi-bell text-lg"></i>
        </router-link>
        <router-link
            to="/profile/user-info"
            class="py-1 px-4 rounded-md hover:shadow-inner"
        >
            <i class="bi bi-person-badge text-lg"></i>
        </router-link>
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
