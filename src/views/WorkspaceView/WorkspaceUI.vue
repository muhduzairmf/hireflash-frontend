<script setup>
import { onMounted, ref } from "vue";
import DialogModal from "../../components/DialogModal.vue";
import TitleBorder from "../../components/TitleBorder.vue";
import router from "../../router";
import { company, user, baseEndpoint } from "../../stores";
import Loading from "../../components/Loading.vue";
import { getFullRole } from "../../lib/Auth";

document.title = "Workspace - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/job/company/" + company.value.id,
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

        const response2 = await fetch(
            baseEndpoint + "/officer/company/" + company.value.id,
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
            return;
        } else {
            officerList.value = res2.data;

            const response3 = await fetch(
                baseEndpoint + "/message/" + user.value.id + "/unread",
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
            } else {
                unreadInbox.value = res3.data;
                console.log(res3.data);

                isLoaded.value = true;
            }
        }
    }
});

const recruitList = ref([]);
const officerList = ref([]);
const unreadInbox = ref([]);

const isOpenInfo = ref(false);

function toggleModelInfo() {
    isOpenInfo.value = !isOpenInfo.value;
}
</script>

<template>
    <!-- <main class="bg-indigo-50 w-full min-h-screen">
        <section class="flex">
            <div class="min-w-fit">
                <SidebarWork />
            </div>
            <div class="flex-grow h-screen overflow-y-scroll">
                
            </div>
        </section>
    </main> -->
    <div>
        <div class="w-full bg-gray-50 h-40 relative max-md:h-24">
            <div
                class="max-w-5xl mx-auto flex items-center gap-4 relative w-full top-20 max-md:w-[95%] max-md:top-12 max-md:gap-2"
            >
                <div
                    class="border-2 border-indigo-200 rounded-md w-32 h-32 bg-gray-50 max-md:w-20 max-md:h-20"
                >
                    <img
                        v-bind:src="company.pic"
                        alt=""
                        class="w-full h-auto"
                    />
                </div>
                <div>
                    <h4 class="font-semibold text-xl max-md:text-lg">
                        {{ company.name }}
                    </h4>
                    <br />
                </div>
                <button
                    class="absolute top-0 right-0 py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    v-on:click="toggleModelInfo()"
                    title="Company Information"
                >
                    <i class="bi bi-info-circle"></i>
                </button>
            </div>
        </div>
        <!-- dialog modal component -->
        <DialogModal
            v-on:toggle="toggleModelInfo()"
            v-show="isOpenInfo"
            modaltype="small"
        >
            <div class="flex flex-col justify-center items-center my-4">
                <img
                    v-bind:src="company.pic"
                    alt=""
                    class="border-2 border-indigo-200 rounded-md w-40 h-40 transition ease-in-out text-center hover:rotate-[5deg]"
                />
                <h1 class="text-lg font-bold">Company Information</h1>
            </div>
            <div class="mb-4">
                <TitleBorder title="Organization Name" />
                <p>{{ company.name }}</p>
            </div>
            <div class="mb-4">
                <TitleBorder title="Official Website" />
                <p>{{ company.website }}</p>
            </div>
            <div class="mb-4">
                <TitleBorder title="Main Office/HQ Address" />
                <p>
                    {{
                        company.address_line1 +
                        ", " +
                        company.address_line2 +
                        ", " +
                        company.postal_code +
                        ", " +
                        company.city +
                        ", " +
                        company.state +
                        ", " +
                        company.country
                    }}
                </p>
            </div>
            <div class="mb-4">
                <TitleBorder title="Description" />
                <p>{{ company.desc }}</p>
            </div>
        </DialogModal>
        <div class="max-w-5xl mx-auto max-md:mx-3 max-md:text-[0.95rem]">
            <h2
                class="text-2xl font-semibold mt-20 mb-4 max-md:mt-12 max-md:text-xl"
            >
                Welcome back, {{ user.name }}!
            </h2>

            <div
                class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg mb-4 max-md:px-4 max-md:py-2"
            >
                <TitleBorder title="Current Recruitment(s)" />
                <template v-if="isLoaded">
                    <template v-if="recruitList.length > 0">
                        <div
                            class="flex justify-between items-center py-4 max-md:flex-col max-md:items-start max-md:gap-2"
                            v-for="recruit in recruitList"
                        >
                            <div class="">
                                <h4 class="text-xl font-semibold">
                                    {{ recruit.designation }}
                                </h4>
                                <p>
                                    Last updated &nbsp;:&nbsp;
                                    {{ recruit.last_modified_date }}
                                </p>
                            </div>
                            <div
                                class="bg-indigo-800 py-1 px-4 rounded-md text-gray-50 text-sm max-md:px-2 max-md:text-xs"
                            >
                                Advertised
                            </div>
                        </div>
                    </template>
                    <div
                        class="flex justify-start items-center py-4 max-md:flex-col max-md:items-start max-md:gap-2"
                        v-else
                    >
                        <h4 class="text-lg text-indigo-300 italic">
                            No recruitment in progress...
                        </h4>
                    </div>
                </template>
                <div
                    class="flex justify-start items-center py-4 max-md:flex-col max-md:items-start max-md:gap-2"
                    v-else
                >
                    <Loading color="indigo" />
                </div>
            </div>

            <div
                class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg mb-4 max-md:px-4 max-md:py-2"
            >
                <TitleBorder title="Inbox" />
                <template v-if="isLoaded">
                    <template v-if="unreadInbox.length > 0">
                        <div
                            class="flex justify-between items-center py-4 relative"
                        >
                            <div class="">
                                <h4 class="text-xl font-semibold">
                                    Yasir Mahmud
                                </h4>
                                <p class="max-md:text-sm">
                                    Please update a new description for Full
                                    Stack Developer about.....
                                </p>
                            </div>
                            <div
                                class="bg-indigo-800 py-1 px-4 rounded-md text-gray-50 text-sm max-md:px-2 max-md:text-xs"
                            >
                                2
                            </div>
                            <span
                                class="absolute top-0 right-1 max-md:top-4 max-md:right-0"
                                ><small>19:58</small></span
                            >
                        </div>
                    </template>
                    <div
                        class="flex justify-start items-center py-4 relative"
                        v-else
                    >
                        <h4 class="text-lg text-indigo-300 italic">
                            No unread message...
                        </h4>
                    </div>
                </template>
                <div
                    class="flex justify-between items-center py-4 relative"
                    v-else
                >
                    <Loading color="indigo" />
                </div>
            </div>

            <div
                class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg mb-4 max-md:px-4 max-md:py-2"
            >
                <TitleBorder title="All Officers" />
                <template v-if="isLoaded">
                    <template v-if="officerList.length > 0">
                        <div
                            class="flex gap-4 py-4"
                            v-for="theOfficer in officerList"
                        >
                            <img
                                src=""
                                alt=""
                                class="border-2 border-indigo-200 rounded-md w-24 h-24 bg-gray-200 max-md:w-16 max-md:h-16"
                            />
                            <div class="">
                                <h4 class="text-xl font-semibold">
                                    {{ theOfficer.user.name }}
                                </h4>
                                <p>
                                    <i class="bi bi-person-video3"></i>
                                    &nbsp;&nbsp;
                                    {{ getFullRole(theOfficer.position) }}

                                    <span
                                        v-if="
                                            user.name === theOfficer.user.name
                                        "
                                        >(You)</span
                                    >
                                </p>
                            </div>
                        </div>
                    </template>
                    <div
                        class="flex gap-4 justify-between items-center py-4"
                        v-else
                    >
                        <h4 class="text-lg text-indigo-300 italic">
                            No officer has been added...
                        </h4>
                    </div>
                </template>
                <div
                    class="flex gap-4 justify-between items-center py-4"
                    v-else
                >
                    <Loading color="indigo" />
                </div>
            </div>

            <div
                class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg mb-4 max-md:px-4 max-md:py-2"
            >
                <TitleBorder title="History progress" />
                <div class="py-4">
                    <div class="flex gap-4 items-center">
                        <i class="bi bi-check-circle-fill text-indigo-800"></i>
                        <div>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </div>
                    </div>
                    <div class="flex flex-col my-2">
                        <i class="bi bi-chevron-down text-indigo-800"></i
                        ><i class="bi bi-chevron-down text-indigo-800"></i
                        ><i class="bi bi-chevron-down text-indigo-800"></i>
                    </div>
                    <div class="flex gap-4 items-center">
                        <i class="bi bi-check-circle-fill text-indigo-800"></i>
                        <div>
                            Lorem ipsum dolor sit amet consectetur adipisicing.
                        </div>
                    </div>
                </div>
            </div>
            <br /><br />
        </div>
    </div>
</template>
