<script setup>
import { ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";

document.title = "Get Started - Hireflash";

const email = ref("");

const isSubmit = ref(false);

//
async function toVerify() {
    isSubmit.value = true;

    const response = await fetch(baseEndpoint + "/auth/get-started/email", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            email: email.value,
        }),
    });

    const res = await response.json();

    if (response.status !== 200) {
        isSubmit.value = false;

        toggleToastMsg("Failed to continue. Please try again.");
    } else {
        const data = {
            service_id: import.meta.env.VITE_EMAILJS_SERVICEID,
            template_id: import.meta.env.VITE_EMAILJS_TEMPLATEID,
            user_id: import.meta.env.VITE_EMAILJS_USERID,
            accessToken: import.meta.env.VITE_EMAILJS_ACCESSTOKEN,
            template_params: {
                subject: "Verification Code",
                content: `Your verification code is ${res.data.verificationCode}. \n\n Please do not share with others.`,
                receiverEmail: email.value,
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

                    window.sessionStorage.setItem("verifyId", res.data.id);
                    window.sessionStorage.setItem("user_email", email.value);

                    email.value = "";

                    router.push("/get-started/verify");
                } else {
                    toggleToastMsg(
                        "Failed to send verification code to given email."
                    );
                    throw new Error("Request failed.");
                }
            })
            .catch((error) => {
                toggleToastMsg(
                    "Failed to send verification code to given email."
                );
                console.log("Oops... " + error.message);
            });
    }
}

//
function preventSubmit() {
    if (email.value === "") {
        return true;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email.value)) {
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
    <main class="bg-indigo-50 w-full min-h-screen grid place-items-center">
        <form
            class="px-10 py-5 rounded-lg shadow-xl bg-gray-50 w-fit max-sm:w-11/12 max-md:px-5"
            v-on:submit.prevent="toVerify()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">Let's get started!</h2>
                <p>Create an organization account</p>
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
                <p>Next</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
            <div class="w-full h-10 mt-6 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </form>
    </main>
</template>
