<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint, officer, successRecruit } from "../../stores";
import router from "../../router";
import { onMounted, ref } from "vue";
import Loading from "../../components/Loading.vue";
import dayjs from "dayjs";
import ToastMsg from "../../components/ToastMsg.vue";

document.title = "All Recruitment - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/job/company/" + officer.value.company_id,
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
        return;
    } else {
        recruitList.value = res.data.jobList;

        isLoaded.value = true;
    }
});

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

if (successRecruit.value === "delete") {
    toggleToastMsg("This job recruitment successfully deleted.");

    successRecruit.value = "";
}

const recruitList = ref([]);

function applyingFilter() {
    alert("Filter applied");
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <div class="flex justify-between max-md:block">
                <div>
                    <TitleBorder title="List of All Recruitment(s)" />
                </div>
                <select
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 h-7 transition ease-in-out focus:scale-95 hover:-translate-y-1 text-sm cursor-pointer"
                    v-on:change="applyingFilter()"
                >
                    <option value="">Apply filter</option>
                    <option value="">Filter 1</option>
                    <option value="">Filter 2</option>
                </select>
            </div>
            <!--  -->
            <template v-if="isLoaded">
                <div
                    class="py-4 grid grid-cols-[800px_1fr_1fr] max-md:grid-cols-1 max-md:gap-2"
                    v-for="recruit in recruitList"
                >
                    <div class="flex flex-col justify-center">
                        <router-link
                            v-bind:to="`/workspace/recruitment/` + recruit.id"
                            class="text-xl font-semibold hover:underline cursor-pointer"
                        >
                            {{ recruit.designation }}
                        </router-link>
                        <p class="max-md:text-sm">
                            Last updated &nbsp;:&nbsp;
                            {{
                                dayjs(recruit.last_modified_date).format(
                                    "D MMMM YYYY"
                                )
                            }}
                        </p>
                    </div>
                    <div class="grid place-items-center max-md:flex">
                        <div
                            class="bg-indigo-800 py-1 px-4 rounded-md text-gray-50 text-sm gap relative right-16 max-md:right-0"
                        >
                            {{ recruit.recruitment_status }}
                        </div>
                    </div>
                    <div class="relative group max-md:row-end-1">
                        <button class="absolute top-0 right-0">
                            <i
                                class="bi bi-three-dots-vertical text-lg relative"
                            ></i>
                        </button>
                        <div
                            class="absolute top-1 right-6 hidden group-focus-within:grid place-items-center bg-gray-50 w-36 py-2 rounded-md shadow-lg outline outline-2 outline-indigo-200 z-20"
                        >
                            <div class="flex flex-col">
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` + recruit.id
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    View Detail
                                </router-link>
                                <router-link
                                    v-bind:to="
                                        `/workspace/recruitment/` +
                                        recruit.id +
                                        `/edit`
                                    "
                                    class="py-2 px-4 text-left rounded-md hover:shadow-inner hover:bg-indigo-100"
                                >
                                    Edit
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
            <div class="w-full h-full grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
        </div>
        <br />
    </div>
</template>
