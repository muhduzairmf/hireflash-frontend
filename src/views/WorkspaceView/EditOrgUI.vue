<script setup>
import OptionCountries from "../../components/OptionCountries.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { ref } from "vue";
import { baseEndpoint, company } from "../../stores";
import router from "../../router";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import { countries } from "../../lib/CountryList";
import DialogModal from "../../components/DialogModal.vue";
import ToastMsg from "../../components/ToastMsg.vue";

document.title = "Edit Organization - Hireflash";

const orgname = ref(company.value.name);
const website = ref(company.value.website);
const addr1 = ref(company.value.address_line1);
const addr2 = ref(company.value.address_line2);
const postcode = ref(company.value.postal_code);
const city = ref(company.value.city);
const state = ref(company.value.state);
const country = ref(company.value.country);
const desc = ref(company.value.desc);

async function submitEditOrg() {
    const response = await fetch(
        baseEndpoint + "/company/" + company.value.id,
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                name: orgName,
                website: website,
                description: desc,
                address_line1: addr1,
                address_line2: addr2,
                postal_code: postcode,
                state: state,
                city: city,
                country: country,
            }),
        }
    );

    const res = await response.json();

    if (response.status !== 200) {
        toggleToastMsg(
            "Failed to update new information about this organization. Please try again."
        );
    } else {
        changeReadAvailability();

        toggleToastMsg("Successfully modified this organization info.");
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

const isReadOnly = ref(true);
const btnName = ref("Edit Detail");
const cannotSave = ref(true);

function changeReadAvailability() {
    isReadOnly.value = !isReadOnly.value;
    cannotSave.value = !cannotSave.value;

    if (btnName.value === "Edit Detail") {
        btnName.value = "Cancel";
    } else if (btnName.value === "Cancel") {
        btnName.value = "Edit Detail";
    }
}

const btnLabel = ref("Continue to delete");
const hideDeleteSection = ref(true);

const orgName = ref("");
const orgWebsite = ref("");

function toggleDeleteSection() {
    hideDeleteSection.value = !hideDeleteSection.value;

    if (btnLabel.value === "Continue to delete") {
        btnLabel.value = "Cancel";
    } else if (btnLabel.value === "Cancel") {
        btnLabel.value = "Continue to delete";
        orgName.value = "";
        orgWebsite.value = "";
    }
}

// function deleteOrganization() {

// }

const isOpenUpload = ref(false);

function toggleModelUpload() {
    isOpenUpload.value = !isOpenUpload.value;
}

const isOpenDefault = ref(false);

function toggleModalDefault() {
    isOpenDefault.value = !isOpenDefault.value;
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
                <TitleBorder title="Edit Organization Info" />
            </div>
            <div
                class="mt-4 flex items-center gap-4 max-md:flex-col max-md:items-start"
            >
                <img
                    v-bind:src="company.pic"
                    alt=""
                    class="border-2 border-indigo-200 rounded-md w-28 h-28"
                />
                <div class="flex flex-col gap-2">
                    <div class="flex gap-4">
                        <button
                            class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModalDefault()"
                        >
                            Set Default
                        </button>
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModelUpload()"
                        >
                            Upload new
                        </button>
                    </div>
                    <small class="text-gray-500"
                        >Support JPG and PNG. Max file size 3MB. Make sure image
                        scale is 1x1</small
                    >
                </div>
            </div>
            <form v-on:submit.prevent="submitEditOrg()">
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Organization Name</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Hireflash Inc."
                        v-model="orgname"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Official Website</label>
                    <input
                        type="url"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="https://hireflash.io"
                        v-model="website"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Address Line 1</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="15, University Street 22"
                        v-model="addr1"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Address Line 2 (Optional)</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="University Park, Parit Raja"
                        v-model="addr2"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Postal Code</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="86400"
                        v-model="postcode"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Town/City</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Batu Pahat"
                        v-model="city"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">State</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Johor"
                        v-model="state"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Country</label>
                    <SelectCustom
                        v-model="country"
                        heightselect="40"
                        widthselect="full"
                        placeholderval="Choose recruitment status"
                        v-bind:isdisabled="isReadOnly"
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
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Description</label>
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 resize-y h-44 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="This is the best explanation..."
                        v-model="desc"
                        v-bind:disabled="isReadOnly"
                        v-bind:class="{
                            'disabled:cursor-not-allowed': isReadOnly,
                        }"
                    ></textarea>
                </div>
                <div class="mt-6 flex gap-2">
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        type="button"
                        v-on:click="changeReadAvailability()"
                    >
                        {{ btnName }}
                    </button>
                    <button
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        type="submit"
                        v-bind:disabled="cannotSave || preventSubmit()"
                        v-bind:class="{
                            'disabled:cursor-not-allowed opacity-60':
                                cannotSave || preventSubmit(),
                        }"
                    >
                        Save
                    </button>
                </div>
            </form>
            <br />
            <div class="mb-8">
                <TitleBorder title="Delete this organization" />
                <div class="mt-4">
                    <label class="mb-2 block"
                        >Once you delete an organization, there is no going
                        back. Please be certain.</label
                    >
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1 mt-2"
                        v-on:click="toggleDeleteSection()"
                    >
                        {{ btnLabel }}
                    </button>
                </div>
                <form
                    v-on:submit.prevent="() => {}"
                    v-bind:class="{ hidden: hideDeleteSection }"
                >
                    <p class="font-semibold mt-4">
                        This action cannot be undone. This will permanently
                        delete your organization info and other information
                        associated to your organization. Are you absolutely
                        sure?
                    </p>
                    <div class="mt-4">
                        <label class="mb-2 block"
                            >Please type the organization name and official
                            website to confirm your action</label
                        >
                        <input
                            type="text"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            v-bind:placeholder="company.name"
                            v-model="orgName"
                        />
                        <br />
                        <input
                            type="url"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            v-bind:placeholder="company.website"
                            v-model="orgWebsite"
                        />
                    </div>
                    <div class="mt-6">
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleDeleteSection()"
                            v-bind:disabled="
                                orgName !== company.name ||
                                orgWebsite !== company.website
                            "
                            v-bind:class="{
                                'disabled:cursor-not-allowed opacity-60':
                                    orgName !== company.name ||
                                    orgWebsite !== company.website,
                            }"
                        >
                            I understand the consequences, delete this
                            organization
                        </button>
                    </div>
                </form>
            </div>
            <br />
        </div>
        <br />
        <DialogModal
            v-on:toggle="toggleModelUpload()"
            v-show="isOpenUpload"
            modaltype="small"
        >
            <br />
            <div
                class="p-60 max-xl:p-40 max-md:p-20 grid place-items-center border-2 border-indigo-200 rounded-md"
            >
                <button
                    class="flex flex-col items-center rounded-md bg-indigo-200 hover:bg-indigo-100 p-4"
                    v-on:click="
                        () => {
                            toggleModelUpload();
                            uploadNewProfileImg();
                        }
                    "
                >
                    <h1 class="text-4xl">
                        <i class="bi bi-file-earmark-plus"></i>
                    </h1>
                    <p>Click or drag your file here</p>
                </button>
            </div>
        </DialogModal>
        <DialogModal
            v-on:toggle="toggleModalDefault()"
            v-show="isOpenDefault"
            modaltype="small"
        >
            <br class="mb-2" />
            <p>Set your picture to default settings?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="setDefaultProfileImg()"
                >
                    Yes
                </button>
                <button
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="toggleModalDefault()"
                >
                    Cancel
                </button>
            </div>
        </DialogModal>
    </div>
</template>
