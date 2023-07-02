<script setup>
import { ref, onMounted } from "vue";
import { baseEndpoint, user } from "../../stores";
import router from "../../router";
import { io } from "socket.io-client";
import dayjs from "dayjs";
import ToastMsg from "../../components/ToastMsg.vue";

const messageEl = ref("");
const messageList = ref([]);

onMounted(async () => {
    const response = await fetch(baseEndpoint + "/user/" + receiver_id, {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });

    const res = await response.json();

    if (response.status !== 200) {
        toggleToastMsg("Failed to load user. Please try again.");
    } else {
        receiver.value = res.data;

        const response2 = await fetch(
            baseEndpoint +
                "/message/sender/" +
                user.value.id +
                "/recipient/" +
                receiver_id,
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
            toggleToastMsg("Failed to load messages. Please try again.");
        } else {
            messageList.value = res2.data;

            const response3 = await fetch(
                baseEndpoint +
                    "/message/sender/" +
                    receiver_id +
                    "/recipient/" +
                    user.value.id,
                {
                    method: "GET",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    // body: JSON.stringify({}),
                }
            );

            const res3 = await response3.json();
            console.log(res3.data);

            if (response3.status !== 200) {
                toggleToastMsg("Failed to load messages. Please try again.");
            } else {
                messageList.value = [...messageList.value, ...res3.data];

                if (messageList.value.length < 1) {
                    return;
                }

                messageList.value.sort(compareByDate);

                messageList.value.forEach((msg) => {
                    if (receiver_id === msg.recipient_id) {
                        messageEl.value += `
                        <!-- sender side -->
                        <div class="flex flex-row-reverse gap-2">
                            <!-- message content -->
                            <div class="flex flex-col items-end gap-2">
                                <div class="flex flex-col items-end">
                                    <div
                                        class="py-2 px-4 bg-indigo-800 text-white rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                                    >
                                        ${msg.content}
                                    </div>
                                    <small class="text-gray-500">${dayjs(
                                        msg.created_date
                                    ).format("DD/MM/YYYY HH:mm")}</small>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        messageEl.value += `
                        <!-- receiver side -->
                        <div class="flex gap-2">
                            <!-- message content -->
                            <div class="flex flex-col gap-2">
                                <div class="flex flex-col">
                                    <div
                                        class="py-2 px-4 bg-indigo-200 rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                                    >
                                        ${msg.content}
                                    </div>
                                    <small class="text-gray-500">${dayjs(
                                        msg.created_date
                                    ).format("DD/MM/YYYY HH:mm")}</small>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                });

                console.log(messageList.value);
            }
        }
    }
});

const compareByDate = (a, b) => {
    const dateA = dayjs(a.created_date);
    const dateB = dayjs(b.created_date);
    return dateA.diff(dateB);
};

const textareaElm = ref(null);
const receiver_id = router.currentRoute.value.params.receiverId;
const receiver = ref({});

function textareaResize() {
    textareaElm.value.style.height = "3rem";
    textareaElm.value.style.height = textareaElm.value.scrollHeight + "px";
}

const inputMessage = ref("");

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

const socket = io("http://localhost:3000");

async function sendMessage() {
    const message = {
        content: inputMessage.value,
        is_read: false,
        // created_date: dayjs(Date.now()).format("DD/MM/YYYY HH:mm"),
        created_date: dayjs(),
        recipient_id: receiver_id,
        sender_id: user.value.id,
    };

    const response = await fetch(baseEndpoint + "/message", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(message),
    });

    const res = await response.json();

    if (response.status !== 201) {
        toggleToastMsg("Failed to send message. Please try again.");
    } else {
        socket.emit("chat", message);

        messageEl.value += `
        <!-- sender side -->
        <div class="flex flex-row-reverse gap-2">
            <!-- message content -->
            <div class="flex flex-col items-end gap-2">
                <div class="flex flex-col items-end">
                    <div
                        class="py-2 px-4 bg-indigo-800 text-white rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                    >
                        ${message.content}
                    </div>
                    <small class="text-gray-500">${dayjs(
                        message.created_date
                    ).format("DD/MM/YYYY HH:mm")}</small>
                </div>
            </div>
        </div>
        `;

        console.log(messageEl.value);

        inputMessage.value = "";
    }
}

socket.on("chat", (message) => {
    messageEl.value += `
    <!-- receiver side -->
    <div class="flex gap-2">
        <!-- message content -->
        <div class="flex flex-col gap-2">
            <div class="flex flex-col">
                <div
                    class="py-2 px-4 bg-indigo-200 rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                >
                    ${message.content}
                </div>
                <small class="text-gray-500">${dayjs(
                    message.created_date
                ).format("DD/MM/YYYY HH:mm")}</small>
            </div>
        </div>
    </div>
    `;
});
</script>

<template>
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
            <div class="mt-2 flex items-center gap-2">
                <router-link
                    to="/profile/inbox"
                    class="py-1 px-2 hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                    ><i class="bi bi-arrow-left text-xl"></i
                ></router-link>
                <h2>Inbox</h2>
            </div>
            <!-- message box -->
            <div class="m-6 max-md:m-0">
                <!-- img and name -->
                <div class="flex flex-col items-center gap-2 mb-2">
                    <img
                        src="https://api.dicebear.com/5.x/initials/svg?seed=yasir&backgroundColor=E5E7EB&scale=83"
                        alt=""
                        class="border-2 border-indigo-200 rounded-md w-20 h-20 bg-gray-200"
                    />
                    <h1 class="text-xl font-bold max-md:text-lg">
                        {{ receiver.name }}
                    </h1>
                </div>
                <div v-html="messageEl"></div>
                <form
                    class="mt-4 flex items-center max-md:mb-4"
                    v-on:submit.prevent="sendMessage()"
                >
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 h-12 bg-gray-50 resize-none overflow-y-hidden hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 max-md:py-1 max-md:px-2"
                        ref="textareaElm"
                        v-on:input="textareaResize()"
                        v-model="inputMessage"
                    ></textarea>
                    <button
                        type="submit"
                        class="px-4 py-2 rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-1 max-md:px-2"
                        v-bind:disabled="inputMessage === ''"
                        v-bind:class="{
                            'disabled:cursor-not-allowed opacity-60':
                                inputMessage === '',
                        }"
                    >
                        <i class="bi bi-send text-2xl"></i>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
