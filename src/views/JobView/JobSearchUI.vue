<script setup>
import { onBeforeMount, onMounted, ref } from "vue";
import NavApplicant from "../../components/NavApplicant.vue";
import { user, candidate_profile, isAuthenticated } from "../../stores";
import NavPublic from "../../components/NavPublic.vue";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";

document.title = "Job Search - Hireflash";

const showNavApplicant = ref(false);

onBeforeMount(() => {
    showNavApplicant.value = isAuthenticated.value;
});

const jobAdvertise = ref("General Worker");

const jobList = [
    "Software Engineer",
    "Accountant",
    "Technician",
    "Sales Director",
    "Auditor",
    "Human Resources Officer",
    "Financial Manager",
    "Clerk",
    "General Worker",
    "Kitchen Assistant",
    "Tutor",
];

function changeJob(jobList) {
    jobAdvertise.value = jobList[Math.floor(Math.random() * jobList.length)];
}

setInterval(changeJob, 5000, jobList);

const jobSearch = ref("");
const jobType = ref("");
const jobField = ref("");

function firstTimeClick() {
    jobSearch.value = jobAdvertise.value;
}
</script>

<template>
    <main class="bg-indigo-50 w-full min-h-screen">
        <NavApplicant v-bind:shownav="showNavApplicant" />
        <NavPublic v-bind:shownav="!showNavApplicant" />
        <section class="w-full grid place-items-center" style="height: 75vh">
            <form
                class="w-1/2 max-sm:w-[95vw] max-md:w-[85vw] max-lg:w-[75vw] max-md:p-4"
                action="/job/result"
            >
                <div class="bg-gray-50 rounded-md shadow-lg p-6">
                    <h1 class="text-center text-3xl font-bold mb-4">
                        Get your dream job
                    </h1>
                    <div class="flex gap-2">
                        <input
                            type="search"
                            class="flex-grow w-96 rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 max-md:w-full"
                            v-bind:placeholder="jobAdvertise"
                            v-model="jobSearch"
                            v-on:click="firstTimeClick()"
                            name="q"
                        />
                        <button
                            class="flex justify-center items-center rounded-md bg-indigo-800 text-gray-50 px-4 py-2 w-36 gap-2 max-md:w-16 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                            type="submit"
                        >
                            <p class="max-md:hidden">Search</p>
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
                <!-- <div class="mt-4 max-md:gap-1 px-6">
                    <p>Filter: &nbsp;&nbsp;</p>
                    <div class="grid grid-cols-2 max-md:grid-cols-1 gap-2">
                        <select
                            name="f"
                            v-model="jobField"
                            class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 w-full"
                        >
                            <option value="" selected>Choose Job Field</option>
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
                                <option v-bind:value="opt">{{ opt }}</option>
                            </template>
                        </select>
                        <select
                            name="t"
                            v-model="jobType"
                            class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 w-full"
                        >
                            <option value="" selected>Choose Job Type</option>
                            <template
                                v-for="opt in [
                                    'Permanent',
                                    'Contract',
                                    'Internship',
                                    'Full-Time',
                                    'Part-Time',
                                ]"
                            >
                                <option v-bind:value="opt">{{ opt }}</option>
                            </template>
                        </select>
                    </div>
                </div> -->
            </form>
        </section>
    </main>
</template>
