<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint, user, officer } from "../../stores";
import router from "../../router";
import { getFullRole } from "../../lib/Auth";
import DialogModal from "../../components/DialogModal.vue";
import FileUploader from "../../components/FileUploader.vue";

document.title = "User Profile - Hireflash";

const imgSrc = ref(
    user.value.pic ||
        `https://api.dicebear.com/5.x/initials/svg?seed=${user.value.name}&backgroundColor=3730a3&scale=83`
);
const position = ref(getFullRole(officer.value.position));
const fullname = ref(user.value.name);
const email = ref(user.value.email);
const currentpassword = ref("");
const newpassword = ref("");
const confirmnewpassword = ref("");

console.log(user.value, officer.value);

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

async function setDefaultProfileImg() {
    const response = await fetch(
        baseEndpoint + "/user/" + user.value.id + "/pic",
        {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg(
            "Failed to change profile image to default. Please try again."
        );
    } else {
        imgSrc.value = `https://api.dicebear.com/5.x/initials/svg?seed=${user.value.name}&backgroundColor=3730a3&scale=83`;
        user.value.pic = imgSrc.value;

        toggleModalDefault();

        toggleToastMsg("Profile image has been change to default.");
    }
}

async function uploadNewProfileImg(path) {
    const response = await fetch(
        baseEndpoint + "/user/" + user.value.id + "/pic",
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                path: path,
            }),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg("Failed to upload new profile image. Please try again.");
    } else {
        imgSrc.value = path;
        user.value.pic = imgSrc.value;

        toggleModelUpload();

        toggleToastMsg("Profile image has been updated.");
    }
}

