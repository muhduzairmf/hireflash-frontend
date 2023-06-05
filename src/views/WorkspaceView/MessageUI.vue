<script setup>
import { ref } from "vue";
import { baseEndpoint } from "../../stores";
import router from "../../router";

document.title = "Message - Hireflash";

const textareaElm = ref(null);

function textareaResize() {
    textareaElm.value.style.height = "3rem";
    textareaElm.value.style.height = textareaElm.value.scrollHeight + "px";
}

const message = ref("");
</script>

<template>
    <div class="max-w-7xl mx-auto px-6 max-md:px-3">
        <div
            class="w-full bg-gray-50 rounded-md shadow-lg px-12 py-6 max-md:px-4 max-md:py-2"
        >
            <div class="mt-2 flex items-center gap-2">
                <router-link
                    to="/workspace/inbox"
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
                        Yasir Mahmud
                    </h1>
                </div>
                <!-- receiver side -->
                <div class="flex gap-2">
                    <img
                        src="https://api.dicebear.com/5.x/initials/svg?seed=yasir&backgroundColor=E5E7EB&scale=83"
                        alt=""
                        class="border-2 border-indigo-200 rounded-md w-12 h-12 bg-gray-200"
                    />
                    <!-- message content -->
                    <div class="flex flex-col gap-2">
                        <div class="flex flex-col">
                            <div
                                class="py-2 px-4 bg-indigo-200 rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                            >
                                Lorem ipsum dolor, sit amet..
                            </div>
                            <small class="text-gray-500">19:58</small>
                        </div>
                        <div class="flex flex-col">
                            <div
                                class="py-2 px-4 bg-indigo-200 rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                            >
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Rerum officia dolore nesciunt.
                            </div>
                            <small class="text-gray-500">19:58</small>
                        </div>
                    </div>
                </div>
                <!-- sender side -->
                <div class="flex flex-row-reverse gap-2">
                    <img
                        src="https://api.dicebear.com/5.x/initials/svg?seed=user&backgroundColor=000000&scale=83"
                        alt=""
                        class="border-2 border-indigo-200 rounded-md w-12 h-12 bg-gray-200"
                    />
                    <!-- message content -->
                    <div class="flex flex-col items-end gap-2">
                        <div class="flex flex-col items-end">
                            <div
                                class="py-2 px-4 bg-indigo-800 text-white rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                            >
                                Lorem ipsum dolor, sit amet..
                            </div>
                            <small class="text-gray-500">19:58</small>
                        </div>
                        <div class="flex flex-col items-end">
                            <div
                                class="py-2 px-4 bg-indigo-800 text-white rounded-md w-fit max-w-sm max-md:text-sm max-md:py-1 max-md:px-2"
                            >
                                Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Rerum officia dolore nesciunt.
                            </div>
                            <small class="text-gray-500">19:58</small>
                        </div>
                    </div>
                </div>
                <form
                    class="mt-4 flex items-center max-md:mb-4"
                    v-on:submit.prevent="() => {}"
                >
                    <textarea
                        class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 h-12 bg-gray-50 resize-none overflow-y-hidden hover:outline-none focus:outline-none focus:border-indigo-400 placeholder:text-gray-300 max-md:py-1 max-md:px-2"
                        ref="textareaElm"
                        v-on:input="textareaResize()"
                        v-model="message"
                    ></textarea>
                    <button
                        type="submit"
                        class="px-4 py-2 rounded-md hover:shadow-inner hover:bg-indigo-100 max-md:py-1 max-md:px-2"
                        v-bind:disabled="message === ''"
                        v-bind:class="{
                            'disabled:cursor-not-allowed opacity-60':
                                message === '',
                        }"
                    >
                        <i class="bi bi-send text-2xl"></i>
                    </button>
                </form>
            </div>
        </div>
        <br />
    </div>
</template>
