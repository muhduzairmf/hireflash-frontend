<script setup>
import { onBeforeMount, ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import { autoLogin, createCookie } from "../../lib/Auth";

document.title = "Sign Up - Hireflash";

onBeforeMount(async () => {
    await autoLogin();
});

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
const fullname = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");

const disableEmail = ref(false);

const inviteToken = router.currentRoute.value.query.token;
const role_id = router.currentRoute.value.query.role;
const company_id = router.currentRoute.value.query.invite;

if (router.currentRoute.value.query.email) {
    email.value = router.currentRoute.value.query.email;
    disableEmail.value = true;
}

if (inviteToken !== "" && role_id !== "" && email.value !== "") {
    // Get the current URL
    const currentUrl = window.location.href;

    // Create a URL object from the current URL
    const url = new URL(currentUrl);

    // Clear or remove query parameters
    url.search = "";

    // Get the modified URL without query parameters
    const modifiedUrl = url.toString();

    // Update the browser history without refreshing
    history.pushState({}, "", modifiedUrl);
}

// A function to submit sign up form
async function submitSignUp() {
    const response = await fetch(baseEndpoint + "/auth/signup", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            fullname: fullname.value,
            email: email.value,
            password: password.value,
            confirmpassword: confirmpassword.value,
            inviteToken: inviteToken,
            role_id: role_id,
        }),
    });

    const res = await response.json();
    console.log(res);

    if (response.status !== 201) {
        toggleToastMsg("Signup failed. Please try again.");
    } else {
        email.value = "";
        password.value = "";

        // Create cookie
        createCookie(
            res.data.accessToken,
            res.data.refreshToken,
            res.data.newUser.role,
            res.data.newUser.id
        );

        await redirect(res.data.newUser);
    }
}

async function redirect(newUser) {
    if (newUser.role === "applicant") {
        window.sessionStorage.setItem("newuser", "true");
        window.sessionStorage.setItem("user_id", newUser.id);
        afterFocusPaswd.value = false;
        router.push("/auth/signup/complete-info");
    } else {
        const response = await fetch(baseEndpoint + "/officer", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                position: newUser.role,
                user_id: newUser.id,
                company_id: company_id,
            }),
        });

        if (response.status !== 201) {
            toggleToastMsg("Signup failed. Please try again.");
        } else {
            afterFocusPaswd.value = false;
            router.push("/workspace");
        }
    }
}

// A variable to toggle password rules, after first time on input
const afterFocusPaswd = ref(false);

// A function to show password rules
function passwordWarn() {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password.value)) {
        return true;
    }

    return false;
}

// A function to prevent submit
function preventSubmit() {
    if (
        fullname.value === "" ||
        email.value === "" ||
        password.value === "" ||
        confirmpassword.value === ""
    ) {
        return true;
    }

    if (!/^.+$/.test(fullname.value)) {
        return true;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email.value)) {
        return true;
    }

    if (passwordWarn()) {
        return true;
    }

    if (confirmpassword.value !== password.value) {
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
            v-on:submit.prevent="submitSignUp()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Sign Up</h2>
                <p>Journey starts here!</p>
            </div>
            <!-- Full name label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your full name</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="John Smith"
                    v-model="fullname"
                />
            </div>
            <!-- Email label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your email</label>
                <input
                    type="email"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="email@example.com"
                    v-model="email"
                    v-bind:disabled="disableEmail"
                    v-bind:class="{
                        'disabled:cursor-not-allowed': disableEmail,
                    }"
                />
            </div>
            <!-- Password label and input -->
            <div class="my-2">
                <label class="mb-2 block">Enter your password </label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="password"
                        v-on:focus="
                            () => {
                                afterFocusPaswd = true;
                            }
                        "
                    />
                    <!-- A button for toggling show and hide password -->
                    <span
                        class="absolute top-[50%] translate-y-[-50%] right-4 cursor-pointer"
                    >
                        <i
                            class="bi"
                            v-bind:class="{
                                'bi-eye-slash': inputType === 'password',
                                'bi-eye-fill': inputType === 'text',
                            }"
                            v-on:click="togglePassword()"
                        ></i>
                    </span>
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
                <label class="mb-2 block">Confirm your password</label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="confirmpassword"
                    />
                    <!-- A button for toggling show and hide password -->
                    <span
                        class="absolute top-[50%] translate-y-[-50%] right-4 cursor-pointer"
                    >
                        <i
                            class="bi"
                            v-bind:class="{
                                'bi-eye-slash': inputType === 'password',
                                'bi-eye-fill': inputType === 'text',
                            }"
                            v-on:click="togglePassword()"
                        ></i>
                    </span>
                </div>
                <small
                    class="text-red-500 text-sm"
                    v-show="confirmpassword !== password"
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
            >
                <p class="">Sign Up</p>
                <i class="bi bi-box-arrow-in-right text-lg"></i>
            </button>
            <!-- Small message -->
            <div class="flex justify-center mt-2">
                <small
                    >Already have an account?
                    <router-link
                        to="/auth/login"
                        class="text-indigo-500 hover:underline text-xs"
                        >Login instead</router-link
                    >
                </small>
            </div>
        </form>
    </main>
</template>
