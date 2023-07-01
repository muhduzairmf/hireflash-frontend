<script setup>
import { onMounted, ref } from "vue";
import DialogModal from "../../components/DialogModal.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint, officer } from "../../stores";
import router from "../../router";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import PdfRenderer from "../../components/PdfRenderer.vue";
import Loading from "../../components/Loading.vue";
import dayjs from "dayjs";

document.title = "Successful Candidate Detail - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const jobId = router.currentRoute.value.params.jobId;
    const candidateId = router.currentRoute.value.params.candidateId;

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
        status.value = job.value.recruitment_status;

        const response2 = await fetch(
            baseEndpoint + "/successful-candidate/" + jobId + "/" + candidateId,
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
            success.value = res2.data;
            notes.value = success.value.notes;

            isLoaded.value = true;
        }
    }
});

const success = ref({});
const job = ref({});

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

const isUpdateStatus = ref(false);

function toggleFormStatus() {
    isUpdateStatus.value = !isUpdateStatus.value;
}

async function updateStatusRecruit() {
    const companyId = officer.value.company_id;
    const jobId = router.currentRoute.value.params.jobId;

    const response = await fetch(
        baseEndpoint + "/job/recruitment-status/" + companyId + "/" + jobId,
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
            "Failed to update recruitment status. Please try again."
        );
    } else {
        toggleFormStatus();
        toggleToastMsg("Recruitment status has been updated");
    }
}

const isOpenNotes = ref(false);

function toggleModelNotes() {
    isOpenNotes.value = !isOpenNotes.value;
}

const notes = ref("");

async function addNotes() {
    const jobId = router.currentRoute.value.params.jobId;
    const candidateId = router.currentRoute.value.params.candidateId;

    const response = await fetch(
        baseEndpoint +
            "/successful-candidate/" +
            jobId +
            "/" +
            candidateId +
            "/notes",
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({
                notes: notes.value,
            }),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        toggleToastMsg(
            "Failed to add notes to this candidate. Please try again."
        );
    } else {
        toggleModelNotes();
        toggleToastMsg("Notes successfully added");
    }
}

const isOpenResume = ref(false);

function toggleModelResume() {
    isOpenResume.value = !isOpenResume.value;
}

const isOpenRemove = ref(false);

function toggleModalRemove() {
    isOpenRemove.value = !isOpenRemove.value;
}

async function removeCandidateSuccess() {
    const jobId = router.currentRoute.value.params.jobId;
    const candidateId = router.currentRoute.value.params.candidateId;

    const response = await fetch(
        baseEndpoint + "/successful-candidate/" + jobId + "/" + candidateId,
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
    } else {
        successRemove.value = "successful";
        router.replace("/recruitment/" + jobId + "/successful-list");
    }
}

const textareaElm = ref(null);

