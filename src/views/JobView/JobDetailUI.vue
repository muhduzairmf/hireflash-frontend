<script setup>
import NavApplicant from "../../components/NavApplicant.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { onMounted, ref, onBeforeMount, watchEffect } from "vue";
import DialogModal from "../../components/DialogModal.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import router from "../../router";
import {
    user,
    candidate_profile,
    isAuthenticated,
    baseEndpoint,
} from "../../stores";
import NavPublic from "../../components/NavPublic.vue";
import Loading from "../../components/Loading.vue";
import dayjs from "dayjs";

document.title = "Job Detail - Hireflash";

const showNavApplicant = ref(false);

onBeforeMount(() => {
    showNavApplicant.value = isAuthenticated.value;
});

const isLoaded = ref(false);

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const response = await fetch(
        baseEndpoint + "/job/" + router.currentRoute.value.params.jobId,
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
        toggleToastMsg("Failed to get job detail. Please try again.");
    } else {
        job.value = res.data;

        isLoaded.value = true;
    }
});

const job = ref({});

const wishlist = ref([]);
const appliedJob = ref([]);

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

const isOpenApply = ref(false);

function toggleModalApply() {
    isOpenApply.value = !isOpenApply.value;
}

async function applyJob(job_id) {
    const response = await fetch(baseEndpoint + "/applicant", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            notes: "",
            is_only_wish: false,
            candidate_profile_id: candidate_profile.value.id,
            job_id: job_id,
        }),
    });

    const res = await response.json();

    if (response.status !== 201) {
        toggleToastMsg("Failed to apply the job. Please try again.");
    } else {
        toggleModalApply();
        toggleToastMsg("You have successfully apply this job!");
    }
}

function copyLinkJob() {
    navigator.clipboard.writeText("http://localhost:5173/job/" + job.value.id);
    toggleToastMsg("Link copied!");
}

async function addToWishlist(job_id) {
    const response = await fetch(baseEndpoint + "/applicant", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            notes: "",
            is_only_wish: true,
            candidate_profile_id: candidate_profile.value.id,
            job_id: job_id,
        }),
    });

    const res = await response.json();

    if (response.status !== 201) {
        toggleToastMsg("Failed to add to Wishlist. Please try again.");
    } else {
        toggleToastMsg("Successfully added to Wishlist");
    }
}

