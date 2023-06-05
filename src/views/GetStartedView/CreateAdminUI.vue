<script setup>
import { ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import { createCookie } from "../../lib/Auth";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";

document.title = "Create Admin - Hireflash";

if (!window.sessionStorage.getItem("user_email")) {
    router.replace("/get-started");
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
const fullname = ref("");
const email = ref(window.sessionStorage.getItem("user_email"));
const password = ref("");
const confirmpassword = ref("");
const role = ref("");

async function toCreateOrg() {
    const response = await fetch(baseEndpoint + "/auth/admin", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            fullname: fullname.value,
            email: email.value,
            password: password.value,
            confirmpassword: confirmpassword.value,
            role: role.value,
        }),
    });

    const res = await response.json();
    console.log(res);

    if (response.status !== 200) {
        toggleToastMsg("Failed to continue. Please try again.");
    } else {
        fullname.value = "";
        email.value = "";
        password.value = "";
        confirmpassword.value = "";
        role.value = "";

        // Create cookie
        createCookie(
            res.data.accessToken,
            res.data.refreshToken,
            res.data.newUser.role,
            res.data.newUser.id
        );

        window.sessionStorage.setItem("user_id", res.data.newUser.id);
        window.sessionStorage.setItem("user_role", res.data.newUser.role);
        window.sessionStorage.removeItem("user_email");

        router.push("/get-started/create-organization");
    }
}

// A variable to toggle password rules, after first time on input
const afterFocusPaswd = ref(false);

// A function to shaow password rules
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
        confirmpassword.value === "" ||
        role.value === ""
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
            class="px-10 py-5 rounded-lg shadow-xl bg-gray-50 w-fit max-sm:w-11/12 max-md:px-5"
            v-on:submit.prevent="toCreateOrg()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Create an admin account</h2>
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
                    readonly
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
                <label class="mb-2 block">Confirm your password</label>
                <div class="w-full relative">
                    <input
                        v-bind:type="inputType"
                        class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                        v-model="confirmpassword"
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
                    class="text-red-500 text-sm"
                    v-show="confirmpassword !== password"
                    >Password does not match!</small
                >
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Admin Role and Ability</label>
                <SelectCustom
                    v-model="role"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select role and ability"
                    v-bind:isdisabled="false"
                >
                    <template
                        v-for="opt in ['admin', 'admin,hr', 'admin,manager']"
                    >
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-bind:modelvalue="role"
                            v-on:click="
                                () => {
                                    role = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    role === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
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
                <p>Next</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
        </form>
    </main>
</template>
