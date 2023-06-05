<script setup>
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import { onMounted, ref } from "vue";
import { baseEndpoint, candidate_profile } from "../../stores";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import Loading from "../../components/Loading.vue";

document.title = "Skill - Hireflash";

const isLoaded = ref(false);

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/skill/" + candidate_profile.value.id,
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
        skillList.value = res.data;

        isLoaded.value = true;
    }
});

const addNewSkill = ref(true);
const btnName = ref("Add New");

function toggleAddNew() {
    addNewSkill.value = !addNewSkill.value;
    if (addNewSkill.value) {
        btnName.value = "Add New";
    } else {
        btnName.value = "Cancel";
    }
}

const skillName = ref("");
const proficiency = ref("");

let newSkill = {
    skillName: "",
    proficiency: "",
};

const skillList = ref([]);

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

async function saveNewSkill() {
    newSkill.skillName = skillName.value;
    newSkill.proficiency = proficiency.value;

    const response = await fetch(baseEndpoint + "/skill", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            skill_name: newSkill.skillName,
            proficiency: newSkill.proficiency,
            candidate_profile_id: candidate_profile.value.id,
        }),
    });
    const res = await response.json();
    if (response.status !== 201) {
        alert("error occured");
    } else {
        const response2 = await fetch(
            baseEndpoint + "/skill/" + candidate_profile.value.id,
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
            skillList.value = res.data;

            isLoaded.value = true;

            skillName.value = "";
            proficiency.value = "";

            toggleToastMsg("New skill has been addded.");

            toggleAddNew();
        }
    }
}

const isOpenRemove = ref(false);
const skillId = ref("");

function toggleModalRemove(sId) {
    if (sId) {
        skillId.value = sId;
    }

    isOpenRemove.value = !isOpenRemove.value;
}

async function removeSkill() {
    const response = await fetch(baseEndpoint + "/skill/" + skillId.value, {
        method: "DELETE",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        // body: JSON.stringify({}),
    });
    const res = await response.json();
    if (response.status !== 200) {
        alert("error occured");
    } else {
        const response2 = await fetch(
            baseEndpoint + "/skill/" + candidate_profile.value.id,
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
        } else {
            skillList.value = res2.data;

            isLoaded.value = true;

            toggleModalRemove();

            skillId.value = "";

            toggleToastMsg("Successfully removed from your skill list.");
        }
    }
}
</script>

<template>
    <ToastMsg v-bind:msg="toastMsg" v-show="showToastMsg" />
    <div
        class="bg-gray-50 w-full px-12 py-6 rounded-md shadow-lg max-md:px-6 max-md:py-3"
    >
        <div class="mb-6">
            <TitleBorder title="Skill" />
            <template v-if="isLoaded">
                <div
                    class="mt-4 grid grid-cols-3 gap-4 max-md:grid-cols-1"
                    v-if="skillList.length > 0"
                >
                    <div
                        class="border-2 border-indigo-200 px-6 py-4 rounded-md relative group/item"
                        v-for="skill in skillList"
                    >
                        <h1 class="text-lg font-bold">
                            {{ skill.skill_name }}
                        </h1>
                        <p>
                            Proficiency &nbsp;:
                            <span class="font-semibold">{{
                                skill.proficiency
                            }}</span>
                        </p>
                        <button
                            class="py-1 px-2 absolute bottom-2 right-2 invisible group-hover/item:visible hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            v-on:click="toggleModalRemove()"
                            title="Delete"
                        >
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-8 text-lg text-indigo-300 italic" v-else>
                    No skill added...
                </div>
            </template>
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
            v-bind:class="{ hidden: addNewSkill }"
            v-on:submit.prevent="saveNewSkill()"
        >
            <div class="mt-4">
                <label class="mb-2 block">Skill</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="English"
                    v-model="skillName"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Proficiency</label>
                <SelectCustom
                    v-model="proficiency"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select proficiency"
                    v-bind:isdisabled="false"
                >
                    <template
                        v-for="opt in ['Beginner', 'Intermediate', 'Advanced']"
                    >
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    proficiency = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    proficiency === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-bind:disabled="skillName === '' || proficiency === ''"
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            skillName === '' || proficiency === '',
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
            <p>Confirm to remove from your skill list?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="removeSkill()"
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
