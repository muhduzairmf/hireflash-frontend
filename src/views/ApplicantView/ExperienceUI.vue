<script setup>
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import { baseEndpoint, candidate_profile } from "../../stores";
import Loading from "../../components/Loading.vue";

document.title = "Experience - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/work-experience/" + candidate_profile.value.id,
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
        experienceList.value = res.data;

        isLoaded.value = true;
    }
});

const addNewExp = ref(true);
const btnName = ref("Add New");

function toggleAddNew() {
    addNewExp.value = !addNewExp.value;
    if (addNewExp.value) {
        btnName.value = "Add New";
    } else {
        btnName.value = "Cancel";
    }
}

const startDate = ref("");
const endDate = ref("");

const jobPosition = ref("");
const companyName = ref("");
const companyLocation = ref("");
const monthlySalary = ref("");

let newExperience = {
    jobPosition: "",
    startDate: "",
    endDate: "",
    duration: "",
    companyName: "",
    companyLocation: "",
    monthlySalary: "",
};

const experienceList = ref([]);

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

async function saveNewExp() {
    dayjs.extend(relativeTime);

    console.log(dayjs(startDate.value).format("D MMMM YYYY"));
    console.log(dayjs(endDate.value).format("D MMMM YYYY"));
    console.log(dayjs(startDate.value).to(dayjs(endDate.value), true));

    newExperience.jobPosition = jobPosition.value;
    newExperience.startDate = dayjs(startDate.value).format("D MMMM YYYY");
    newExperience.endDate = dayjs(endDate.value).format("D MMMM YYYY");
    newExperience.duration = dayjs(startDate.value).to(
        dayjs(endDate.value),
        true
    );
    newExperience.companyName = companyName.value;
    newExperience.companyLocation = companyLocation.value;
    newExperience.monthlySalary = monthlySalary.value;

    const response = await fetch(baseEndpoint + "/work-experience", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            position: newExperience.jobPosition,
            start_date: newExperience.startDate,
            end_date: newExperience.endDate,
            duration: newExperience.duration,
            company_name: newExperience.companyName,
            company_address: newExperience.companyLocation,
            monthly_salary: newExperience.monthlySalary,
            candidate_profile_id: candidate_profile.value.id,
        }),
    });
    const res = await response.json();
    if (response.status !== 201) {
        alert("error occured");
    } else {
        isLoaded.value = false;

        const response2 = await fetch(
            baseEndpoint + "/work-experience/" + candidate_profile.value.id,
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
            alert("error occured");
        } else {
            experienceList.value = res2.data;

            isLoaded.value = true;

            jobPosition.value = "";
            startDate.value = "";
            endDate.value = "";
            companyName.value = "";
            companyLocation.value = "";
            monthlySalary.value = "";

            toggleToastMsg("New work experience has been added.");

            toggleAddNew();
        }
    }
}

const isOpenRemove = ref(false);
const experienceId = ref("");

function toggleModalRemove(expId) {
    if (expId) {
        experienceId.value = expId;
    }

    isOpenRemove.value = !isOpenRemove.value;
}

async function removeExperience() {
    const response = await fetch(
        baseEndpoint + "/work-experience/" + experienceId.value,
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
        alert("error occured");
    } else {
        isLoaded.value = false;

        const response2 = await fetch(
            baseEndpoint + "/work-experience/" + candidate_profile.value.id,
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
            alert("error occured");

            toggleModalRemove();

            experienceId.value = "";
        } else {
            experienceList.value = res2.data;

            isLoaded.value = true;

            toggleModalRemove();

            experienceId.value = "";

            toggleToastMsg(
                "Successfully removed from your work experience list."
            );
        }
    }
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
            <TitleBorder title="Work experience" />
            <template v-if="isLoaded">
                <div
                    class="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1"
                    v-if="experienceList.length > 0"
                >
                    <div
                        class="border-2 border-indigo-200 rounded-md px-6 py-4 relative group/item"
                        v-for="exp in experienceList"
                    >
                        <h1 class="text-lg font-bold">{{ exp.position }}</h1>
                        <p>
                            {{ exp.start_date }} until
                            {{ exp.end_date }}&nbsp;&nbsp;-&nbsp;&nbsp;{{
                                exp.duration
                            }}
                        </p>
                        <p>{{ exp.company_name }}</p>
                        <p>{{ exp.company_address }}</p>
                        <p>RM{{ exp.monthly_salary }}</p>
                        <button
                            class="py-1 px-2 absolute bottom-2 right-2 invisible group-hover/item:visible hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            v-on:click="toggleModalRemove(exp.id)"
                            title="Delete"
                        >
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-8 text-lg text-indigo-300 italic" v-else>
                    No work experience added...
                </div>
            </template>
            <div class="mt-4 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="toggleAddNew()"
                >
                    {{ btnName }}
                </button>
            </div>
        </div>
        <form
            class="mb-8"
            v-bind:class="{ hidden: addNewExp }"
            v-on:submit.prevent="saveNewExp()"
        >
            <div class="mt-4">
                <label class="mb-2 block">Job Position</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="General Worker"
                    v-model="jobPosition"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Start Date</label>
                <input
                    type="date"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="2003-01-08"
                    v-model="startDate"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">End Date</label>
                <input
                    type="date"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="2003-01-08"
                    v-model="endDate"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Company Name</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="Hireflash Inc."
                    v-model="companyName"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Company Location</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="Cambridge, UK"
                    v-model="companyLocation"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Monthly Salary (RM)</label>
                <input
                    type="number"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="3000"
                    v-model="monthlySalary"
                />
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-bind:disabled="
                        jobPosition === '' ||
                        startDate === '' ||
                        endDate === '' ||
                        companyName === '' ||
                        companyLocation === '' ||
                        monthlySalary === ''
                    "
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            jobPosition === '' ||
                            startDate === '' ||
                            endDate === '' ||
                            companyName === '' ||
                            companyLocation === '' ||
                            monthlySalary === '',
                    }"
                >
                    Save
                </button>
            </div>
        </form>
        <DialogModal
            v-on:toggle="toggleModalRemove()"
            v-show="isOpenRemove"
            modaltype="small"
        >
            <br class="mb-2" />
            <p>Confirm to remove from your work experience?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="removeExperience()"
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
</template>
