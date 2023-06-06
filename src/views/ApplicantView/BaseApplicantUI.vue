<script setup>
import NavApplicant from "../../components/NavApplicant.vue";
import { RouterView } from "vue-router";
import router from "../../router";
import { deleteCookie, isApplicant, getRoleAndUserId } from "../../lib/Auth";
import {
    user,
    candidate_profile,
    redirectLogin,
    messageRedirect,
} from "../../stores";
import { onMounted, ref } from "vue";
import { baseEndpoint, afterLogin } from "../../stores";
import ToastMsg from "../../components/ToastMsg.vue";
import NavPublic from "../../components/NavPublic.vue";
import LoadingFull from "../../components/LoadingFull.vue";

const isLoaded = ref(false);

onMounted(async () => {
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
        if (res.message === "User id is not found.") {
            redirectLogin.value = true;
            messageRedirect.value =
                "Login session invalid. Please login to continue.";
            deleteCookie();
            router.push("/auth/login");
        } else {
            redirectLogin.value = true;
            messageRedirect.value =
                "Error occured after login. Please try again.";
            router.push("/auth/login");
        }
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

            if (afterLogin.value) {
                toggleToastMsg("Successfully logged in as " + user.value.name);
                afterLogin.value = false;
            }

            isLoaded.value = true;
        }
    }
});

function logout() {
    // Delete cookie
    deleteCookie();

    router.push("/");
}

//
const showToastMsg = ref(false);
const toastMsg = ref("");

function toggleToastMsg(msgForToast) {
    toastMsg.value = msgForToast;
    showToastMsg.value = true;

    setTimeout(() => {
        showToastMsg.value = false;
        toastMsg.value = "";
    }, 3000);
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <main class="bg-indigo-50 w-full min-h-screen relative">
        <NavApplicant v-bind:shownav="true" v-if="isLoaded" />
        <NavPublic v-bind:shownav="true" v-else />
        <section
            class="max-w-7xl mx-auto mt-12 px-4 py-2 flex gap-4 max-md:flex-col max-md:mt-6"
        >
            <div class="min-w-fit max-md:hidden">
                <div
                    class="bg-gray-50 min-w-full px-4 py-2 rounded-md shadow-lg flex flex-col gap-1 sticky top-20"
                >
                    <router-link
                        to="/job/search"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-compass"></i>&nbsp;&nbsp; Search a job
                    </router-link>
                    <router-link
                        to="/profile/notifications"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-bell"></i>&nbsp;&nbsp; Notifications
                    </router-link>
                    <router-link
                        to="/profile/user-info"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-person-badge"></i>&nbsp;&nbsp; User
                        Profile
                    </router-link>
                    <router-link
                        to="/profile/education"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-book"></i>&nbsp;&nbsp; Education
                    </router-link>
                    <router-link
                        to="/profile/work-experience"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-briefcase"></i>&nbsp;&nbsp; Work
                        experience
                    </router-link>
                    <router-link
                        to="/profile/lang-ability"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-translate"></i>&nbsp;&nbsp; Language
                        ability
                    </router-link>
                    <router-link
                        to="/profile/skill"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-hourglass-split"></i>&nbsp;&nbsp; Skill
                    </router-link>
                    <router-link
                        to="/profile/resume"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-file-earmark-text"></i>&nbsp;&nbsp;
                        Resume
                    </router-link>
                    <router-link
                        to="/profile/wishlist"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-stickies"></i>&nbsp;&nbsp; Wishlist
                    </router-link>
                    <router-link
                        to="/profile/applied-job"
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                    >
                        <i class="bi bi-folder-check"></i>&nbsp;&nbsp; Applied
                        Job
                    </router-link>
                    <button
                        class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                        v-on:click="logout()"
                    >
                        <i class="bi bi-box-arrow-left"></i>&nbsp;&nbsp; Logout
                    </button>
                </div>
            </div>
            <div class="flex-grow">
                <RouterView v-if="isLoaded" />
                <LoadingFull v-else />
            </div>
        </section>
        <br /><br /><br />
    </main>
</template>
