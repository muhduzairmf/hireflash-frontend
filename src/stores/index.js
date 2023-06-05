import { ref } from "vue";

export const baseEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;

export const isNotWorkspace = ref(true);

export const user = ref({});

export const candidate_profile = ref({});

export const company = ref({});

export const officer = ref({});

export const redirectLogin = ref(false);

export const messageRedirect = ref("");

export const afterLogin = ref(false);

export const isAuthenticated = ref(false);

export const continueUrl = ref("");

export const successRecruit = ref("");

export const successRemove = ref("");

// export const jobOne = ref({});

// export const jobList = ref([]);

// export const wishlist = ref([]);

// export const appliedJob = ref([]);

// export const candidateOne = ref({});

// export const candidateList = ref([]);
