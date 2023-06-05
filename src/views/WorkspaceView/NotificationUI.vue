<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint } from "../../stores";
import router from "../../router";

document.title = "Notifications - Hireflash";

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

const notificationList = ref([
    {
        id: "abcd126",
        content: "CyberSecurity Analyst from Umbrella Inc. has been closed.",
        category: "recruit",
        isRead: false,
    },
    {
        id: "abcd125",
        content:
            "You have been listed in Interview List! (CyberSecurity Analyst from Umbrella Inc.)",
        category: "listed",
        isRead: true,
    },
    {
        id: "abcd124",
        content:
            "You have been listed in Shortlist! (CyberSecurity Analyst from Umbrella Inc.)",
        category: "listed",
        isRead: true,
    },
    {
        id: "abcd123",
        content: "HR Officer from Umbrella Inc. has viewed your resume",
        category: "view",
        isRead: true,
    },
]);

// function to make a notification status to true (has read)
async function wasRead(notificationId) {
    // const response = await fetch(baseEndpoint + "", {
    //     method: "PATCH",
    //     mode: "cors",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "same-origin",
    //     body: JSON.stringify({}),
    // });

    // const res = await response.json();

    // if (response.status) {
    // } else {
    // const response2 = await fetch(baseEndpoint + "", {
    //     method: "GET",
    //     mode: "cors",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "same-origin",
    //     body: JSON.stringify({}),
    // });

    // const res2 = await response2.json();

    // if (response2.status) {
    // } else {
    // }
    // }

    notificationList.value.forEach((noti) => {
        if (noti.id === notificationId) {
            noti.isRead = true;
        }
    });

    if (
        notificationList.value.filter((noti) => noti.isRead === false)
            .length === 0
    ) {
        disableBtn.value = true;
    }
}

const hideToastMsg = ref(true);
const disableBtn = ref(
    notificationList.value.filter((noti) => noti.isRead === false).length === 0
);

// function to make all notifications status to true (has read)
async function readAll() {
    // const response = await fetch(baseEndpoint + "", {
    //     method: "PATCH",
    //     mode: "cors",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "same-origin",
    //     body: JSON.stringify({}),
    // });

    // const res = await response.json();

    // if (response.status) {
    // } else {
    // const response2 = await fetch(baseEndpoint + "", {
    //     method: "GET",
    //     mode: "cors",
    //     headers: { "Content-Type": "application/json" },
    //     credentials: "same-origin",
    //     body: JSON.stringify({}),
    // });

    // const res2 = await response2.json();

    // if (response2.status) {
    // } else {
    // }
    // }

    notificationList.value.forEach((noti) => {
        if (noti.isRead === false) {
            noti.isRead = true;
        }
    });

    hideToastMsg.value = !hideToastMsg.value;

    setTimeout(() => {
        hideToastMsg.value = !hideToastMsg.value;
    }, 3000);

    disableBtn.value =
        notificationList.value.filter((noti) => noti.isRead === false)
            .length === 0;
}
</script>

<template>
    <ToastMsg msg="All notifications has been read" v-show="!hideToastMsg" />
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <TitleBorder title="Notifications" />
            <!-- natification part, use for loop to iterate all notifications -->
            <div
                class="p-4 mt-2"
                v-for="notification in notificationList"
                v-bind:class="{
                    'rounded-md shadow-inner bg-indigo-100 cursor-pointer':
                        notification.isRead === false,
                }"
                v-on:click="wasRead(notification.id)"
            >
                <p class="max-md:text-[0.95rem]">
                    <i
                        class="bi"
                        v-bind:class="{
                            'bi-journal-bookmark':
                                notification.category === 'recruit',
                            'bi-card-checklist':
                                notification.category === 'listed',
                            'bi-people': notification.category === 'view',
                        }"
                    ></i
                    >&nbsp;&nbsp; {{ notification.content }}
                </p>
            </div>
            <div class="mt-6 mb-8">
                <!-- button to mark all notifications as read -->
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="readAll()"
                    v-bind:disabled="disableBtn"
                    v-bind:class="{ 'cursor-not-allowed': disableBtn }"
                >
                    Mark All as Read
                </button>
            </div>
        </div>
        <br />
    </div>
</template>
