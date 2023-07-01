<script setup>
import { ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint, company } from "../../stores";
import ToastMsg from "../../components/ToastMsg.vue";
import Loading from "../../components/Loading.vue";
import router from "../../router";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";

document.title = "Add Officer - Hireflash";

const officerEmail = ref("");
const role = ref("");
const codenameRole = ref("");
const inviteLink = ref("");
const hideLoading = ref(true);

const isSubmit = ref(false);

async function sendInvite() {
    isSubmit.value = true;

    const response = await fetch(baseEndpoint + "/auth/link", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            email: officerEmail.value,
            role: codenameRole.value,
            company_id: company.value.id,
            sendEmail: true,
        }),
    });

    const res = await response.json();

    if (response.status !== 201) {
        isSubmit.value = false;

        toggleToastMsg("Invitation link failed to send. Please try again.");
    } else {
        const data = {
            service_id: import.meta.env.VITE_EMAILJS_SERVICEID,
            template_id: import.meta.env.VITE_EMAILJS_TEMPLATEID,
            user_id: import.meta.env.VITE_EMAILJS_USERID,
            accessToken: import.meta.env.VITE_EMAILJS_ACCESSTOKEN,
            template_params: {
                subject: "Invitation Link",
                content: `Admin has invited you to join ${company.value.name} \n\n ${res.data.link} \n\n Please ignore this email if it is not dedicated for you.`,
                receiverEmail: officerEmail.value,
            },
        };

        fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (response.ok) {
                    isSubmit.value = false;

                    toggleToastMsg(res.message);
                } else {
                    isSubmit.value = false;

                    toggleToastMsg(
                        "Invitation link failed to send. Please try again."
                    );
                    throw new Error("Request failed.");
                }
            })
            .catch((error) => {
                isSubmit.value = false;

                toggleToastMsg(
                    "Invitation link failed to send. Please try again."
                );
                console.log("Oops... " + error.message);
            });
    }
}

async function generateLink() {
    hideLoading.value = false;
    const response = await fetch(baseEndpoint + "/auth/link", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            email: officerEmail.value,
            role: codenameRole.value,
            company_id: company.value.id,
            sendEmail: false,
        }),
    });

    const res = await response.json();

    if (response.status !== 201) {
        toggleToastMsg("Invitation link failed to generate. Please try again.");
        hideLoading.value = true;
    } else {
        inviteLink.value = res.data.link;
        toggleToastMsg(res.message);
        hideLoading.value = true;
    }
}

function preventSubmit() {
    if (officerEmail.value === "") {
        return true;
    }

    if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(officerEmail.value)
    ) {
        return true;
    }

    if (role.value === "") {
        return true;
    }

    return false;
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
            <div class="mt-4">
                <TitleBorder title="Add Officer" />
            </div>
            <div class="mt-4">
                <p>
                    You can add officer for this organization through invitation
                    link. You can choose either only
                    <span class="bg-indigo-300">generate link</span>
                    or
                    <span class="bg-indigo-300">automatically send</span>
                    to officer's email.
                </p>
                <p class="mt-2">
                    Thus, enter the officer email (preferably official
                    organization email), and define the role of that officer you
                    want to add.
                </p>
            </div>
            <div class="mt-4 max-w-lg">
                <label class="mb-2 block">Role</label>
                <SelectCustom
                    v-model="role"
                    heightselect="40"
                    widthselect="full"
                    placeholderval="Choose recruitment status"
                    v-bind:isdisabled="false"
                >
                    <template
                        v-for="opt in [
                            { val: 'manager', disp: 'Hiring Manager' },
                            { val: 'hr', disp: 'HR Officer' },
                            { val: 'guest', disp: 'Guest' },
                        ]"
                    >
                        <OptionCustom
                            v-bind:optionvalue="opt.disp"
                            v-on:click="
                                () => {
                                    codenameRole = opt.val;
                                    role = opt.disp;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    codenameRole === opt.val,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <div class="mt-4 max-w-lg">
                <label class="mb-2 block">Email</label>
                <input
                    type="email"
                    class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="email@example.com"
                    v-model="officerEmail"
                />
            </div>
            <div class="mt-6 flex gap-2 max-md:flex-col" v-if="!isSubmit">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    type="button"
                    v-bind:disabled="preventSubmit()"
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            preventSubmit(),
                    }"
                    v-on:click="sendInvite()"
                >
                    Send
                </button>
                <button
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    type="button"
                    v-bind:disabled="preventSubmit()"
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            preventSubmit(),
                    }"
                    v-on:click="generateLink()"
                >
                    Generate link
                </button>
            </div>
            <div class="mt-6 flex gap-2 max-md:flex-col" v-else>
                <Loading color="indigo" />
            </div>
            <div class="mt-8 max-w-lg">
                <label class="mb-2 block">Invitation Link</label>
                <input
                    type="url"
                    class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="email@example.com"
                    readonly
                    v-model="inviteLink"
                    v-bind:class="{ hidden: !hideLoading }"
                    title="Triple click select link. Then, you can copy it."
                />
                <div v-bind:class="{ hidden: hideLoading }">
                    <Loading color="indigo" />
                </div>
            </div>
            <br />
        </div>
        <br />
    </div>
</template>
