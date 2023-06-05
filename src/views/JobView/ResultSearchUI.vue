<script setup>
import { ref, onBeforeMount, onMounted, watchEffect } from "vue";
import ToastMsg from "../../components/ToastMsg.vue";
import NavApplicant from "../../components/NavApplicant.vue";
import router from "../../router";
import TitleBorder from "../../components/TitleBorder.vue";
import DialogModal from "../../components/DialogModal.vue";
import {
    user,
    candidate_profile,
    isAuthenticated,
    baseEndpoint,
} from "../../stores";
import NavPublic from "../../components/NavPublic.vue";
import Loading from "../../components/Loading.vue";

document.title = "Result Search - Hireflash";

const showNavApplicant = ref(false);

onBeforeMount(() => {
    showNavApplicant.value = isAuthenticated.value;
});

const isLoaded = ref(false);

onMounted(async () => {
    jobQuery.value = router.currentRoute.value.query.q;
    jobType.value = router.currentRoute.value.query.t;
    jobField.value = router.currentRoute.value.query.f;
    jobLocation.value = router.currentRoute.value.query.loc;
    jobPosted.value = router.currentRoute.value.query.post;

    if (jobQuery.value === undefined) {
        router.replace("/job/search");
        return;
    }

    let fetchEndpoint =
        baseEndpoint + "/job/search?q=" + encodeURIComponent(jobQuery.value);

    if (jobType.value) {
        if (jobType.value.includes(",")) {
            allJobType.value = jobType.value.split(",");
        } else {
            allJobType.value = [...allJobType.value, jobType.value];
        }

        fetchEndpoint += "&t=" + jobType.value;
    }

    if (jobField.value) {
        fetchEndpoint += "&f=" + jobField.value;
    }

    if (jobLocation.value) {
        fetchEndpoint += "&loc=" + jobLocation.value;
    }

    if (jobPosted.value) {
        fetchEndpoint += "&post=" + jobPosted.value;
    }

    const response = await fetch(fetchEndpoint, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });

    const res = await response.json();

    if (response.status !== 200) {
        toggleToastMsg("Failed to search the job. Please try again.");
    } else {
        jobList.value = res.data.list;
        uniqueLocations.value = res.data.uniqueLocations;
        // console.log(res.data);

        isLoaded.value = true;
    }
});

const jobQuery = ref("");
const jobType = ref("any");
const jobField = ref("");
const jobLocation = ref("");
const jobPosted = ref("");

const allJobType = ref([]);

function convertValue() {
    if (allJobType.value.length < 0) {
        return;
    } else if (allJobType.value.length === 1) {
        jobType.value = allJobType.value[0];
    }

    jobType.value = allJobType.value.join(",");
}

const jobList = ref([]);

const uniqueLocations = ref([]);

const showFilter = ref(
    window.matchMedia("(max-width: 768px)").matches ? false : true
);
const btnFilterLabel = ref(
    window.matchMedia("(max-width: 768px)").matches
        ? "Open filter"
        : "Close filter"
);

function toggleFilterSection() {
    showFilter.value = !showFilter.value;

    if (showFilter.value === false) {
        btnFilterLabel.value = "Open filter";
    } else if (showFilter.value === true) {
        btnFilterLabel.value = "Close filter";
    }
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

function copyLinkJob() {
    navigator.clipboard.writeText("http://localhost:5173/job/e5221fc309");
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
        wishlist.value = [
            ...wishlist.value,
            {
                id: crypto.randomUUID(),
                notes: "",
                is_only_wish: true,
                candidate_profile_id: candidate_profile.value.id,
                job_id: job_id,
            },
        ];

        toggleToastMsg("Successfully added to Wishlist");
    }
}

