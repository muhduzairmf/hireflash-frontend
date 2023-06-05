<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import { baseEndpoint, candidate_profile } from "../../stores";

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
        isRead: false,
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
function wasRead(notificationId) {
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
    // }
}

const hideToastMsg = ref(true);
const disableBtn = ref(
    notificationList.value.filter((noti) => noti.isRead === false).length === 0
);

// function to make all notifications status to true (has read)
function readAll() {
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
    // notificationList.value.forEach((noti) => {
    //     if (noti.isRead === false) {
    //         noti.isRead = true;
    //     }
    // });
    // hideToastMsg.value = !hideToastMsg.value;
    // setTimeout(() => {
    //     hideToastMsg.value = !hideToastMsg.value;
    // }, 3000);
    // disableBtn.value =
    //     notificationList.value.filter((noti) => noti.isRead === false)
    //         .length === 0;
    // }
}
</script>

<template>
    <ToastMsg msg="All notifications has been read" v-show="!hideToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
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
                <p>
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
            <div class="mt-6">
                <!-- button to mark all notifications as read -->
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="readAll()"
                    v-bind:disabled="disableBtn"
                    v-bind:class="{
                        'cursor-not-allowed opacity-60': disableBtn,
                    }"
                >
                    Mark All as Read
                </button>
            </div>
        </div>
    </div>
</template>
