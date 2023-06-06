<script setup>
import { ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import { countries } from "../../lib/CountryList";

document.title = "Complete Account Info - Hireflash";

if (
    !window.sessionStorage.getItem("newuser") &&
    !window.sessionStorage.getItem("user_id")
) {
    router.replace("/auth/signup");
}

const gender = ref("");
const preferred_location = ref("");
const date_of_birth = ref("");
const nationality = ref("");
const preferred_salary = ref("");
const about = ref("");

async function toProfile() {
    const response = await fetch(baseEndpoint + "/candidate-profile", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            gender: gender.value,
            location: preferred_location.value,
            date_of_birth: date_of_birth.value,
            nationality: nationality.value,
            preferred_salary: preferred_salary.value,
            about: about.value,
            user_id: window.sessionStorage.getItem("user_id"),
        }),
    });

    if (response.status !== 201) {
        toggleToastMsg(
            "Complete account information failed. Please try again."
        );
    } else {
        window.sessionStorage.removeItem("newuser");
        window.sessionStorage.removeItem("user_id");
        router.push("/profile");
    }
}

function preventSubmit() {
    if (
        gender.value === "" &&
        preferred_location.value === "" &&
        date_of_birth.value === "" &&
        nationality.value === "" &&
        preferred_salary.value === ""
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
    <main class="bg-indigo-50 w-full min-h-screen grid place-items-center py-8">
        <form
            class="px-10 py-5 rounded-lg shadow-xl bg-gray-50 w-fit max-sm:w-11/12 max-md:px-5"
            v-on:submit.prevent="toProfile()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">
                    Complete your account info
                </h2>
                <p>Almost there!</p>
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Gender</label>
                <!-- <select
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    v-model="gender"
                >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select> -->
                <SelectCustom
                    v-model="gender"
                    heightselect="[7rem]"
                    widthselect="96"
                    placeholderval="Select gender"
                    v-bind:isdisabled="false"
                >
                    <template v-for="opt in ['Male', 'Female']">
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    gender = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    gender === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Preferred location</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="Batu Pahat, Johor"
                    v-model="preferred_location"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Date of birth</label>
                <input
                    type="date"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="15, University Street 22"
                    v-model="date_of_birth"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Nationality</label>
                <!-- <select
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    v-model="nationality"
                >
                    <OptionCountries />
                </select> -->
                <SelectCustom
                    v-model="nationality"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select nationality"
                    v-bind:isdisabled="false"
                >
                    <template v-for="opt in countries">
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    nationality = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    nationality === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Preferred Salary</label>
                <input
                    type="number"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="86400"
                    v-model="preferred_salary"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">About</label>
                <textarea
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 resize-y h-44"
                    placeholder="This is the best explanation..."
                    v-model="desc"
                ></textarea>
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
                <p>Go to Profile</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
            <button
                type="submit"
                class="w-full h-10 mt-3 rounded-md border-2 border-indigo-800 text-indigo-800 flex justify-center items-center gap-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
            >
                <p>Skip for now</p>
            </button>
            <div class="flex justify-center mt-2">
                <small><em>All input section are optional </em></small>
            </div>
        </form>
    </main>
</template>