async function saveUserInfo() {
    const response = await fetch(
        baseEndpoint + "/user/" + user.value.id + "/info",
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                email: email.value,
                name: fullname.value,
            }),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg("Failed to update user information. Please try again.");
    } else {
        user.value = res.data;
        imgSrc.value =
            user.value.pic ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${user.value.name}&backgroundColor=3730a3&scale=83`;

        changeReadAvailability();

        toggleToastMsg("User information has been updated.");
    }
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

async function saveNewPassword() {
    const response = await fetch(
        baseEndpoint + "/user/" + user.value.id + "/password",
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                currentpassword: currentpassword.value,
                newpassword: newpassword.value,
                confirmnewpassword: confirmnewpassword.value,
            }),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg("Failed to update your password. Please try again.");
    } else {
        currentpassword.value = "";
        newpassword.value = "";
        confirmnewpassword.value = "";
        afterFocusPaswd.value = false;
        toggleToastMsg("New password has been updated.");
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
function preventSubmitChangePassword() {
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

const btnLabel = ref("Continue to delete");
const hideDeleteSection = ref(true);

const accEmail = ref("");
const accPassword = ref("");

function toggleDeleteSection() {
    hideDeleteSection.value = !hideDeleteSection.value;

    if (btnLabel.value === "Continue to delete") {
        btnLabel.value = "Cancel";
    } else if (btnLabel.value === "Cancel") {
        btnLabel.value = "Continue to delete";
        accEmail.value = "";
        accPassword.value = "";
    }
}

async function deleteUser() {
    const response = await fetch(baseEndpoint + "/user/" + user.value.id, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg("Failed to delete your account. Please try again.");
    } else {
        toggleModalDeleted();
    }
}

const isOpenUpload = ref(false);

function toggleModelUpload() {
    isOpenUpload.value = !isOpenUpload.value;
}

const isOpenDefault = ref(false);

function toggleModalDefault() {
    isOpenDefault.value = !isOpenDefault.value;
}

const isOpenDeleted = ref(false);

function toggleModalDeleted() {
    isOpenDeleted.value = !isOpenDeleted.value;
}

const file = ref({});
const successUpload = ref(false);

function handleUploaderEvent(e) {
    const { data: uploadedFiles } = e.detail;
    file.value = uploadedFiles;
    console.log(e.detail);

    successUpload.value = true;
    setTimeout(5000, () => {
        successUpload.value = false;
    });
}

window.addEventListener("LR_UPLOAD_FINISH", async (e) => {
    const dataUpload = e.detail.data[0];
    await uploadNewProfileImg(dataUpload.cdnUrl + dataUpload.name);
});
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <div class="mb-8">
                <TitleBorder title="User Profile" />
                <!-- Profile image -->
                <div
                    class="mt-4 flex items-center gap-4 max-md:flex-col max-md:items-start"
                >
                    <img
                        v-bind:src="imgSrc"
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
                        <small class="text-gray-400"
                            >Support JPG and PNG. Max file size 3MB. Make sure
                            image scale is 1x1</small
                        >
                    </div>
                </div>
                <!-- User information form -->
                <form v-on:submit.prevent="saveUserInfo()">
                    <div class="mt-4">
                        <label class="mb-2 block">Role</label>
                        <input
                            type="text"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            v-model="position"
                            v-bind:readonly="!isReadOnly"
                            v-bind:disabled="isReadOnly"
                            v-bind:class="{
                                'disabled:cursor-not-allowed': isReadOnly,
                            }"
                        />
                    </div>
                    <div class="mt-4">
                        <label class="mb-2 block">Full Name</label>
                        <input
                            type="text"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            placeholder="John Smith"
                            v-model="fullname"
                            v-bind:disabled="isReadOnly"
                            v-bind:class="{
                                'disabled:cursor-not-allowed': isReadOnly,
                            }"
                        />
                    </div>
                    <div class="mt-4">
                        <label class="mb-2 block">Email</label>
                        <input
                            type="email"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            placeholder="email@example.com"
                            v-model="email"
                            v-bind:disabled="isReadOnly"
                            v-bind:class="{
                                'disabled:cursor-not-allowed': isReadOnly,
                            }"
                        />
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
                            v-bind:disabled="cannotSave"
                            v-bind:class="{
                                'disabled:cursor-not-allowed opacity-60':
                                    cannotSave,
                            }"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div class="mb-8">
                <TitleBorder title="Change Password" />
                <!-- Change password form -->
                <form v-on:submit.prevent="saveNewPassword()">
                    <div class="mt-4">
                        <label class="mb-2 block">Current Password</label>
                        <div class="w-96 max-md:w-full relative">
                            <input
                                v-bind:type="inputType"
                                class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                                placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                                v-model="currentpassword"
                            />
                            <!-- A button for toggling show and hide password -->
                            <button
                                class="absolute top-[50%] translate-y-[-50%] right-4"
                                type="button"
                            >
                                <i
                                    class="bi"
                                    v-bind:class="{
                                        'bi-eye-slash':
                                            inputType === 'password',
                                        'bi-eye-fill': inputType === 'text',
                                    }"
                                    v-on:click="togglePassword()"
                                ></i>
                            </button>
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="mb-2 block">New Password</label>
                        <div class="w-96 max-md:w-full relative">
                            <input
                                v-bind:type="inputType"
                                class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
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
                                        'bi-eye-slash':
                                            inputType === 'password',
                                        'bi-eye-fill': inputType === 'text',
                                    }"
                                    v-on:click="togglePassword()"
                                ></i>
                            </button>
                        </div>
                        <small
                            class="text-red-500 text-sm"
                            v-show="afterFocusPaswd && passwordWarn()"
                            >Password must have at least 8 characters with the
                            combination of number, lowercase and uppercase
                            letter.</small
                        >
                    </div>
                    <div class="mt-4">
                        <label class="mb-2 block">Confirm New Password</label>
                        <div class="w-96 max-md:w-full relative">
                            <input
                                v-bind:type="inputType"
                                class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
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
                                        'bi-eye-slash':
                                            inputType === 'password',
                                        'bi-eye-fill': inputType === 'text',
                                    }"
                                    v-on:click="togglePassword()"
                                ></i>
                            </button>
                        </div>
                        <small
                            class="text-red-500 text-sm"
                            v-show="confirmnewpassword !== newpassword"
                            >Password does not match!</small
                        >
                    </div>
                    <div class="mt-6 flex gap-2">
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            type="submit"
                            v-on:click="saveNewPassword()"
                            v-bind:disabled="preventSubmitChangePassword()"
                            v-bind:class="{
                                'disabled:cursor-not-allowed opacity-60':
                                    preventSubmitChangePassword(),
                            }"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
            <div class="mb-8">
                <TitleBorder title="Delete this account" />
                <div class="mt-4">
                    <label class="mb-2 block"
                        >Once you delete an account, there is no going back.
                        Please be certain.</label
                    >
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1 mt-2"
                        v-on:click="toggleDeleteSection()"
                    >
                        {{ btnLabel }}
                    </button>
                </div>
                <form
                    v-on:submit.prevent="deleteUser()"
                    v-bind:class="{ hidden: hideDeleteSection }"
                >
                    <p class="font-semibold mt-4">
                        This action cannot be undone. This will permanently
                        delete your account info and other information
                        associated to your account. Are you absolutely sure?
                    </p>
                    <div class="mt-4">
                        <label class="mb-2 block"
                            >Please type your email and password to confirm your
                            action</label
                        >
                        <input
                            type="email"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            placeholder="email@example.com"
                            v-model="accEmail"
                        />
                        <br />
                        <input
                            type="password"
                            class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                            placeholder="&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;&#9913;"
                            v-model="accPassword"
                        />
                    </div>
                    <div class="mt-6">
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleDeleteSection()"
                            v-bind:disabled="
                                accEmail !== user.email && accPassword === ''
                            "
                            v-bind:class="{
                                'disabled:cursor-not-allowed opacity-60':
                                    accEmail !== user.email ||
                                    accPassword === '',
                            }"
                        >
                            I understand the consequences, delete this account
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <br />
        <DialogModal
            v-on:toggle="toggleModelUpload()"
            v-show="isOpenUpload"
            modaltype="small"
        >
            <br />
            <div
                class="h-[80vh] w-[75vw] max-md:w-screen flex flex-col gap-2 justify-center border-2 border-indigo-200 rounded-md"
            >
                <FileUploader v-on:upload="handleUploaderEvent" />
                <p class="text-center" v-if="successUpload">
                    Successfully uploaded your resume. You can close the modal
                    dialog.
                </p>
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
        <DialogModal
            v-on:toggle="toggleModalDeleted()"
            v-show="isOpenDeleted"
            modaltype="small"
        >
            <br class="mb-2" />
            <p>
                Your account was successfully deleted. Thank you for using
                Hireflash.
            </p>
            <div class="mt-6 flex gap-2">
                <router-link
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    to="/"
                >
                    Ok
                </router-link>
            </div>
        </DialogModal>
    </div>
</template>
