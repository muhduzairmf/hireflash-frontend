<script setup>
import { onMounted, ref } from "vue";
import TitleBorder from "../../components/TitleBorder.vue";
import ToastMsg from "../../components/ToastMsg.vue";
import DialogModal from "../../components/DialogModal.vue";
import dayjs from "dayjs";
import { baseEndpoint, candidate_profile } from "../../stores";
import SelectCustom from "../../components/SelectCustom.vue";
import OptionCustom from "../../components/OptionCustom.vue";
import Loading from "../../components/Loading.vue";

const isLoaded = ref(false);

document.title = "Education - Hireflash";

onMounted(async () => {
    const response = await fetch(
        baseEndpoint + "/education/" + candidate_profile.value.id,
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
        educationList.value = res.data;

        isLoaded.value = true;
    }
});

const rawDate = ref("");

const qualification = ref("");
const studyField = ref("");
const grade = ref("");
const instituteName = ref("");
const instituteLocation = ref("");

let newEducation = {
    qualification: "",
    studyField: "",
    grade: "",
    graduationDate: "",
    instituteName: "",
    instituteLocation: "",
};

const educationList = ref([]);

const addNewEdu = ref(true);
const btnName = ref("Add New");

function toggleAddNew() {
    addNewEdu.value = !addNewEdu.value;
    if (addNewEdu.value) {
        btnName.value = "Add New";
    } else {
        btnName.value = "Cancel";
    }
}

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

async function saveNewEdu() {
    newEducation.qualification = qualification.value;
    newEducation.studyField = studyField.value;
    newEducation.grade = grade.value;
    newEducation.graduationDate = dayjs(rawDate.value).format("D MMMM YYYY");
    newEducation.instituteName = instituteName.value;
    newEducation.instituteLocation = instituteLocation.value;

    const response = await fetch(baseEndpoint + "/education", {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            graduation_date: newEducation.graduationDate,
            qualification: newEducation.qualification,
            institute_name: newEducation.instituteName,
            institute_address: newEducation.instituteLocation,
            study_field: newEducation.studyField,
            grade: newEducation.grade,
            candidate_profile_id: candidate_profile.value.id,
        }),
    });
    const res = await response.json();
    if (response.status !== 201) {
        alert("error occured");
    } else {
        isLoaded.value = false;

        const response2 = await fetch(
            baseEndpoint + "/education/" + candidate_profile.value.id,
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
            educationList.value = res2.data;

            isLoaded.value = true;

            rawDate.value = "";
            qualification.value = "";
            studyField.value = "";
            grade.value = "";
            instituteName.value = "";
            instituteLocation.value = "";

            toggleToastMsg("New education information has been added.");

            toggleAddNew();
        }
    }
}

const isOpenRemove = ref(false);
const educationId = ref("");

function toggleModalRemove(eduId) {
    if (eduId) {
        educationId.value = eduId;
    }

    isOpenRemove.value = !isOpenRemove.value;
}

async function removeEducation() {
    const response = await fetch(
        baseEndpoint + "/education/" + educationId.value,
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
            baseEndpoint + "/education/" + candidate_profile.value.id,
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

            educationId.value = "";
        } else {
            educationList.value = res2.data;

            isLoaded.value = true;

            toggleModalRemove();

            educationId.value = "";

            toggleToastMsg("Successfully removed from your education list.");
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
            <TitleBorder title="Education" />
            <template v-if="isLoaded">
                <div
                    class="mt-4 grid grid-cols-2 gap-4 max-md:grid-cols-1"
                    v-if="educationList.length > 0"
                >
                    <div
                        class="border-2 border-indigo-200 rounded-md px-6 py-4 relative group/item"
                        v-for="edu in educationList"
                    >
                        <h1 class="text-lg font-bold">
                            {{ edu.qualification }}
                        </h1>
                        <p>{{ edu.study_field }}</p>
                        <p>{{ edu.grade }}</p>
                        <p>{{ edu.graduation_date }}</p>
                        <p>{{ edu.institute_name }}</p>
                        <p>{{ edu.institute_address }}</p>
                        <button
                            class="py-1 px-2 absolute bottom-2 right-2 invisible group-hover/item:visible hover:rounded-md hover:shadow-inner hover:bg-indigo-100"
                            v-on:click="toggleModalRemove(edu.id)"
                            title="Delete"
                        >
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-8 text-lg text-indigo-300 italic" v-else>
                    No education added...
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
            v-bind:class="{ hidden: addNewEdu }"
            v-on:submit.prevent="saveNewEdu()"
        >
            <div class="mt-4">
                <label class="mb-2 block">Qualification</label>
                <SelectCustom
                    v-model="qualification"
                    heightselect="40"
                    widthselect="96"
                    placeholderval="Select qualification"
                    v-bind:isdisabled="false"
                >
                    <template
                        v-for="opt in [
                            'Secondary school/SPM/Equivalent',
                            'Diploma/Equivalent',
                            'Bachelor\'s Degree',
                            'Master\'s Degree',
                            'Ph.D.',
                            'Associate Degree',
                            'Vocational Certificate',
                            'Professional Certification',
                            'Other',
                        ]"
                    >
                        <OptionCustom
                            v-bind:optionvalue="opt"
                            v-on:click="
                                () => {
                                    qualification = opt;
                                }
                            "
                            v-bind:class="{
                                'rounded-md shadow-inner bg-indigo-100':
                                    qualification === opt,
                            }"
                        />
                    </template>
                </SelectCustom>
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Study Field</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="Bachelor's Degree in Civil Engineering"
                    v-model="studyField"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Grade</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="4.0"
                    v-model="grade"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Graduation Date</label>
                <input
                    type="date"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="2003-01-08"
                    v-model="rawDate"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Institute Name</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="University of Cambridge"
                    v-model="instituteName"
                />
            </div>
            <div class="mt-4">
                <label class="mb-2 block">Institute Location</label>
                <input
                    type="text"
                    class="block w-96 max-md:w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300"
                    placeholder="Cambridge, UK"
                    v-model="instituteLocation"
                />
            </div>
            <div class="mt-6">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    type="submit"
                    v-bind:disabled="
                        qualification === '' ||
                        studyField === '' ||
                        grade === '' ||
                        rawDate === '' ||
                        instituteName === '' ||
                        instituteLocation === ''
                    "
                    v-bind:class="{
                        'disabled:cursor-not-allowed opacity-60':
                            qualification === '' ||
                            studyField === '' ||
                            grade === '' ||
                            rawDate === '' ||
                            instituteName === '' ||
                            instituteLocation === '',
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
            <p>Confirm to remove from your education list?</p>
            <div class="mt-6 flex gap-2">
                <button
                    class="rounded-md bg-indigo-800 text-gray-50 px-4 py-2 transition ease-in-out focus:scale-95 hover:-translate-y-1"
                    v-on:click="removeEducation()"
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