function textareaResize() {
    textareaElm.value.style.height = "5rem";
    if (parseInt(textareaElm.value.scrollHeight) < 500) {
        textareaElm.value.style.height = textareaElm.value.scrollHeight + "px";
    } else {
        textareaElm.value.style.height = "500px";
    }
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
            v-if="isLoaded"
        >
            <div class="mt-2 flex items-center gap-2">
                <router-link
                    v-bind:to="
                        `/workspace/recruitment/` + job.id + `/successful-list`
                    "
                    class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    ><i class="bi bi-arrow-left text-xl"></i
                ></router-link>
                <h2>Successful List</h2>
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
            <div class="mt-4">
                <TitleBorder title="Successful Candidate Detail" />
            </div>
            <div class="mt-4 flex gap-4 max-md:flex-col">
                <img
                    src=""
                    alt=""
                    class="border-2 border-indigo-200 rounded-md w-28 h-28 bg-gray-200 max-md:self-center"
                />
                <div class="max-md:text-[0.9rem]">
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-person-badge"></i>&nbsp;&nbsp; User
                            Profile
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <li>{{ success.candidate_profile.user.name }}</li>
                            <li>
                                {{ success.candidate_profile.user.email }}
                            </li>
                            <li>{{ success.candidate_profile.gender }}</li>
                            <li>{{ success.candidate_profile.location }}</li>
                            <li>
                                {{
                                    `Preferred Salary : RM` +
                                    success.candidate_profile.preferred_salary
                                }}
                            </li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-book"></i>&nbsp;&nbsp; Education
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <template
                                v-if="
                                    success.candidate_profile.education.length >
                                    0
                                "
                            >
                                <li
                                    v-for="edu in success.candidate_profile
                                        .education"
                                >
                                    {{ edu.study_field }} at
                                    {{ edu.institute_name }} ({{
                                        dayjs(
                                            edu.graduation_date,
                                            "D MMMM YYYY"
                                        ).year()
                                    }})
                                </li>
                            </template>
                            <li v-else>-</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-briefcase"></i>&nbsp;&nbsp; Work
                            experience
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <template
                                v-if="
                                    success.candidate_profile.work_experience
                                        .length > 0
                                "
                            >
                                <li
                                    v-for="exp in success.candidate_profile
                                        .work_experience"
                                >
                                    {{ exp.duration }} experience at
                                    {{ exp.company_name }} as
                                    {{ exp.position }} ({{
                                        dayjs(
                                            exp.start_date,
                                            "D MMMM YYYY"
                                        ).year()
                                    }}
                                    -
                                    {{
                                        dayjs(
                                            exp.end_date,
                                            "D MMMM YYYY"
                                        ).year()
                                    }})
                                </li>
                            </template>
                            <li v-else>-</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-translate"></i>&nbsp;&nbsp; Language
                            ability
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <template
                                v-if="
                                    success.candidate_profile.lang_ability
                                        .length > 0
                                "
                            >
                                <li
                                    v-for="lang in success.candidate_profile
                                        .lang_ability"
                                >
                                    {{ lang.language_name }}:
                                    {{ lang.scale_of_speaking }} out of 5 for
                                    speaking and {{ lang.scale_of_writing }} out
                                    of 5 for writing
                                </li>
                            </template>
                            <li v-else>-</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-hourglass-split"></i>&nbsp;&nbsp;
                            Skill
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <template
                                v-if="
                                    success.candidate_profile.skill.length > 0
                                "
                            >
                                <li
                                    v-for="sk in success.candidate_profile
                                        .skill"
                                >
                                    {{ sk.skill_name }} ({{ sk.proficiency }})
                                </li>
                            </template>
                            <li v-else>-</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-file-earmark-text"></i>&nbsp;&nbsp;
                            Resume
                        </h4>
                        <ul class="list-disc list-inside px-2">
                            <li
                                v-if="
                                    success.candidate_profile.resume.length > 0
                                "
                            >
                                <span
                                    class="text-indigo-500 cursor-pointer select-none"
                                    v-on:click="toggleModelResume()"
                                >
                                    Open resume &nbsp;<i
                                        class="bi bi-box-arrow-up-right"
                                    ></i>
                                </span>
                            </li>
                            <li v-else>-</li>
                        </ul>
                    </div>
                    <div class="mb-4">
                        <h4 class="text-lg">
                            <i class="bi bi-blockquote-left"></i>&nbsp;&nbsp;
                            Notes
                        </h4>
                        <p class="text-gray-400 px-6" v-if="notes === ''">
                            No notes added
                        </p>
                        <p class="px-6" v-else>
                            {{ notes }}
                        </p>
                    </div>
                    <div
                        class="mt-6 flex gap-2 max-md:flex-col max-md:text-[1rem]"
                    >
                        <button
                            class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleFormStatus()"
                        >
                            Update Status
                        </button>
                        <button
                            class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModelNotes()"
                        >
                            Add notes
                        </button>
                        <button
                            class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            v-on:click="toggleModalRemove()"
                        >
                            Remove from Successful List
                        </button>
                    </div>
                    <div class="mt-6">
                        <form
                            class="mb-8"
                            v-bind:class="{ hidden: !isUpdateStatus }"
                            v-on:submit.prevent="updateStatusRecruit()"
                        >
                            <TitleBorder title="Update Recruitment Status" />
                            <div class="mt-4 max-w-lg">
                                <label class="mb-2 block"
                                    >Recruitment Status</label
                                >
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
                </div>
            </div>
            <!-- for adding notes -->
            <DialogModal
                v-on:toggle="toggleModelNotes()"
                v-show="isOpenNotes"
                modaltype="small"
            >
                <form
                    class="block w-[40vw] max-md:w-[80vw]"
                    v-on:submit.prevent="addNotes()"
                >
                    <label class="mb-2 block">Notes</label>
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 resize-y h-20 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Add some remarks for this candidate..."
                        v-model="notes"
                        ref="textareaElm"
                        v-on:input="textareaResize()"
                    ></textarea>
                    <div class="mt-4">
                        <div class="mt-6 flex gap-2">
                            <button
                                class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                type="submit"
                                v-bind:disabled="notes === ''"
                                v-bind:class="{
                                    'disabled:cursor-not-allowed opacity-60':
                                        notes === '',
                                }"
                            >
                                Save
                            </button>
                            <button
                                class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                type="button"
                                v-on:click="toggleModelNotes()"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </DialogModal>
            <!-- for displaying resume -->
            <DialogModal
                v-if="success.candidate_profile.resume.length > 0"
                v-on:toggle="toggleModelResume()"
                v-show="isOpenResume"
                modaltype="big"
            >
                <br />
                <br />
                <PdfRenderer
                    v-bind:link="success.candidate_profile.resume[0].path"
                />
            </DialogModal>
            <DialogModal
                v-on:toggle="toggleModalRemove()"
                v-show="isOpenRemove"
                modaltype="small"
            >
                <br class="mb-2" />
                <p>Remove this candidate from interview list?</p>
                <div class="mt-6 flex gap-2">
                    <button
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="removeCandidateSuccess()"
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
        </div>
        <div class="mt-4 h-full w-full grid place-items-center" v-else>
            <Loading color="indigo" />
        </div>
        <br />
    </div>
</template>
