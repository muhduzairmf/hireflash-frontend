<script setup>
import { ref, watch } from "vue";

const props = defineProps({
    modelValue: String,
    heightselect: String,
    widthselect: String,
    placeholderval: String,
    isdisabled: Boolean,
});

const value = ref(props.modelValue);
const heightval = ref(props.heightselect);
const widthval = ref(props.widthselect);
const placeholderval = ref(props.placeholderval);
const isDisabled = ref(props.isdisabled);
const isOpen = ref(false);

const emit = defineEmits(["update:modelValue"]);

// Watch for changes in the prop and update the local value
watch(
    () => props.modelValue,
    (newValue) => {
        value.value = newValue;
    }
);

// Watch for changes in the local value and emit 'update:modelValue' event
watch(value, (newValue) => {
    emit("update:modelValue", newValue);
});

watch(
    () => props.isdisabled,
    (newValue) => {
        isDisabled.value = newValue;
    }
);

watch(isDisabled, (newValue) => {
    emit("update:isdisabled", newValue);
});

const updateValue = (event) => {
    value.value = event.target.value;
    isOpen.value != isOpen.value;
};
</script>

<template>
    <div class="group">
        <div v-bind:class="['relative', 'w-' + widthval, 'max-md:w-full']">
            <input
                type="text"
                class="block w-full rounded-md border-2 border-gray-300 px-4 py-2 bg-gray-50 hover:outline-none focus:outline-none focus:border-indigo-500 placeholder:text-gray-300 cursor-pointer"
                readonly
                v-bind:placeholder="placeholderval"
                v-bind:value="value"
                v-on:input="updateValue"
                v-bind:disabled="isDisabled"
                v-bind:class="{
                    'disabled:cursor-not-allowed': isDisabled,
                }"
            />
            <span class="absolute top-3 right-2">
                <i
                    class="bi bi-chevron-down group-focus-within:bi-chevron-up"
                ></i>
            </span>
        </div>
        <div
            class="relative top-18 max-md:w-full rounded-md border-2 border-gray-300 p-2 bg-gray-50 hidden flex-col gap-2 overflow-y-auto group-focus-within:flex"
            v-bind:class="['h-' + heightval, 'w-' + widthval]"
        >
            <slot></slot>
        </div>
    </div>
</template>
