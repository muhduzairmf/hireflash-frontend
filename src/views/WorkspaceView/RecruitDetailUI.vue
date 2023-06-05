<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import DialogModal from "../../components/DialogModal.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint, successRecruit } from "../../stores";
import router from "../../router";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import Loading from "../../components/Loading.vue";
import dayjs from "dayjs";

document.title = "Recruitment Detail - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const jobId = router.currentRoute.value.params.jobId;

    const response = await fetch(baseEndpoint + "/job/" + jobId, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });

    const res = await response.json();

    if (response.status !== 200) {
        router.push("/404-Not-Found");
        return;
    }

    jobRecruit.value = res.data;
    status.value = jobRecruit.value.recruitment_status;

    const response2 = await fetch(baseEndpoint + "/applicant/" + jobId, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });

    const res2 = await response2.json();

    if (response2.status !== 200) {
        alert("error occured");
        return;
    }

    applicantLength.value = res2.data.length;

    const response3 = await fetch(
        baseEndpoint + "/shortlisted-candidate/" + jobId,
        {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );

    const res3 = await response3.json();

    if (response3.status !== 200) {
        alert("error occured");
        return;
    }

    shortlistLength.value = res3.data.length;

    const response4 = await fetch(
        baseEndpoint + "/shortlisted-candidate/" + jobId + "/interview",
        {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );

    const res4 = await response4.json();

    if (response4.status !== 200) {
        alert("error occured");
        return;
    }

    interviewLength.value = res4.data.length;

    const response5 = await fetch(
        baseEndpoint + "/successful-candidate/" + jobId,
        {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );

    const res5 = await response5.json();

    if (response5.status !== 200) {
        alert("error occured");
        return;
    }

    successfulLength.value = res5.data.length;

    isLoaded.value = true;
});

const jobRecruit = ref({});
const applicantLength = ref(0);
const shortlistLength = ref(0);
const interviewLength = ref(0);
const successfulLength = ref(0);

const status = ref("");

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

if (successRecruit.value === "edit") {
    toggleToastMsg("This recruitment successfully edited.");

    successRecruit.value = "";
} else if (successRecruit.value === "create") {
    toggleToastMsg("This recruitment successfully created.");

    successRecruit.value = "";
}

const isUpdateStatus = ref(false);

function toggleFormStatus() {
    isUpdateStatus.value = !isUpdateStatus.value;
}

async function submitUpdateStatus() {
    const response = await fetch(
        baseEndpoint +
            "/job/recruitment-status/" +
            jobRecruit.value.company_id +
            "/" +
            jobRecruit.value.id,
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                recruitment_status: status.value,
            }),
        }
    );

    const res = await response.json();

    if (response.status !== 200) {
        toggleToastMsg(
            "Failed to update the job recruitment. Please try again."
        );
    } else {
        jobRecruit.value.recruitment_status = status.value;
        toggleFormStatus();
        toggleToastMsg("Recruitment status successfully updated.");
    }
}

const companyName = ref("");
const designationName = ref("");

async function deleteRecruitment() {
    const response = await fetch(
        baseEndpoint +
            "/job/" +
            jobRecruit.value.company_id +
            "/" +
            jobRecruit.value.id,
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
            "Failed to delete the job recruitment. Please try again."
        );
    } else {
        successRecruit.value = "delete";

        router.push("/workspace/recruitment/view-all");
    }

    toggleModelDelete();

    companyName.value = "";
    designationName.value = "";
}

const isOpenDelete = ref(false);

function toggleModelDelete() {
    isOpenDelete.value = !isOpenDelete.value;
}

