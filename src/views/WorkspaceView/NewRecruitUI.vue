<script setup>
import { ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint, officer, successRecruit } from "../../stores";
import router from "../../router";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import dayjs from "dayjs";
import ToastMsg from "../../components/ToastMsg.vue";

document.title = "Add New Recruitment - Hireflash";

const textareaElm1 = ref(null);
const textareaElm2 = ref(null);
const textareaElm3 = ref(null);

function textareaResize1() {
    textareaElm1.value.style.height = "11rem";
    textareaElm1.value.style.height = textareaElm1.value.scrollHeight + "px";
}

function textareaResize2() {
    textareaElm2.value.style.height = "11rem";
    textareaElm2.value.style.height = textareaElm2.value.scrollHeight + "px";
}

function textareaResize3() {
    textareaElm3.value.style.height = "11rem";
    textareaElm3.value.style.height = textareaElm3.value.scrollHeight + "px";
}

// The variables for getting values from input
const designation = ref("");
const department = ref("");
const minsalary = ref("");
const maxsalary = ref("");
const nationality = ref("");
const eduLevel = ref("");
const experience = ref("");
const lang = ref("");
const otherReq = ref("");
const jobRespons = ref("");
const otherInfo = ref("");
const jobType = ref("");
const jobField = ref("");
const status = ref("");

const arrJobType = ref([]);

// A function to submit a new recruitment
async function addNewRecruit() {
    const response = await fetch(baseEndpoint + "/job", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            designation: designation.value,
            department: department.value,
            min_monthly_salary: minsalary.value,
            max_monthly_salary: maxsalary.value,
            candidate_nationality: nationality.value,
            candidate_min_edu_level: eduLevel.value,
            candidate_min_of_exp: experience.value,
            candidate_lang_req: lang.value,
            candidate_other_req: otherReq.value,
            job_responsibilities: jobRespons.value,
            other_info: otherInfo.value,
            created_date: dayjs().format("YYYY-MM-DD"),
            last_modified_date: dayjs().format("YYYY-MM-DD"),
            recruitment_status: status.value,
            job_type: jobType.value,
            job_field: jobField.value,
            officer_id: officer.value.id,
        }),
    });

    const res = await response.json();
    console.log(res);

    if (response.status !== 201) {
        toggleToastMsg(
            "Failed to create new job recruitment. Please try again."
        );
    } else {
        designation.value = "";
        department.value = "";
        minsalary.value = "";
        maxsalary.value = "";
        nationality.value = "";
        eduLevel.value = "";
        experience.value = "";
        lang.value = "";
        otherReq.value = "";
        jobRespons.value = "";
        jobType.value = "";
        jobField.value = "";
        status.value = "";

        successRecruit.value = "create";

        router.push("/workspace/recruitment/" + res.data.id);
    }
}

