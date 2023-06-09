<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { baseEndpoint, candidate_profile } from "../../stores";
import PdfRenderer from "../../components/PdfRenderer.vue";
import FileUploader from "../../components/FileUploader.vue";
import Loading from "../../components/Loading.vue";
import * as LR from "@uploadcare/blocks";

LR.registerBlocks(LR);

document.title = "Resume - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/resume/" + candidate_profile.value.id,
        {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        if (res.message === "Resume not found.") {
            isLoaded.value = true;
        } else {
            alert("error occured");
        }
    } else {
        resume.value = res.data;

        isLoaded.value = true;
    }

    window.addEventListener("LR_UPLOAD_FINISH", async (e) => {
        const dataUpload = e.detail.data[0];
        if (dataUpload.name.includes(".pdf")) {
            await uploadNewResume(dataUpload.cdnUrl + dataUpload.name);
        }
    });
});

const resume = ref({});

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

const isOpenResume = ref(false);

function toggleModelResume() {
    isOpenResume.value = !isOpenResume.value;
}

async function uploadNewResume(path) {
    toggleModelUpload();

    isLoaded.value = false;

    if (Object.keys(resume.value).length !== 0) {
        await removeResume();
    }

    const response = await fetch(baseEndpoint + "/resume", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            path: path,
            candidate_profile_id: candidate_profile.value.id,
        }),
    });
    const res = await response.json();
    if (response.status !== 201) {
    } else {
        const response = await fetch(
            baseEndpoint + "/resume/" + candidate_profile.value.id,
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                // body: JSON.stringify({}),
            }
        );
        const res = await response.json();
        if (response.status !== 200) {
            alert("error occured");
        } else {
            resume.value = res.data;

            isLoaded.value = true;

            toggleToastMsg("New resume has been updated.");
        }
    }
}

const isOpenUpload = ref(false);

function toggleModelUpload() {
    isOpenUpload.value = !isOpenUpload.value;
}

const isOpenRemove = ref(false);

function toggleModalRemove() {
    isOpenRemove.value = !isOpenRemove.value;
}

async function removeResume() {
    toggleModalRemove();

    isLoaded.value = false;

    const response = await fetch(baseEndpoint + "/resume/" + resume.value.id, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });
    const res = await response.json();
    if (response.status !== 200) {
        alert("error occured");
    } else {
        resume.value = {};

        isLoaded.value = true;

        toggleToastMsg("Current resume has been removed.");
    }
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

// onBeforeUnmount(() => {
//     window.addEventListener("LR_UPLOAD_FINISH", async (e) => {
//         const dataUpload = e.detail.data[0];
//         await uploadNewResume(dataUpload.cdnUrl + dataUpload.name);
//     });
// });
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
            <TitleBorder title="Resume" />
            <template v-if="isLoaded">
                <template v-if="Object.keys(resume).length !== 0">
                    <div class="mt-4">
                        <p
                            class="text-indigo-500 cursor-pointer select-none hover:underline"
                            v-on:click="toggleModelResume()"
                        >
                            View your resume &nbsp;<i
                                class="bi bi-box-arrow-up-right"
                            ></i>
                        </p>
                    </div>
                    <div class="mt-6 flex gap-2">
                        <button
                            class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModalRemove()"
                        >
                            Remove
                        </button>
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModelUpload()"
                        >
                            Upload new
                        </button>
                    </div>
                    <DialogModal
                        v-on:toggle="toggleModelResume()"
                        v-show="isOpenResume"
                        modaltype="big"
                    >
                        <br />
                        <br />
                        <PdfRenderer v-bind:link="resume.path" />
                    </DialogModal>
                </template>
                <div class="mt-4" v-else>
                    <p class="text-lg text-indigo-300 italic">
                        No resume added...
                    </p>
                    <div class="mt-6 flex gap-2">
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModelUpload()"
                        >
                            Upload new
                        </button>
                    </div>
                </div>
            </template>
            <div class="mt-4 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </div>
    </div>
    <DialogModal
        v-on:toggle="toggleModelUpload()"
        v-show="isOpenUpload"
        modaltype="small"
    >
        <br />
        <div
            class="h-[80vh] w-[75vw] max-md:w-screen flex flex-col gap-2 justify-center border-2 border-indigo-200 rounded-md"
        >
            <!-- <FileUploader v-on:upload="handleUploaderEvent" /> -->
            <lr-file-uploader-inline
                css-src="https://esm.sh/@uploadcare/blocks@0.22.3/web/file-uploader-regular.min.css"
                ctx-name="my-uploader"
                class="my-config"
            >
                <lr-data-output
                    @lr-data-output="$emit('upload')"
                    use-event
                    hidden
                    class="my-config"
                ></lr-data-output>
            </lr-file-uploader-inline>
            <p class="text-center" v-if="successUpload">
                Successfully uploaded your resume. You can close the modal
                dialog.
            </p>
        </div>
    </DialogModal>
    <DialogModal
        v-on:toggle="toggleModalRemove()"
        v-show="isOpenRemove"
        modaltype="small"
    >
        <br class="mb-2" />
        <p>Remove your current resume?</p>
        <div class="mt-6 flex gap-2">
            <button
                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                v-on:click="removeResume()"
            >
                Yes
            </button>
            <button
                class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                v-on:click="toggleModalRemove()"
            >
                Cancel
            </button>
        </div>
    </DialogModal>
</template>

<style>
.my-config {
    --cfg-pubkey: "832b31ff90b56495ee63";
    --cfg-img-only: 0;
    --cfg-multiple: 0;
    --cfg-max-local-file-size-bytes: 5242880;
    --cfg-multiple-max: 1;
    --cfg-use-cloud-image-editor: 1;
    --cfg-source-list: "local, camera";
    --cfg-confirm-upload: 1;
    --cfg-show-empty-list: 1;
    --darkmode: 0;
    --h-accent: 243;
    --s-accent: 75%;
    --l-accent: 59%;
    --h-background: 226;
    --s-background: 100%;
    --l-background: 97;
}
</style>
