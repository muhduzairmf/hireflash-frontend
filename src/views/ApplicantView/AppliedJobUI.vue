<script setup>
import { onMounted, ref } from "vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint, candidate_profile } from "../../stores";
import Loading from "../../components/Loading.vue";

document.title = "Applied Job - Hireflash";

const isLoaded = ref(false);
const jobIdFocused = ref("");

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/applicant/applied-job/" + candidate_profile.value.id,
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
        toggleToastMsg(
            "Failed to get applied job list. Please reload browser."
        );
    } else {
        appliedJob.value = res.data;

        appliedJob.value.forEach(async (appl) => {
            if (appl.is_viewed) {
                applicationStatus.value = [
                    ...applicationStatus.value,
                    "under review",
                ];
            } else {
                applicationStatus.value = [...applicationStatus.value, "sent"];
            }

            const response2 = await fetch(
                baseEndpoint + "/job/" + appl.job_id,
                {
                    method: "GET",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    // body: JSON.stringify({}),
                }
            );

            const res2 = await response2.json();

            if (response2.status !== 200) {
                toggleToastMsg("Failed to get job detail. Please try again.");
            } else {
                jobList.value = [...jobList.value, res2.data];
            }
        });

        isLoaded.value = true;
    }
});

const appliedJob = ref([]);
const jobList = ref([]);
const applicationStatus = ref([]);

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

function copyLinkJob() {
    navigator.clipboard.writeText("http://localhost:5173/job/e5221fc309");
    toggleToastMsg("Link copied!");
}

const isOpenRemove = ref(false);

function toggleModalRemove() {
    isOpenRemove.value = !isOpenRemove.value;
}

async function removeFromAppliedHistory(job_id) {
    toggleModalRemove();

    isLoaded.value = false;

    const response = await fetch(
        baseEndpoint +
            `/applicant/applied-job/${candidate_profile.value.id}/${job_id}`,
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
        toggleToastMsg("Failed to remove from Applied History");
    } else {
        jobList.value = jobList.value.filter((job) => job.id !== job_id);
        applicationStatus.value = [];
        appliedJob.value = appliedJob.value.filter(
            (appl) => appl.job_id !== job_id
        );
        appliedJob.value.forEach((appl) => {
            if (appl.is_viewed) {
                applicationStatus.value = [
                    ...applicationStatus.value,
                    "under review",
                ];
            } else {
                applicationStatus.value = [...applicationStatus.value, "sent"];
            }
        });
        isLoaded.value = true;
        toggleToastMsg("Successfully removed from Applied History");
    }
}

const isOpenPreview = ref(false);

function toggleModalPreview() {
    isOpenPreview.value = !isOpenPreview.value;
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
            <TitleBorder title="Applied Job" />
            <template v-if="isLoaded">
                <template v-if="jobList.length > 0">
                    <div class="mt-4" v-for="job in jobList">
                        <div class="m-6 max-md:m-0">
                            <!-- icon with dropdown -->
                            <div class="relative group">
                                <button class="absolute top-0 right-0">
                                    <i
                                        class="bi bi-three-dots-vertical text-lg"
                                    ></i>
                                </button>
                                <div
                                    class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 w-72 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200"
                                >
                                    <div class="flex flex-col">
                                        <router-link
                                            class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                            v-bind:to="`/job/` + job.id"
                                        >
                                            View Detail
                                        </router-link>
                                        <button
                                            class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                            v-on:click="copyLinkJob()"
                                        >
                                            Copy Link
                                        </button>
                                        <button
                                            class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                            v-on:click="
                                                () => {
                                                    jobIdFocused = job.id;
                                                    toggleModalRemove();
                                                }
                                            "
                                        >
                                            Remove from Applied History
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <!-- job desc -->
                            <div
                                class="flex items-center gap-4 max-md:flex-col max-md:items-start"
                            >
                                <img
                                    v-bind:src="job.company.pic"
                                    alt=""
                                    class="border-2 border-indigo-200 rounded-md w-32 h-auto max-md:w-16 max-md:h-auto"
                                />
                                <div class="">
                                    <h1
                                        class="text-2xl font-semibold mb-1 hover:underline cursor-pointer select-none max-md:text-xl"
                                        v-on:click="toggleModalPreview()"
                                        title="Preview the job"
                                    >
                                        {{ job.designation }}
                                    </h1>
                                    <div
                                        class="flex gap-6 mb-1 max-md:flex-col max-md:gap-1"
                                    >
                                        <p>{{ job.company.name }}</p>
                                        <p class="flex items-center">
                                            <i class="bi bi-geo-alt"></i
                                            >&nbsp;<span>{{
                                                job.company.state +
                                                `, ` +
                                                job.company.country
                                            }}</span>
                                        </p>
                                        <p class="flex items-center">
                                            <i class="bi bi-cash"></i
                                            >&nbsp;<span
                                                >RM{{
                                                    job.min_monthly_salary
                                                }}</span
                                            >
                                        </p>
                                    </div>
                                    <h3>
                                        <span class="font-medium">Status</span>
                                        &nbsp;:&nbsp;
                                        <span class="capitalize">{{
                                            applicationStatus[
                                                jobList.indexOf(job)
                                            ]
                                        }}</span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                        <div
                            class="mt-4 border-t-[1.5px] border-indigo-200"
                        ></div>
                    </div>
                </template>
                <div class="mt-8 text-lg text-indigo-300 italic" v-else>
                    No job applied...
                </div>
            </template>
            <div class="mt-4 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </div>
        <div class="mb-8">
            <TitleBorder title="Application status" />
            <div
                class="grid grid-cols-[1fr,1fr] gap-4 mt-4 max-w-3xl max-md:grid-cols-1"
            >
                <div class="border-2 border-indigo-200 rounded-md p-4">
                    <div class="grid place-items-center" v-if="!isLoaded">
                        <Loading color="indigo" />
                    </div>
                    <h2 class="text-4xl text-center" v-else>
                        {{
                            applicationStatus.filter(
                                (applStatus) => applStatus === "sent"
                            ).length
                        }}
                    </h2>
                    <p class="mt-2 text-center">Sent</p>
                </div>
                <div class="border-2 border-indigo-200 rounded-md p-4">
                    <div class="grid place-items-center" v-if="!isLoaded">
                        <Loading color="indigo" />
                    </div>
                    <h2 class="text-4xl text-center" v-else>
                        {{
                            applicationStatus.filter(
                                (applStatus) => applStatus === "under review"
                            ).length
                        }}
                    </h2>
                    <p class="mt-2 text-center">Under Review</p>
                </div>
            </div>
        </div>
        <div class="mb-8 hidden max-md:block">
            <router-link
                class="text-indigo-500 hover:underline cursor-pointer select-none"
                to="/profile/wishlist"
                >Go to Wishlist&nbsp;<i class="bi bi-arrow-right"></i
            ></router-link>
        </div>
        <DialogModal
            v-on:toggle="toggleModalRemove()"
            v-show="isOpenRemove"
            modaltype="small"
        >
            <br class="mb-2" />
            <p>Confirm to remove from your applied history?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="removeFromAppliedHistory(jobIdFocused)"
                >
                    Yes
                </button>
                <button
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="
                        () => {
                            jobIdFocused = '';
                            toggleModalRemove();
                        }
                    "
                >
                    Cancel
                </button>
            </div>
        </DialogModal>
    </div>
</template>