//
function preventSubmit() {
    if (
        designation.value == "" ||
        department.value === "" ||
        minsalary.value === "" ||
        maxsalary.value === "" ||
        nationality.value === "" ||
        eduLevel.value === "" ||
        experience.value === "" ||
        lang.value === "" ||
        otherReq.value === "" ||
        jobRespons.value === "" ||
        jobType.value === "" ||
        jobField.value === "" ||
        status.value === ""
    ) {
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
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <TitleBorder title="Add New Recruitment" />
            <form v-on:submit.prevent="addNewRecruit()">
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Designation</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Accountant"
                        v-model="designation"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Department</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Department of Financial"
                        v-model="department"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Minimum monthly salary</label>
                    <input
                        type="number"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="3000"
                        v-model="minsalary"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Maximum monthly salary</label>
                    <input
                        type="number"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="4000"
                        v-model="maxsalary"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Candidate nationality</label>
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Malaysia"
                        v-model="nationality"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block"
                        >Candidate minimum education level</label
                    >
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Bachelor's Degree in Accounting"
                        v-model="eduLevel"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block"
                        >Candidate year(s) of experience</label
                    >
                    <SelectCustom
                        v-model="experience"
                        heightselect="40"
                        widthselect="full"
                        placeholderval="Choose year(s) of experience"
                        v-bind:isdisabled="false"
                    >
                        <template
                            v-for="opt in ['0', '1', '2', '3', '4', '5', '10']"
                        >
                            <OptionCustom
                                v-bind:optionvalue="opt"
                                v-on:click="
                                    () => {
                                        experience = opt;
                                    }
                                "
                                v-bind:class="{
                                    'rounded-md shadow-inner bg-indigo-100':
                                        experience === opt,
                                }"
                            />
                        </template>
                    </SelectCustom>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block"
                        >Candidate Language requirement</label
                    >
                    <input
                        type="text"
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="English"
                        v-model="lang"
                    />
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Other requirement</label>
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 h-44 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Have an ACCA certificate"
                        ref="textareaElm1"
                        v-model="otherReq"
                        v-on:input="textareaResize1()"
                    ></textarea>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Job responsibilities</label>
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 resize-y h-44 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Track the internal and external payment record"
                        ref="textareaElm2"
                        v-model="jobRespons"
                        v-on:input="textareaResize2()"
                    ></textarea>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Other information</label>
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 resize-y h-44 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Free insurance coverage"
                        ref="textareaElm3"
                        v-model="otherInfo"
                        v-on:input="textareaResize3()"
                    ></textarea>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Job type</label>
                    <div class="flex flex-wrap gap-2 justify-center">
                        <template
                            v-for="thisType in [
                                'Permanent',
                                'Contract',
                                'Internship',
                                'Full-Time',
                                'Part-Time',
                            ]"
                        >
                            <button
                                type="button"
                                class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none hover:border-indigo-400 focus:outline-none focus:scale-95 hover:-translate-y-1"
                                v-bind:class="{
                                    'border-0 bg-indigo-800 text-gray-50':
                                        arrJobType.includes(thisType),
                                }"
                                v-on:click="
                                    () => {
                                        if (arrJobType.includes(thisType)) {
                                            arrJobType = arrJobType.filter(
                                                (el) => el !== thisType
                                            );
                                            jobType = arrJobType.join(',');
                                        } else {
                                            arrJobType.push(thisType);
                                            jobType = arrJobType.join(',');
                                        }
                                        console.log(jobType);
                                    }
                                "
                            >
                                {{ thisType }}
                            </button>
                        </template>
                    </div>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Job field</label>
                    <SelectCustom
                        v-model="jobField"
                        heightselect="40"
                        widthselect="full"
                        placeholderval="Choose job field"
                        v-bind:isdisabled="false"
                    >
                        <template
                            v-for="opt in [
                                'Computer Technology/IT/Software',
                                'Finance/Accounting',
                                'Marketing/Advertising',
                                'Sales/Business Development',
                                'Human Resources',
                                'Operations/Logistics',
                                'Customer Service/Support',
                                'Healthcare/Medical',
                                'Engineering (e.g., Civil, Mechanical, Electrical)',
                                'Education/Teaching',
                                'Administration/Management',
                                'Consulting',
                                'Legal',
                                'Design/Creative (e.g., Graphic Design, UX/UI Design)',
                                'Research/Development',
                                'Science/Laboratory',
                                'Media/Communications',
                                'Hospitality/Travel/Tourism',
                                'Manufacturing/Production',
                                'Social Services/Non-profit',
                            ]"
                        >
                            <OptionCustom
                                v-bind:optionvalue="opt"
                                v-on:click="
                                    () => {
                                        jobField = opt;
                                    }
                                "
                                v-bind:class="{
                                    'rounded-md shadow-inner bg-indigo-100':
                                        jobField === opt,
                                }"
                            />
                        </template>
                    </SelectCustom>
                </div>
                <div class="mt-4 max-w-lg">
                    <label class="mb-2 block">Recruitment status</label>
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
                <div class="mt-6 flex gap-2 max-md:mb-4">
                    <button
                        class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        type="reset"
                    >
                        Clear All
                    </button>
                    <button
                        class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        type="submit"
                        v-bind:disabled="preventSubmit()"
                        v-bind:class="{
                            'disabled:cursor-not-allowed opacity-60':
                                preventSubmit(),
                        }"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
        <br />
    </div>
</template>
