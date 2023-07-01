<script setup>
import { onMounted, ref } from "vue";
import DialogModal from "../../components/DialogModal.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint, successRemove } from "../../stores";
import router from "../../router";
import PdfRenderer from "../../components/PdfRenderer.vue";
import Loading from "../../components/Loading.vue";
import dayjs from "dayjs";

document.title = "Shortlist Candidate Detail - Hireflash";

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

        const response2 = await fetch(
            baseEndpoint +
                "/shortlisted-candidate/" +
                jobId +
                "/" +
                candidateId,
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
            short.value = res2.data;
            notes.value = short.value.notes;

            isLoaded.value = true;
        }
    }
});

const short = ref({});
const job = ref({});

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

async function addToInterviewList() {
    const jobId = router.currentRoute.value.params.jobId;
    const candidateId = router.currentRoute.value.params.candidateId;

    const response = await fetch(
        baseEndpoint +
            "/shortlisted-candidate/" +
            jobId +
            "/interview-status/" +
            candidateId,
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ is_qualified_interview: true }),
        }
    );
    const res = await response.json();
    if (response.status !== 201) {
        toggleToastMsg(
            "Failed to add the candidate to interview list. Please try again."
        );
    } else {
        toggleToastMsg("Successfully added this candidate to interview list.");
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
            "/shortlisted-candidate/" +
            jobId +
            "/" +
            candidateId +
            "/notes",
        {
            method: "PATCH",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ notes: notes.value }),
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

async function removeCandidateShortlist() {
    const jobId = router.currentRoute.value.params.jobId;
    const candidateId = router.currentRoute.value.params.candidateId;

    const response = await fetch(
        baseEndpoint + "/shortlisted-candidate/" + jobId + "/" + candidateId,
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
            "Failed to remove this candidate from shortlist. Please try again."
        );
    } else {
        successRemove.value = "short";
        router.replace("/workspace/recruitment/" + jobId + "/shortlist");
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
                        `/workspace/recruitment/` + job.id + `/shortlist`
                    "
                    class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    ><i class="bi bi-arrow-left text-xl"></i
                ></router-link>
                <h2>Shortlist</h2>
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
                <TitleBorder title="Shortlist Candidate Detail" />
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
                            <li>{{ short.candidate_profile.user.name }}</li>
                            <li>
                                {{ short.candidate_profile.user.email }}
                            </li>
                            <li>{{ short.candidate_profile.gender }}</li>
                            <li>{{ short.candidate_profile.location }}</li>
                            <li>
                                {{
                                    `Preferred Salary : RM` +
                                    short.candidate_profile.preferred_salary
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
                                    short.candidate_profile.education.length > 0
                                "
                            >
                                <li
                                    v-for="edu in short.candidate_profile
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
                                    short.candidate_profile.work_experience
                                        .length > 0
                                "
                            >
                                <li
                                    v-for="exp in short.candidate_profile
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
                                    short.candidate_profile.lang_ability
                                        .length > 0
                                "
                            >
                                <li
                                    v-for="lang in short.candidate_profile
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
                                v-if="short.candidate_profile.skill.length > 0"
                            >
                                <li v-for="sk in short.candidate_profile.skill">
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
                                v-if="short.candidate_profile.resume.length > 0"
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
                            v-on:click="addToInterviewList()"
                        >
                            Add to Interview List
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
                            Remove from Shortlist
                        </button>
                    </div>
                    <br />
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
                                class="rounded-md bg-gray-50 border-2 border-indigo8 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                                v-on:click="toggleModelNotes()"
                                type="button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </DialogModal>
            <!-- for displaying resume -->
            <DialogModal
                v-if="short.candidate_profile.resume.length > 0"
                v-on:toggle="toggleModelResume()"
                v-show="isOpenResume"
                modaltype="big"
            >
                <br />
                <br />
                <PdfRenderer
                    v-bind:link="short.candidate_profile.resume[0].path"
                />
            </DialogModal>
            <DialogModal
                v-on:toggle="toggleModalRemove()"
                v-show="isOpenRemove"
                modaltype="small"
            >
                <br class="mb-2" />
                <p>Remove this candidate from shortlist?</p>
                <div class="mt-6 flex gap-2">
                    <button
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="removeCandidateShortlist()"
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
