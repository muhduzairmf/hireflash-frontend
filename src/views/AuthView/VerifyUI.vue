<script setup>
import { ref, onMounted } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";

document.title = "Verify Forgot Password - Hireflash";

if (!window.sessionStorage.getItem("verifyId")) {
    router.replace("/auth/forgot-password");
}

const toBeFocused = ref(null);

onMounted(() => {
    toBeFocused.value.focus();
});

const num1 = ref("");
const num2 = ref("");
const num3 = ref("");
const num4 = ref("");
const num5 = ref("");
const num6 = ref("");
const verificationCode = ref("");

//
function keyupEvent(current, next, previous) {
    if (document.getElementById(current).value.length) {
        if (next !== "") {
            document.getElementById(next).focus();
        }
    } else {
        if (previous !== "") {
            document.getElementById(previous).focus();
        }
    }
}

//
async function toChangePassword() {
    verificationCode.value =
        num1.value +
        num2.value +
        num3.value +
        num4.value +
        num5.value +
        num6.value;

    const response = await fetch(
        baseEndpoint + "/auth/forgot-password/verify",
        {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                id: window.sessionStorage.getItem("verifyId"),
                verificationCode: verificationCode.value,
            }),
        }
    );

    const res = await response.json();

    if (response.status !== 200) {
    } else {
        num1.value = "";
        num2.value = "";
        num3.value = "";
        num4.value = "";
        num5.value = "";
        num6.value = "";
        verificationCode.value = "";

        window.sessionStorage.removeItem("verifyId");

        router.push("/auth/forgot-password/new-password");
    }
}

//
function preventSubmit() {
    if (
        num1.value === "" ||
        num2.value === "" ||
        num3.value === "" ||
        num4.value === "" ||
        num5.value === "" ||
        num6.value === ""
    ) {
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
            v-on:submit.prevent="toChangePassword()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Get verified</h2>
            </div>
            <!-- Email image -->
            <div class="flex justify-center items-center">
                <img src="/email-checked.png" alt="" class="w-32 h-auto mb-3" />
            </div>
            <!-- Email label and input -->
            <div class="my-2">
                <label class="mb-2 block"
                    >Enter verification code we just emailed you</label
                >
                <div class="flex gap-1 max-w-sm mx-auto">
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input1"
                        v-on:keyup="keyupEvent('input1', 'input2', '')"
                        v-model="num1"
                        placeholder="&#9913;"
                        autocomplete="off"
                        ref="toBeFocused"
                    />
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input2"
                        v-on:keyup="keyupEvent('input2', 'input3', 'input1')"
                        v-model="num2"
                        placeholder="&#9913;"
                        autocomplete="off"
                    />
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input3"
                        v-on:keyup="keyupEvent('input3', 'input4', 'input2')"
                        v-model="num3"
                        placeholder="&#9913;"
                        autocomplete="off"
                    />
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input4"
                        v-on:keyup="keyupEvent('input4', 'input5', 'input3')"
                        v-model="num4"
                        placeholder="&#9913;"
                        autocomplete="off"
                    />
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input5"
                        v-on:keyup="keyupEvent('input5', 'input6', 'input4')"
                        v-model="num5"
                        placeholder="&#9913;"
                        autocomplete="off"
                    />
                    <input
                        type="number"
                        class="w-1/4 text-center rounded-md border-2 border-gray-300 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        maxlength="1"
                        id="input6"
                        v-on:keyup="keyupEvent('input6', '', 'input5')"
                        v-model="num6"
                        placeholder="&#9913;"
                        autocomplete="off"
                    />
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
            >
                <p>Next</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
        </form>
    </main>
</template>

<style>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>