watchEffect(async () => {
    if (candidate_profile.value.id) {
        const response = await fetch(
            baseEndpoint + "/applicant/wishlist/" + candidate_profile.value.id,
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
            toggleToastMsg("Failed to get wishlist. Please reload browser.");
        } else {
            wishlist.value = res.data;

            const response2 = await fetch(
                baseEndpoint +
                    "/applicant/applied-job/" +
                    candidate_profile.value.id,
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
                toggleToastMsg(
                    "Failed to get applied job list. Please reload browser."
                );
            } else {
                appliedJob.value = res2.data;

                console.log(appliedJob.value);
            }
        }
    }
});
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <main class="bg-indigo-50 w-full min-h-screen">
        <template v-if="isLoaded">
            <NavApplicant v-bind:shownav="showNavApplicant" />
            <NavPublic v-bind:shownav="!showNavApplicant" />
            <section class="max-w-7xl mx-auto px-4 mt-12 max-md:mt-8">
                <div class="flex max-md:flex-col gap-4">
                    <div
                        class="flex-grow bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg text-justify max-md:px-6 max-md:py-3"
                    >
                        <button
                            class="py-1 px-2 bg-gray-50 hover:rounded-md hover:shadow-inner hover:bg-indigo-100 mb-4"
                            title="Back"
                            v-on:click="
                                () => {
                                    router.back();
                                }
                            "
                        >
                            <i class="bi bi-arrow-left text-xl"></i>
                        </button>
                        <div class="flex justify-center mb-4 max-md:mt-2">
                            <img
                                v-bind:src="job.company.pic"
                                alt=""
                                class="border-2 border-indigo-200 rounded-md w-40 h-40 transition ease-in-out hover:rotate-[5deg]"
                            />
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Designation" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.designation }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Department" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.department }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Expected Salary Range" />
                            <p class="max-md:text-[0.9rem]">
                                RM{{ job.min_monthly_salary }} - RM{{
                                    job.max_monthly_salary
                                }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Candidate Requirements" />
                            <table class="max-md:text-[0.9rem] text-start">
                                <tr>
                                    <td>Nationality</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{{ job.candidate_nationality }}</td>
                                </tr>

                                <tr>
                                    <td>Education level</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{{ job.candidate_min_edu_level }}</td>
                                </tr>
                                <tr>
                                    <td>Year(s) of experience</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{{ job.candidate_min_of_exp }}</td>
                                </tr>
                                <tr>
                                    <td>Language proficiency</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{{ job.candidate_lang_req }}</td>
                                </tr>
                                <tr>
                                    <td>Other</td>
                                    <td>&nbsp;:&nbsp;</td>
                                    <td>{{ job.candidate_other_req }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Job Responsibilities" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.job_responsibilities }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Other Info" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.other_info }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Job Type" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.job_type }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Job Field" />
                            <p class="max-md:text-[0.9rem]">
                                {{ job.job_field }}
                            </p>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Posted Date" />
                            <p class="max-md:text-[0.9rem]">
                                {{
                                    dayjs(job.last_modified_date).format(
                                        "D MMMM YYYY"
                                    )
                                }}
                            </p>
                        </div>
                        <div class="my-6 flex gap-2 max-md:flex-col">
                            <router-link
                                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                to="/auth/login"
                                v-if="!user.id"
                            >
                                Login to apply this job
                            </router-link>
                            <button
                                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                v-on:click="toggleModalApply()"
                                v-bind:disabled="
                                    appliedJob.filter(
                                        (appl) => appl.job_id === job.id
                                    ).length > 0
                                "
                                v-bind:class="{
                                    'disabled:cursor-not-allowed opacity-60':
                                        appliedJob.filter(
                                            (appl) => appl.job_id === job.id
                                        ).length > 0,
                                }"
                                v-if="user.id"
                            >
                                {{
                                    appliedJob.filter(
                                        (appl) => appl.job_id === job.id
                                    ).length > 0
                                        ? "Applied"
                                        : "Apply"
                                }}
                            </button>
                            <button
                                class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                v-on:click="copyLinkJob()"
                            >
                                Copy Link
                            </button>
                            <button
                                class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                v-on:click="addToWishlist(job.id)"
                                v-bind:disabled="
                                    wishlist.filter(
                                        (wish) => wish.job_id === job.id
                                    ).length > 0
                                "
                                v-bind:class="{
                                    'disabled:cursor-not-allowed opacity-60':
                                        wishlist.filter(
                                            (wish) => wish.job_id === job.id
                                        ).length > 0,
                                }"
                                v-if="user.id"
                            >
                                {{
                                    wishlist.filter(
                                        (wish) => wish.job_id === job.id
                                    ).length > 0
                                        ? "Added to Wishlist"
                                        : "Add to Wishlist"
                                }}
                            </button>
                        </div>
                    </div>
                    <div class="w-96 max-md:w-full">
                        <div
                            class="bg-gray-50 px-8 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-4"
                        >
                            <TitleBorder title="Company Information" />
                            <div class="mb-2 flex gap-2">
                                <p><i class="bi bi-buildings text-lg"></i></p>
                                <p>{{ job.company.name }}</p>
                            </div>
                            <div class="mb-2 flex gap-2">
                                <p><i class="bi bi-geo-alt text-lg"></i></p>
                                <p>
                                    {{
                                        job.company.state +
                                        `, ` +
                                        job.company.country
                                    }}
                                </p>
                            </div>
                            <div class="mb-2 flex gap-2">
                                <p><i class="bi bi-link-45deg text-lg"></i></p>
                                <p>{{ job.company.website }}</p>
                            </div>
                            <div class="mb-2 flex gap-2">
                                <p>
                                    <i class="bi bi-text-paragraph text-lg"></i>
                                </p>
                                <p>{{ job.company.desc }}</p>
                            </div>
                            <div class="flex mt-6 mb-2">
                                <router-link
                                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                    v-bind:to="`/company/` + job.company.id"
                                >
                                    View Company &nbsp;<i
                                        class="bi bi-box-arrow-up-right"
                                    ></i>
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <DialogModal
                v-on:toggle="toggleModalApply()"
                v-show="isOpenApply"
                modaltype="small"
            >
                <br class="mb-2" />
                <p>
                    Confirm job application for {{ job.designation }} at
                    {{ job.company.name }}?
                </p>
                <div class="mt-6 flex gap-2">
                    <button
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="applyJob(job.id)"
                    >
                        Yes
                    </button>
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="toggleModalApply()"
                    >
                        Cancel
                    </button>
                </div>
            </DialogModal>
        </template>
        <div class="h-full w-full grid place-items-center" v-else>
            <Loading color="indigo" />
        </div>
        <br /><br /><br />
    </main>
</template>
