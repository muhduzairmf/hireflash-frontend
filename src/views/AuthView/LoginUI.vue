<script setup>
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import {
    baseEndpoint,
    redirectLogin,
    messageRedirect,
    afterLogin,
    continueUrl,
} from "../../stores";
import { createCookie, autoLogin } from "../../lib/Auth";
import Loading from "../../components/Loading.vue";

document.title = "Login - Hireflash";

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

//
onBeforeMount(async () => {
    await autoLogin();
});

//
if (redirectLogin.value === true) {
    toggleToastMsg(messageRedirect.value);

    setTimeout(() => {
        redirectLogin.value = false;
        messageRedirect.value = "";
    }, 3100);
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

//
const email = ref("");
const password = ref("");

const isSubmit = ref(false);

//
async function submitLogin() {
    isSubmit.value = true;

    const response = await fetch(baseEndpoint + "/auth/login", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            email: email.value,
            password: password.value,
        }),
    });

    const res = await response.json();

    if (response.status !== 200) {
        isSubmit.value = false;

        if (response.status === 404 || response.status === 401) {
            toggleToastMsg("Email or Password is invalid. Please try again.");
        } else {
            toggleToastMsg("Login failed. Please try again.");
        }
    } else {
        email.value = "";
        password.value = "";

        // Create cookie
        createCookie(
            res.data.accessToken,
            res.data.refreshToken,
            res.data.role,
            res.data.id
        );

        afterLogin.value = true;
        redirect(res.data.role);
    }
}

function redirect(role) {
    if (continueUrl.value) {
        isSubmit.value = false;

        router.push(continueUrl.value);
        return;
    }

    if (role === "applicant") {
        isSubmit.value = false;

        router.push("/profile");
    } else {
        isSubmit.value = false;

        router.push("/workspace");
    }
}

// A function to prevent submit
function preventSubmit() {
    if (email.value === "" || password.value === "") {
        return true;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email.value)) {
        return true;
    }

    return false;
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <main class="bg-indigo-50 w-full min-h-screen grid place-items-center">
        <form
            class="px-10 py-5 w-fit rounded-lg shadow-xl bg-gray-50 max-md:w-11/12 max-md:px-5"
            v-on:submit.prevent="submitLogin()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Login</h2>
                <p>Welcome back!</p>
            </div>
            <!-- Email label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your email</label>
                <input
                    type="email"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="email@example.com"
                    v-model="email"
                />
            </div>
            <!-- Password label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your password</label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="password"
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
            <!-- Loading -->
            <div class="w-full h-10 mt-6 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
            <!-- Small message -->
            <div class="flex justify-center mt-2">
                <small
                    >New to our platform?
                    <router-link
                        to="/auth/signup"
                        class="text-indigo-500 hover:underline text-xs"
                        >Create an account</router-link
                    >
                </small>
            </div>
            <div class="flex justify-center mt-2">
                <small
                    >Forgot password?
                    <router-link
                        to="/auth/forgot-password"
                        class="text-indigo-500 hover:underline text-xs"
                        >Recover here</router-link
                    >
                </small>
            </div>
        </form>
    </main>
</template>