function cancelModelDelete() {
    isOpenDelete.value = !isOpenDelete.value;
    companyName.value = "";
    designationName.value = "";
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <template v-if="isLoaded">
                <div class="mt-2 flex items-center gap-2">
                    <router-link
                        to="/workspace/recruitment/view-all"
                        class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                        ><i class="bi bi-arrow-left text-xl"></i
                    ></router-link>
                    <h2>List of All Recruitment(s)</h2>
                </div>
                <div class="mt-4">
                    <h1 class="text-2xl font-bold text-center">
                        {{ jobRecruit.designation }}
                    </h1>
                    <p class="text-center">
                        <small
                            >Last updated :
                            {{
                                dayjs(jobRecruit.last_modified_date).format(
                                    "D MMMM YYYY"
                                )
                            }}</small
                        >
                    </p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Designation" />
                    <p>{{ jobRecruit.designation }}</p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Department" />
                    <p>{{ jobRecruit.department }}</p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Expected salary range" />
                    <p>
                        RM{{
                            jobRecruit.min_monthly_salary
                        }}&nbsp;&nbsp;-&nbsp;&nbsp;RM{{
                            jobRecruit.max_monthly_salary
                        }}
                    </p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Candidate Requirements" />
                    <table class="max-md:text-[0.9rem] text-start">
                        <tr>
                            <td>Nationality</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{{ jobRecruit.candidate_nationality }}</td>
                        </tr>

                        <tr>
                            <td>Education level</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{{ jobRecruit.candidate_min_edu_level }}</td>
                        </tr>
                        <tr>
                            <td>Year(s) of experience</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{{ jobRecruit.candidate_min_of_exp }}</td>
                        </tr>
                        <tr>
                            <td>Language proficiency</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{{ jobRecruit.candidate_lang_req }}</td>
                        </tr>
                        <tr>
                            <td>Other</td>
                            <td>&nbsp;:&nbsp;</td>
                            <td>{{ jobRecruit.candidate_other_req }}</td>
                        </tr>
                    </table>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Job Responsibilities" />
                    <p>
                        {{ jobRecruit.job_responsibilities }}
                    </p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Other Info" />
                    <p>
                        {{ jobRecruit.other_info }}
                    </p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Job Type" />
                    <p>{{ jobRecruit.job_type }}</p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Job Field" />
                    <p>{{ jobRecruit.job_field }}</p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Recruitment Status" />
                    <p>{{ jobRecruit.recruitment_status }}</p>
                </div>
                <div class="mt-4">
                    <TitleBorder title="Total candidate(s) in" />
                    <div
                        class="grid grid-cols-[1fr,1fr,1fr,1fr] gap-4 mt-4 max-w-3xl max-md:grid-cols-2 max-md:gap-2"
                    >
                        <router-link
                            class="border-2 border-indigo-200 rounded-md p-4 hover:border-indigo-400"
                            v-bind:to="
                                `/workspace/recruitment/` +
                                jobRecruit.id +
                                `/applicant-list`
                            "
                        >
                            <h2 class="text-4xl max-md:text-3xl text-center">
                                {{ applicantLength }}
                            </h2>
                            <p class="mt-2 text-center max-md:text-[0.9rem]">
                                Applicant List
                            </p>
                        </router-link>
                        <router-link
                            class="border-2 border-indigo-200 rounded-md p-4 hover:border-indigo-400"
                            v-bind:to="
                                `/workspace/recruitment/` +
                                jobRecruit.id +
                                `/shortlist`
                            "
                        >
                            <h2 class="text-4xl max-md:text-3xl text-center">
                                {{ shortlistLength }}
                            </h2>
                            <p class="mt-2 text-center max-md:text-[0.9rem]">
                                Shortlist
                            </p>
                        </router-link>
                        <router-link
                            class="border-2 border-indigo-200 rounded-md p-4 hover:border-indigo-400"
                            v-bind:to="
                                `/workspace/recruitment/` +
                                jobRecruit.id +
                                `/interview-list`
                            "
                        >
                            <h2 class="text-4xl max-md:text-3xl text-center">
                                {{ interviewLength }}
                            </h2>
                            <p class="mt-2 text-center max-md:text-[0.9rem]">
                                Interview List
                            </p>
                        </router-link>
                        <router-link
                            class="border-2 border-indigo-200 rounded-md p-4 hover:border-indigo-400"
                            v-bind:to="
                                `/workspace/recruitment/` +
                                jobRecruit.id +
                                `/successful-list`
                            "
                        >
                            <h2 class="text-4xl max-md:text-3xl text-center">
                                {{ successfulLength }}
                            </h2>
                            <p class="mt-2 text-center max-md:text-[0.9rem]">
                                Successful List
                            </p>
                        </router-link>
                    </div>
                </div>
                <div class="mt-6 flex gap-2 max-md:flex-col">
                    <router-link
                        v-bind:to="
                            `/workspace/recruitment/` + jobRecruit.id + `/edit`
                        "
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1 grid place-items-center"
                    >
                        <p>Edit</p>
                    </router-link>
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="toggleModelDelete()"
                    >
                        Delete
                    </button>
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="toggleFormStatus()"
                    >
                        Update Status
                    </button>
                    <div class="group relative">
                        <button
                            class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1 max-md:w-full"
                        >
                            View &nbsp;<i class="bi bi-chevron-right"></i>
                        </button>
                        <div
                            class="absolute bottom-0 left-24 hidden group-focus-within:grid place-items-center bg-gray-50 w-44 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200 max-md:relative max-md:bottom-auto max-md:left-0"
                        >
                            <div class="flex flex-col gap-1">
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        jobRecruit.id +
                                        `/applicant-list`
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    Applicant List
                                </router-link>
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        jobRecruit.id +
                                        `/shortlist`
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    Shortlist
                                </router-link>
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        jobRecruit.id +
                                        `/interview-list`
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    Interview List
                                </router-link>
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        jobRecruit.id +
                                        `/successful-list`
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    Successful List
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-6">
                    <form
                        class="mb-8"
                        v-bind:class="{ hidden: !isUpdateStatus }"
                        v-on:submit.prevent="submitUpdateStatus()"
                    >
                        <TitleBorder title="Update Recruitment Status" />
                        <div class="mt-4 max-w-lg">
                            <label class="mb-2 block">Recruitment Status</label>
                            <SelectCustom
                                v-model="status"
                                heightselect="40"
                                widthselect="full"
                                placeholderval="Choose recruitment status"
                                v-bind:isdisabled="false"
                            >
                                <template
                                    v-for="opt in [
                                        'Saved Later',
                                        'Waiting Approval',
                                        'Approved',
                                        'Advertised',
                                        'Shortlisting',
                                        'Interviewing',
                                        'Hold',
                                        'Hired',
                                        'Called Off',
                                    ]"
                                >
                                    <OptionCustom
                                        v-bind:optionvalue="opt"
                                        v-on:click="
                                            () => {
                                                status = opt;
                                            }
                                        "
                                        v-bind:class="{
                                            'rounded-md shadow-inner bg-indigo-100':
                                                status === opt,
                                        }"
                                    />
                                </template>
                            </SelectCustom>
                        </div>
                        <div class="mt-6">
                            <button
                                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                type="submit"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
                <DialogModal
                    v-on:toggle="toggleModelDelete()"
                    v-show="isOpenDelete"
                    modaltype="small"
                >
                    <br class="mb-2" />
                    <form
                        v-on:submit.prevent="deleteRecruitment()"
                        class="max-w-lg"
                    >
                        <p>
                            Are you sure want to delete this recruitment
                            <strong>permanently</strong>? Any data related to it
                            will be <strong>deleted too</strong>!
                        </p>
                        <div class="mt-10">
                            <label class="mb-2 block"
                                >Please type your company name and this job
                                designation</label
                            >
                            <input
                                type="text"
                                class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 mb-2"
                                v-bind:placeholder="jobRecruit.company.name"
                                v-model="companyName"
                                v-on:input="
                                    () => {
                                        console.log(jobRecruit.company.name);

                                        console.log(companyName);
                                    }
                                "
                            />
                            <input
                                type="text"
                                class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 mb-2"
                                v-bind:placeholder="jobRecruit.designation"
                                v-model="designationName"
                                v-on:input="
                                    () => {
                                        console.log(jobRecruit.designation);

                                        console.log(designationName);
                                    }
                                "
                            />
                        </div>
                        <div class="flex max-md:flex-col gap-2 mt-4">
                            <button
                                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                type="submit"
                                v-bind:disabled="
                                    companyName !== jobRecruit.company.name ||
                                    designationName !== jobRecruit.designation
                                "
                                v-bind:class="{
                                    'disabled:cursor-not-allowed opacity-60':
                                        companyName !==
                                            jobRecruit.company.name ||
                                        designationName !==
                                            jobRecruit.designation,
                                }"
                            >
                                Confirm, this job will be deleted forever
                            </button>
                            <button
                                class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                v-on:click="cancelModelDelete()"
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </DialogModal>
            </template>
            <div class="h-full w-full grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </div>
        <br />
    </div>
</template>
