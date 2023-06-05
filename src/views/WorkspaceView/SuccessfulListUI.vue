<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint, successRemove } from "../../stores";
import router from "../../router";
import Loading from "../../components/Loading.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import dayjs from "dayjs";

document.title = "Successful List - Hireflash";

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
        if (response.status === 404) {
            router.replace("/404-Not-Found");
        }
    } else {
        job.value = res.data;

        const response2 = await fetch(
            baseEndpoint + "/successful-candidate/" + jobId,
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
        } else {
            successfulList.value = res2.data;

            isLoaded.value = true;
        }
    }
});

const successfulList = ref([]);
const job = ref({});

async function removeCandidateSuccess(candidate_profile_id) {
    isLoaded.value = false;
    const jobId = router.currentRoute.value.params.jobId;

    const response = await fetch(
        baseEndpoint +
            "/successful-candidate/" +
            jobId +
            "/" +
            candidate_profile_id,
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
    } else {
        const response2 = await fetch(
            baseEndpoint + "/successful-candidate/" + jobId,
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
        } else {
            successfulList.value = res2.data;

            toggleToastMsg(
                "Successfully removed the candidate from successful list."
            );
        }
    }
}

const filter = ref("");

function applyingFilter() {
    if (filter.value === "") {
        return;
    }
    alert(`${filter.value} applied`);
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

if (successRemove.value === "successful") {
    toggleToastMsg("Successfully removed the candidate from successful list.");
    successRemove.value = "";
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
                    v-bind:to="`/workspace/recruitment/` + job.id"
                    class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    ><i class="bi bi-arrow-left text-xl"></i
                ></router-link>
                <h2>Recruitment Detail</h2>
            </div>
            <div class="mt-4">
                <h1 class="text-2xl font-bold text-center">
                    {{ job.designation }}
                </h1>
                <p class="text-center">
                    <small
                        >Last updated :
                        {{
                            dayjs(job.last_modified_date).format("D MMMM YYYY")
                        }}</small
                    >
                </p>
            </div>
            <div class="mt-4 flex justify-between max-md:block">
                <div>
                    <TitleBorder title="Successful List" />
                </div>
                <select
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 h-7 transition ease-in-out focus:scale-95 hover:-translate-y-1 text-sm cursor-pointer"
                    v-model="filter"
                    v-on:change="applyingFilter()"
                >
                    <option value="">Apply filter</option>
                    <option value="Filter 1">Filter 1</option>
                    <option value="Filter 2">Filter 2</option>
                </select>
            </div>
            <template v-if="isLoaded">
                <template v-if="successfulList.length > 0">
                    <div class="mt-4" v-for="success in successfulList">
                        <div class="relative group">
                            <button class="absolute top-0 right-0">
                                <i
                                    class="bi bi-three-dots-vertical text-lg relative"
                                ></i>
                            </button>
                            <div
                                class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 min-w-fit py-4 px-2 rounded-md shadow-lg outline outline-2 outline-indigo-200"
                            >
                                <div class="flex flex-col">
                                    <router-link
                                        v-bind:to="
                                            `/workspace/recruitment/` +
                                            job.id +
                                            `/successful-list/candidate/` +
                                            success.candidate_profile.id
                                        "
                                        class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                    >
                                        View Detail
                                    </router-link>
                                    <button
                                        class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                        v-on:click="
                                            removeCandidateSuccess(
                                                success.candidate_profile.id
                                            )
                                        "
                                    >
                                        Remove from Successful List
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 py-4 max-md:block">
                            <img
                                src=""
                                alt=""
                                class="border-2 border-indigo-200 rounded-md w-28 h-28 bg-gray-200 max-md:w-16 max-md:h-16"
                            />
                            <div class="flex flex-col gap-1">
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        job.id +
                                        `/successful-list/candidate/` +
                                        success.candidate_profile.id
                                    "
                                    class="text-xl font-semibold hover:underline cursor-pointer"
                                >
                                    {{ success.candidate_profile.user.name }}
                                </router-link>
                                <p
                                    v-if="
                                        success.candidate_profile.education
                                            .length > 0
                                    "
                                >
                                    <i class="bi bi-book"></i> &nbsp;&nbsp;
                                    {{
                                        success.candidate_profile.education[
                                            success.candidate_profile.education
                                                .length - 1
                                        ].study_field
                                    }}
                                </p>
                                <p
                                    v-if="
                                        success.candidate_profile
                                            .work_experience.length > 0
                                    "
                                >
                                    <i class="bi bi-briefcase"></i> &nbsp;&nbsp;
                                    {{
                                        success.candidate_profile
                                            .work_experience[
                                            success.candidate_profile
                                                .work_experience.length - 1
                                        ].duration
                                    }}
                                    experience at
                                    {{
                                        success.candidate_profile
                                            .work_experience[
                                            success.candidate_profile
                                                .work_experience.length - 1
                                        ].company_name
                                    }}
                                    as
                                    {{
                                        success.candidate_profile
                                            .work_experience[
                                            success.candidate_profile
                                                .work_experience.length - 1
                                        ].role
                                    }}
                                </p>
                                <p>
                                    <i class="bi bi-cash"></i> &nbsp;&nbsp;
                                    Preferred Salary : RM{{
                                        success.candidate_profile
                                            .preferred_salary
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
                <div class="mt-4 py-4" v-else>
                    <h4 class="text-lg text-indigo-300 italic">
                        No candidate successfully hired...
                    </h4>
                </div>
            </template>
            <div class="mt-4 h-full w-full grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </div>
        <br />
    </div>
</template>