const wishlist = ref([]);

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
        }
    }
});
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <main class="bg-indigo-50 w-full min-h-screen">
        <NavApplicant v-bind:shownav="showNavApplicant" />
        <NavPublic v-bind:shownav="!showNavApplicant" />
        <section class="max-w-7xl mx-auto px-4">
            <form
                class="bg-gray-50 p-6 rounded-md shadow-lg w-full mt-12 max-md:mt-8"
                action="/job/result"
            >
                <h1 class="text-center text-3xl font-bold mb-4">
                    Get your dream job
                </h1>
                <div class="flex gap-2 max-w-xl mx-auto">
                    <input
                        type="search"
                        class="flex-grow w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300"
                        placeholder="Job Position"
                        v-model="jobQuery"
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
            </form>
            <div class="flex max-md:flex-col gap-4 mt-4">
                <div class="hidden max-md:flex flex-row-reverse">
                    <button
                        class="rounded-md shadow-lg bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        v-on:click="toggleFilterSection()"
                    >
                        {{ btnFilterLabel }} &nbsp;<i class="bi bi-filter"></i>
                    </button>
                </div>
                <div class="w-72 max-md:w-full" v-show="showFilter">
                    <form
                        class="bg-gray-50 px-6 py-4 rounded-md shadow-lg w-full"
                    >
                        <input type="hidden" name="q" v-model="jobQuery" />
                        <div class="mb-4">
                            <TitleBorder title="Job Field" />
                            <select
                                class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 w-full"
                                name="f"
                                v-model="jobField"
                            >
                                <option value="">Any</option>
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
                                    <option>
                                        {{ opt }}
                                    </option>
                                </template>
                            </select>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Job Type" />
                            <input type="hidden" name="t" v-model="jobType" />
                            <div class="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 max-md:w-5 max-md:h-5 accent-indigo-800 fill-transparent"
                                    value="Permanent"
                                    v-model="allJobType"
                                    v-on:change="convertValue()"
                                />
                                <span>Permanent</span>
                            </div>
                            <div class="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 max-md:w-5 max-md:h-5 accent-indigo-800"
                                    value="Contract"
                                    v-model="allJobType"
                                    v-on:change="convertValue()"
                                />
                                <span>Contract</span>
                            </div>
                            <div class="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 max-md:w-5 max-md:h-5 accent-indigo-800"
                                    value="Internship"
                                    v-model="allJobType"
                                    v-on:change="convertValue()"
                                />
                                <span>Internship</span>
                            </div>
                            <div class="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 max-md:w-5 max-md:h-5 accent-indigo-800"
                                    value="Full-Time"
                                    v-model="allJobType"
                                    v-on:change="convertValue()"
                                />
                                <span>Full-Time</span>
                            </div>
                            <div class="flex items-center mb-2 gap-2">
                                <input
                                    type="checkbox"
                                    class="w-4 h-4 max-md:w-5 max-md:h-5 accent-indigo-800"
                                    value="Part-Time"
                                    v-model="allJobType"
                                    v-on:change="convertValue()"
                                />
                                <span>Part-Time</span>
                            </div>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Location" />
                            <select
                                class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 w-full"
                                name="loc"
                                v-model="jobLocation"
                            >
                                <option value="">Any</option>
                                <template v-for="location in uniqueLocations">
                                    <option>
                                        {{ location }}
                                    </option>
                                </template>
                            </select>
                        </div>
                        <div class="mb-4">
                            <TitleBorder title="Posted within" />
                            <select
                                class="rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-400 w-full"
                                name="post"
                                v-model="jobPosted"
                            >
                                <option value="">Any</option>
                                <option value="1">Today</option>
                                <option value="7">Last 7 days</option>
                                <option value="14">Last 14 days</option>
                                <option value="30">Last 30 days</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            class="flex justify-center items-center rounded-md bg-indigo-800 text-gray-50 px-4 py-2 w-full gap-2 mb-4 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                        >
                            <p>Apply</p>
                            <i class="bi bi-funnel"></i>
                        </button>
                    </form>
                </div>
                <div
                    class="flex-grow bg-gray-50 w-full px-4 py-2 rounded-md shadow-lg max-md:px-6 max-md:py-3"
                >
                    <template v-if="isLoaded">
                        <template v-if="jobList.length > 0">
                            <div
                                class="m-6 max-md:m-0 max-md:mt-4"
                                v-for="job in jobList"
                            >
                                <!-- icon with dropdown -->
                                <div class="relative group">
                                    <button class="absolute top-0 right-0">
                                        <i
                                            class="bi bi-three-dots-vertical text-lg"
                                        ></i>
                                    </button>
                                    <div
                                        class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 w-44 py-4 rounded-md shadow-lg outline outline-2 outline-indigo-200"
                                    >
                                        <div class="flex flex-col">
                                            <router-link
                                                class="py-2 px-4 text-left hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                                v-bind:to="
                                                    `/job/` + job.item.id
                                                "
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
                                                    addToWishlist(job.item.id)
                                                "
                                                v-if="
                                                    user.id &&
                                                    wishlist.filter(
                                                        (wish) =>
                                                            wish.job_id ===
                                                            job.item.id
                                                    ).length === 0
                                                "
                                            >
                                                Add to Wishlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- job desc -->
                                <div
                                    class="flex items-center gap-4 max-md:flex-col max-md:items-start"
                                >
                                    <img
                                        v-bind:src="job.item.company.pic"
                                        alt=""
                                        class="border-2 border-indigo-200 rounded-md w-32 h-32 max-md:w-16 max-md:h-16"
                                    />
                                    <div class="">
                                        <router-link
                                            class="text-2xl font-semibold mb-1 hover:underline cursor-pointer max-md:text-xl"
                                            title="Preview the job"
                                            v-bind:to="'/job/' + job.item.id"
                                        >
                                            {{ job.item.designation }}
                                        </router-link>
                                        <div
                                            class="flex gap-6 mb-1 max-md:flex-col max-md:gap-1"
                                        >
                                            <router-link
                                                class="hover:underline cursor-pointer"
                                                v-bind:to="
                                                    '/company/' +
                                                    job.item.company.id
                                                "
                                                >{{
                                                    job.item.company.name
                                                }}</router-link
                                            >
                                            <p class="flex items-center">
                                                <i class="bi bi-geo-alt"></i
                                                >&nbsp;<span>{{
                                                    job.item.company.state +
                                                    `, ` +
                                                    job.item.company.country
                                                }}</span>
                                            </p>
                                            <p class="flex items-center">
                                                <i class="bi bi-cash"></i
                                                >&nbsp;<span
                                                    >RM{{
                                                        job.item
                                                            .min_monthly_salary
                                                    }}</span
                                                >
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="mt-4 border-t-[1.5px] border-indigo-200"
                                ></div>
                            </div>
                        </template>
                        <div class="m-6 max-md:m-0 max-md:mt-4" v-else>
                            <h4 class="text-lg text-indigo-300 italic">
                                No result...
                            </h4>
                        </div>
                    </template>
                    <div class="h-full w-full grid place-items-center" v-else>
                        <Loading color="indigo" />
                    </div>
                    <br />
                </div>
            </div>
            <br />
        </section>
        <br /><br />
    </main>
</template>
