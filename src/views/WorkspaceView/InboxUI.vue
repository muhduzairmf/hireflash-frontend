<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import { baseEndpoint } from "../../stores";
import router from "../../router";
import { onMounted } from "vue";

document.title = "Inbox - Hireflash";

onMounted(async () => {
    // const response = await fetch(baseEndpoint + "", {
    //     method: "GET",
    //     mode: "cors",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "same-origin",
    //     body: JSON.stringify({}),
    // });
    // const res = await response.json();
    // if (response.status) {
    // } else {
    // }
});
</script>

<template>
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <TitleBorder title="Inbox" />
            <div class="my-6">
                <router-link
                    to="/workspace/inbox/message/89hvbwug4wc"
                    class="flex justify-between items-center px-6 py-4 rounded-md relative hover:shadow-inner hover:bg-indigo-100 max-md:px-2 max-md:py-2"
                >
                    <div
                        class="flex items-center gap-4 max-md:gap-1 max-md:items-start max-md:flex-col"
                    >
                        <img
                            src=""
                            alt=""
                            class="border-2 border-indigo-200 rounded-md w-16 h-16 bg-gray-200"
                        />
                        <div>
                            <h4 class="text-xl font-semibold">Yasir Mahmud</h4>
                            <p class="max-md:text-sm">
                                Please update a new description for Full Stack
                                Developer about.....
                            </p>
                        </div>
                    </div>
                    <div
                        class="bg-indigo-800 py-1 px-4 rounded-md text-gray-50 text-sm max-md:px-2 max-md:text-xs"
                    >
                        2
                    </div>
                    <span class="absolute top-1 right-7 max-md:right-0"
                        ><small>19:58</small></span
                    >
                </router-link>
            </div>
        </div>
        <br />
    </div>
</template>
