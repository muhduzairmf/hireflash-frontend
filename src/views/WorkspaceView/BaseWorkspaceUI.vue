<script setup>
import { RouterView } from "vue-router";
import SidebarWork from "../../components/SidebarWork.vue";
import SearchBar from "../../components/SearchBar.vue";
import router from "../../router";
import { onMounted, ref } from "vue";
import {
    user,
    company,
    officer,
    redirectLogin,
    messageRedirect,
    baseEndpoint,
    afterLogin,
    isNotWorkspace,
} from "../../stores";
import { getRoleAndUserId, isOfficer } from "../../lib/Auth";
import ToastMsg from "../../components/ToastMsg.vue";
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
        redirectLogin.value = true;
        messageRedirect.value = "Error occured after login. Please try again.";
        router.push("/auth/login");
    } else {
        user.value = res.data;

        const response2 = await fetch(
            baseEndpoint + "/officer/" + res.data.id,
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
            officer.value = res2.data;

            const response3 = await fetch(
                baseEndpoint + "/company/" + res2.data.company_id,
                {
                    method: "GET",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    // body: JSON.stringify({}),
                }
            );

            const res3 = await response3.json();

            if (response3.status !== 200) {
                redirectLogin.value = true;
                messageRedirect.value =
                    "Error occured after login. Please try again.";
                router.push("/auth/login");
            } else {
                company.value = res3.data;
                console.log(user.value, officer.value, company.value);

                if (afterLogin.value) {
                    toggleToastMsg(
                        "Successfully logged in as " + user.value.name
                    );
                    afterLogin.value = false;
                }

                isLoaded.value = true;
            }
        }
    }
});

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
    <main class="bg-indigo-50 w-full min-h-screen">
        <section class="flex" v-if="isLoaded">
            <div class="min-w-fit">
                <SidebarWork />
            </div>
            <div class="flex-grow h-screen overflow-y-scroll" id="main-section">
                <template v-if="isNotWorkspace">
                    <SearchBar />
                </template>
                <RouterView />
            </div>
        </section>
        <LoadingFull v-else />
    </main>
</template>
