<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import { onMounted, ref } from "vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import { baseEndpoint, candidate_profile } from "../../stores";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import Loading from "../../components/Loading.vue";

document.title = "Language Ability - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/lang-ability/" + candidate_profile.value.id,
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
    } else {
        languageList.value = res.data;

        isLoaded.value = true;
    }
});

const addNewLang = ref(true);
const btnName = ref("Add New");

function toggleAddNew() {
    addNewLang.value = !addNewLang.value;
    if (addNewLang.value) {
        btnName.value = "Add New";
    } else {
        btnName.value = "Cancel";
    }
}

const language = ref("");
const scaleSpeak = ref("");
const scaleWrite = ref("");

let newLanguage = {
    language: "",
    scaleSpeak: "",
    scaleWrite: "",
};

const languageList = ref([]);

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

async function saveNewLang() {
    newLanguage.language = language.value;
    newLanguage.scaleSpeak = scaleSpeak.value;
    newLanguage.scaleWrite = scaleWrite.value;

    console.log(newLanguage);

    const response = await fetch(baseEndpoint + "/lang-ability", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            language_name: newLanguage.language,
            scale_of_writing: newLanguage.scaleWrite,
            scale_of_speaking: newLanguage.scaleSpeak,
            candidate_profile_id: candidate_profile.value.id,
        }),
    });
    const res = await response.json();
    if (response.status !== 201) {
        alert("error occured");
    } else {
        isLoaded.value = false;

        const response2 = await fetch(
            baseEndpoint + "/lang-ability/" + candidate_profile.value.id,
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
        } else {
            languageList.value = res2.data;

            isLoaded.value = true;

            language.value = "";
            scaleWrite.value = "";
            scaleSpeak.value = "";

            toggleToastMsg("New language ability has been added");

            toggleAddNew();
        }
    }
}

const isOpenRemove = ref(false);
const langAbilityId = ref("");

function toggleModalRemove(langId) {
    if (langId) {
        langAbilityId.value = langId;
    }

    isOpenRemove.value = !isOpenRemove.value;
}

async function removeLangAbility() {
    const response = await fetch(
        baseEndpoint + "/lang-ability/" + langAbilityId.value,
        {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            // body: JSON.stringify({}),
        }
    );
    const res = await response.json();
    if (response.status !== 200) {
        alert("error occured");
    } else {
        isLoaded.value = false;

        const response2 = await fetch(
            baseEndpoint + "/lang-ability/" + candidate_profile.value.id,
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

            toggleModalRemove();

            langAbilityId.value = "";
        } else {
            languageList.value = res2.data;

            isLoaded.value = true;

            toggleModalRemove();

            langId.value = "";

            toggleToastMsg(
                "Successfully removed from your language ability list."
            );
        }
    }
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-8">
            <TitleBorder title="Language ability" />
            <div class="mt-4" v-if="isLoaded">
                <div
                    class="border-2 border-indigo-200 rounded-md lg:w-fit overflow-x-auto"
                    v-if="languageList.length > 0"
                >
                    <table class="table-auto border-collapse">
                        <tr class="border-b-2 border-b-indigo-200">
                            <th class="px-4 py-2">Language</th>
                            <th class="px-4 py-2">Scale for Speaking</th>
                            <th class="px-4 py-2">Scale for Writing</th>
                            <th class="px-4 py-2"></th>
                        </tr>
                        <tr class="group/item" v-for="lang in languageList">
                            <td class="px-4 py-2">{{ lang.language_name }}</td>
                            <td class="px-4 py-2">
                                {{ lang.scale_of_speaking }}/5
                            </td>
                            <td class="px-4 py-2">
                                {{ lang.scale_of_writing }}/5
                            </td>
                            <td class="px-2 py-1">
                                <button
                                    class="py-1 px-2 invisible group-hover/item:visible hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                                    v-on:click="toggleModalRemove(lang.id)"
                                    title="Delete"
                                >
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="mt-8 text-lg text-indigo-300 italic" v-else>
                    No language ability added...
                </div>
            </div>
            <div class="mt-4 grid place-items-center" v-else>
                <Loading color="indigo" />
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="toggleAddNew()"
                >
                    {{ btnName }}
                </button>
            </div>
        </div>
        <form
            class="mb-8"
            v-bind:class="{ hidden: addNewLang }"
            v-on:submit.prevent="saveNewLang()"
        >
            <div class="mt-4">
                <label class="mb-2 block">Language</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="English"
                    v-model="language"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Scale for Speaking</label>
                <SelectCustom
                    v-model="scaleSpeak"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select scale"
                    v-bind:isdisabled="false"
                >
                    <template v-for="opt in ['1', '2', '3', '4', '5']">
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    scaleSpeak = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    scaleSpeak === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Scale for Writing</label>
                <SelectCustom
                    v-model="scaleWrite"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select scale"
                    v-bind:isdisabled="false"
                >
                    <template v-for="opt in ['1', '2', '3', '4', '5']">
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    scaleWrite = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    scaleWrite === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-bind:disabled="
                        language === '' ||
                        scaleSpeak === '' ||
                        scaleWrite === ''
                    "
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            language === '' ||
                            scaleSpeak === '' ||
                            scaleWrite === '',
                    }"
                >
                    Save
                </button>
            </div>
        </form>
        <DialogModal
            v-on:toggle="toggleModalRemove()"
            v-show="isOpenRemove"
            modaltype="small"
        >
            <br class="mb-2" />
            <p>Confirm to remove from your language ability list?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="removeLangAbility()"
                >
                    Yes
                </button>
                <button
                    class="rounded-md bg-gray-50 border-2 border-indigo-800 text-indigo-800 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="toggleModalRemove()"
                >
                    Cancel
                </button>
            </div>
        </DialogModal>
    </div>
</template>
