<script setup>
import { useRoute } from "vue-router";
import router from "../../router";

const path = router.currentRoute.value.path;

const route = useRoute();
const jobId = route.params.jobId;

if (
    path === "/workspace/recruitment/" + jobId + "/applicant-list/candidate/" ||
    path === "/workspace/recruitment/" + jobId + "/applicant-list/candidate"
) {
    router.push("/workspace/recruitment/" + jobId + "/applicant-list/");
} else if (
    path === "/workspace/recruitment/" + jobId + "/shortlist/candidate/" ||
    path === "/workspace/recruitment/" + jobId + "/shortlist/candidate"
) {
    router.push("/workspace/recruitment/" + jobId + "/shortlist/");
} else if (
    path === "/workspace/recruitment/" + jobId + "/interview-list/candidate/" ||
    path === "/workspace/recruitment/" + jobId + "/interview-list/candidate"
) {
    router.push("/workspace/recruitment/" + jobId + "/interview-list/");
} else if (
    path ===
        "/workspace/recruitment/" + jobId + "/successful-list/candidate/" ||
    path === "/workspace/recruitment/" + jobId + "/successful-list/candidate"
) {
    router.push("/workspace/recruitment/" + jobId + "/successful-list/");
}
</script>

<template></template>
