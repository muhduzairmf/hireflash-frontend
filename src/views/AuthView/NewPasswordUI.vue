<script setup>
import { ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import Loading from "../../components/Loading.vue";

document.title = "Create New Password - Hireflash";

if (!window.sessionStorage.getItem("user_email")) {
    router.replace("/auth/forgot-password");
}

// A variable for toggling show and hide password
const inputType = ref("password");

// A function for toggling show and hide password
function togglePassword() {
    if (inputType.value === "password") {
        inputType.value = "text";
    } else if (inputType.value === "text") {
        inputType.value = "password";
    }
}

//  A variable to get input value
const newpassword = ref("");
const confirmnewpassword = ref("");

const isSubmit = ref(false);

//
async function toLogin() {
    isSubmit.value = true;

    const response = await fetch(
        baseEndpoint + "/auth/forgot-password/new-password",
        {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                email: window.sessionStorage.getItem("user_email"),
                newpassword: newpassword.value,
                confirmnewpassword: confirmnewpassword.value,
            }),
        }
    );

    const res = await response.json();

    if (response.status !== 200) {
        isSubmit.value = false;

        toggleToastMsg(res.message);
    } else {
        isSubmit.value = false;

        newpassword.value = "";
        confirmnewpassword.value = "";

        window.sessionStorage.removeItem("user_email");
        window.sessionStorage.setItem("success-change", "true");

        router.push("/auth/forgot-password/success-change");
    }
}

// A variable to toggle password rules, after first time on input
const afterFocusPaswd = ref(false);

// A function to shaow password rules
function passwordWarn() {
    if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(
            newpassword.value
        )
    ) {
        return true;
    }

    return false;
}

//
function preventSubmit() {
    if (newpassword.value === "" || confirmnewpassword.value === "") {
        return true;
    }

    if (passwordWarn()) {
        return true;
    }

    if (confirmnewpassword.value !== newpassword.value) {
        return true;
    }

    return false;
}

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
    <main class="bg-indigo-50 w-full min-h-screen grid place-items-center">
        <form
            class="px-10 py-5 w-fit rounded-lg shadow-xl bg-gray-50 max-md:w-11/12 max-md:px-5"
            v-on:submit.prevent="toLogin()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Create new password</h2>
            </div>
            <!-- Password label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your new password</label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="newpassword"
                        v-on:focus="
                            () => {
                                afterFocusPaswd = true;
                            }
                        "
                    />
                    <!-- A button for toggling show and hide password -->
                    <button
                        class="absolute top-[50%] translate-y-[-50%] right-4"
                        type="button"
                    >
                        <i
                            class="bi"
                            v-bind:class="{
                                'bi-eye-slash': inputType === 'password',
                                'bi-eye-fill': inputType === 'text',
                            }"
                            v-on:click="togglePassword()"
                        ></i>
                    </button>
                </div>
                <small
                    class="text-red-500 text-sm block max-w-[24rem]"
                    v-show="afterFocusPaswd && passwordWarn()"
                    >Password must have at least 8 characters with the
                    combination of number, lowercase and uppercase
                    letter.</small
                >
            </div>
            <!-- Confirm password label and input -->
            <div class="my-2">
                <label class="mb-2 block">Confirm your new password</label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="confirmnewpassword"
                    />
                    <!-- A button for toggling show and hide password -->
                    <button
                        class="absolute top-[50%] translate-y-[-50%] right-4"
                        type="button"
                    >
                        <i
                            class="bi"
                            v-bind:class="{
                                'bi-eye-slash': inputType === 'password',
                                'bi-eye-fill': inputType === 'text',
                            }"
                            v-on:click="togglePassword()"
                        ></i>
                    </button>
                </div>
                <small
                    class="text-red-500 text-sm block max-w-[24rem]"
                    v-show="confirmnewpassword !== newpassword"
                    >Password does not match!</small
                >
            </div>
            <!-- Button -->
            <button
                type="submit"
                class="w-full h-10 mt-6 rounded-md bg-indigo-800 text-gray-50 flex justify-center items-center gap-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                v-bind:disabled="preventSubmit()"
                v-bind:class="{
                    'disabled:cursor-not-allowed opacity-60': preventSubmit(),
                }"
                v-if="!isSubmit"
            >
                <p class="">Login</p>
                <i class="bi bi-box-arrow-in-right text-lg"></i>
            </button>
            <div class="w-full h-10 mt-6 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </form>
    </main>
</template>
