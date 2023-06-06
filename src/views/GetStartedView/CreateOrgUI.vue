<script setup>
import { ref } from "vue";
import router from "../../router";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import { countries } from "../../lib/CountryList";

document.title = "Complete Organization Info - Hireflash";

if (
    !window.sessionStorage.getItem("user_role") ||
    !window.sessionStorage.getItem("user_id")
) {
    router.replace("/get-started");
}

const orgname = ref("");
const website = ref("");
const addr1 = ref("");
const addr2 = ref("");
const postcode = ref("");
const city = ref("");
const state = ref("");
const country = ref("");
const desc = ref("");

async function toWorkspace() {
    const response = await fetch(baseEndpoint + "/company", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            name: orgname.value,
            website: website.value,
            description: desc.value,
            address_line1: addr1.value,
            address_line2: addr2.value,
            postal_code: postcode.value.toString(),
            state: state.value,
            city: city.value,
            country: country.value,
        }),
    });

    const res = await response.json();

    if (response.status !== 201) {
        toggleToastMsg("Failed to continue. Please try again.");
    } else {
        const response2 = await fetch(baseEndpoint + "/officer", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                position: window.sessionStorage.getItem("user_role"),
                user_id: window.sessionStorage.getItem("user_id"),
                company_id: res.data.id,
            }),
        });

        // const res2 = await response2.json();

        if (response2.status !== 201) {
            toggleToastMsg("Failed to continue. Please try again.");
        } else {
            orgname.value = "";
            website.value = "";
            desc.value = "";
            addr1.value = "";
            addr2.value = "";
            postcode.value = "";
            state.value = "";
            city.value = "";
            country.value = "";

            window.sessionStorage.removeItem("user_role");
            window.sessionStorage.removeItem("user_id");

            router.push("/workspace");
        }
    }
}

function preventSubmit() {
    if (
        orgname.value === "" ||
        website.value === "" ||
        addr1.value === "" ||
        postcode.value === "" ||
        city.value === "" ||
        state.value === "" ||
        country.value === "" ||
        desc.value === ""
    ) {
        return true;
    }

    // Organization name should have at least 3 character
    if (!/^.{3,}$/gm.test(orgname.value)) {
        return true;
    }

    // Website is valid character
    if (!/^https?:\/\/.*/.test(website.value)) {
        return true;
    }

    // Description should have at least 10 character
    if (!/^.{10,}$/gm.test(desc.value)) {
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
            v-on:submit.prevent="toWorkspace()"
        >
            <!-- Logo -->
            <div class="flex justify-center items-center">
                <img src="/hireflash.png" alt="" class="w-48 h-auto" />
            </div>
            <!-- Header -->
            <div class="my-8">
                <h2 class="font-semibold text-2xl">
                    Complete your organization info
                </h2>
                <p>Almost there!</p>
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Organization name</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="Hireflash Inc."
                    v-model="orgname"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Official website</label>
                <input
                    type="url"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="https://hireflash.io"
                    v-model="website"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Address Line 1</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="15, University Street 22"
                    v-model="addr1"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Address Line 2 (Optional)</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="University Park, Parit Raja"
                    v-model="addr2"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Postal code</label>
                <input
                    type="number"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="86400"
                    v-model="postcode"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Town/City</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="Batu Pahat"
                    v-model="city"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">State</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                    placeholder="Johor"
                    v-model="state"
                />
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Country</label>
                <SelectCustom
                    v-model="country"
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
                                    country = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    country === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <!-- Label and input -->
            <div class="my-2">
                <label class="mb-2 block">Description</label>
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
                <p>Start Hiring!</p>
                <i class="bi bi-arrow-right text-lg"></i>
            </button>
        </form>
    </main>
</template>
