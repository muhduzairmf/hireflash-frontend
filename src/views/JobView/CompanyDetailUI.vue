<script setup>
import NavApplicant from "../../components/NavApplicant.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import { onMounted, ref, onBeforeMount, watchEffect } from "vue";
import router from "../../router";
import {
    user,
    candidate_profile,
    isAuthenticated,
    baseEndpoint,
} from "../../stores";
import NavPublic from "../../components/NavPublic.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import dayjs from "dayjs";
import Loading from "../../components/Loading.vue";

document.title = "Company Detail - Hireflash";

const showNavApplicant = ref(false);

onBeforeMount(() => {
    showNavApplicant.value = isAuthenticated.value;
});

const isLoaded = ref(false);

onMounted(async () => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const response = await fetch(
        baseEndpoint + "/company/" + router.currentRoute.value.params.companyId,
        {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({
            // }),
        }
    );

    const res = await response.json();

    if (response.status !== 200) {
        toggleToastMsg("Failed to get company detail. Please try again.");
    } else {
        company.value = res.data;

        const response2 = await fetch(
            baseEndpoint +
                "/job/company/" +
                router.currentRoute.value.params.companyId +
                "?status=Advertised",
            {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin",
                // body: JSON.stringify({
                // }),
            }
        );

        const res2 = await response2.json();

        if (response2.status !== 200) {
            toggleToastMsg("Failed to get company detail. Please try again.");
        } else {
            jobList.value = res2.data.jobList;
            uniqueField.value = res2.data.uniqueField;

            uniqueField.value.map(async (field) => {
                const response3 = await fetch(
                    baseEndpoint +
                        "/job/company/" +
                        router.currentRoute.value.params.companyId +
                        "/field/" +
                        encodeURIComponent(field),
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
                    toggleToastMsg(
                        "Failed to get department detail. Please try again."
                    );
                } else {
                    jobQuantField.value = [
                        ...jobQuantField.value,
                        res3.data.length,
                    ];
                }
            });

            isLoaded.value = true;
        }
    }
});

const company = ref({});
const jobList = ref([]);

const uniqueField = ref([]);
const jobQuantField = ref([]);

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
        <template v-if="showNavApplicant">
            <NavApplicant v-bind:shownav="showNavApplicant" />
        </template>
        <template v-else>
            <NavPublic v-bind:shownav="!showNavApplicant" />
        </template>
        <section class="max-w-7xl mx-auto px-4 mt-12 max-md:mt-8">
            <template v-if="isLoaded">
                <div
                    class="bg-gray-50 rounded-md shadow-lg w-full mt-12 max-md:mt-8"
                >
                    <div
                        class="w-full bg-company-pattern h-36 relative max-md:h-28 rounded-t-md"
                    >
                        <button
                            class="py-1 px-2 m-4 bg-transparent hover:rounded-md hover:shadow-inner hover:bg-indigo-100 mb-4 text-white hover:text-black"
                            title="Back"
                            v-on:click="
                                () => {
                                    router.back();
                                }
                            "
                        >
                            <i class="bi bi-arrow-left text-xl"></i>
                        </button>
                        <div
                            class="max-w-5xl mx-auto px-4 max-md:px-0 flex items-center gap-4 relative w-full top-0 max-md:w-[95%] max-md:gap-2"
                        >
                            <img
                                v-bind:src="company.pic"
                                alt=""
                                class="border-2 border-indigo-200 rounded-md w-32 h-32 bg-gray-50 max-md:w-20 max-md:h-20"
                            />
                            <div>
                                <h4
                                    class="font-semibold text-2xl max-md:text-xl text-white"
                                >
                                    {{ company.name }}
                                </h4>
                                <br />
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                    <br class="max-md:hidden" />
                    <div class="mx-auto max-w-5xl px-4">
                        <TitleBorder title="Company Information" />
                        <div class="mb-2 flex items-center gap-2 pt-6">
                            <h5 class="text-lg">
                                <i class="bi bi-buildings text-lg"></i>
                            </h5>
                            <h6 class="text-lg max-sm:text-base">
                                {{ company.name }}
                            </h6>
                        </div>
                        <div class="mb-2 flex items-center gap-2">
                            <h5 class="text-lg">
                                <i class="bi bi-geo-alt text-lg"></i>
                            </h5>
                            <h6 class="text-lg max-sm:text-base">
                                {{
                                    company.city +
                                    `, ` +
                                    company.state +
                                    `, ` +
                                    company.country
                                }}
                            </h6>
                        </div>
                        <div class="mb-2 flex items-center gap-2">
                            <h5 class="text-lg">
                                <i class="bi bi-link-45deg text-lg"></i>
                            </h5>
                            <h6 class="text-lg max-sm:text-base">
                                {{ company.website }}
                            </h6>
                        </div>
                        <div class="mb-2 flex items-center gap-2">
                            <h5 class="text-lg">
                                <i class="bi bi-text-paragraph text-lg"></i>
                            </h5>
                            <h6 class="text-lg max-sm:text-base">
                                {{ company.desc }}
                            </h6>
                        </div>
                        <br />
                    </div>
                    <div class="mx-auto max-w-5xl px-4">
                        <TitleBorder title="Job(s) based on Field" />
                        <div
                            class="grid grid-cols-2 gap-4 mt-4 max-w-3xl max-md:grid-cols-1"
                        >
                            <template v-for="field in uniqueField">
                                <div
                                    class="border-2 border-indigo-200 rounded-md p-4"
                                >
                                    <h2 class="text-4xl text-center">
                                        {{
                                            jobQuantField[
                                                uniqueField.indexOf(field)
                                            ]
                                        }}
                                    </h2>
                                    <p class="mt-2 text-center">{{ field }}</p>
                                </div>
                            </template>
                        </div>
                        <br />
                    </div>
                    <div class="mx-auto max-w-5xl px-4">
                        <TitleBorder
                            title="List of Current Advertised Job(s)"
                        />
                        <template v-if="jobList.length > 0">
                            <div
                                class="my-6 max-md:m-0 max-md:mt-4"
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
                                                    addToWishlist(job.id)
                                                "
                                                v-if="
                                                    user.id &&
                                                    wishlist.filter(
                                                        (wish) =>
                                                            wish.job_id ===
                                                            job.id
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
                                        v-bind:src="job.company.pic"
                                        alt=""
                                        class="border-2 border-indigo-200 rounded-md w-32 h-32 max-md:w-16 max-md:h-16"
                                    />
                                    <div class="">
                                        <router-link
                                            class="text-2xl font-semibold mb-1 hover:underline cursor-pointer select-none max-md:text-xl"
                                            title="Preview the job"
                                            v-bind:to="'/job/' + job.id"
                                        >
                                            {{ job.designation }}
                                        </router-link>
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
                        <br />
                    </div>
                </div>
            </template>
            <div class="h-full w-full grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </section>
        <br class="lg:hidden" />
        <br />
        <br />
    </main>
</template>
