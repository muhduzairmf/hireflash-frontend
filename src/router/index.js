import { createRouter, createWebHistory } from "vue-router";
import { getRoleAndUserId, hasValidToken } from "../lib/Auth";
import {
    continueUrl,
    isAuthenticated,
    isNotWorkspace,
    messageRedirect,
    redirectLogin,
} from "../stores";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: () => import("../views/HomeUI.vue"),
        },
        {
            path: "/get-started",
            component: () => import("../views/GetStartedView/GetStartedUI.vue"),
            children: [],
        },
        {
            path: "/get-started/verify",
            component: () => import("../views/GetStartedView/VerifyUI.vue"),
        },
        {
            path: "/get-started/create-admin",
            component: () =>
                import("../views/GetStartedView/CreateAdminUI.vue"),
        },
        {
            path: "/get-started/create-organization",
            component: () => import("../views/GetStartedView/CreateOrgUI.vue"),
        },
        {
            path: "/auth",
            component: () => import("../views/AuthView/RedirectLoginUI.vue"),
        },
        {
            path: "/auth/signup",
            component: () => import("../views/AuthView/SignupUI.vue"),
        },
        {
            path: "/auth/signup/complete-info",
            component: () => import("../views/AuthView/CompleteInfoUI.vue"),
        },
        {
            path: "/auth/login",
            component: () => import("../views/AuthView/LoginUI.vue"),
        },
        {
            path: "/auth/forgot-password",
            component: () => import("../views/AuthView/ForgotPasswordUI.vue"),
        },
        {
            path: "/auth/forgot-password/verify",
            component: () => import("../views/AuthView/VerifyUI.vue"),
        },
        {
            path: "/auth/forgot-password/new-password",
            component: () => import("../views/AuthView/NewPasswordUI.vue"),
        },
        {
            path: "/auth/forgot-password/success-change",
            component: () => import("../views/AuthView/InformReloginUI.vue"),
        },
        {
            path: "/profile",
            component: () =>
                import("../views/ApplicantView/BaseApplicantUI.vue"),
            meta: { requiresAuth: true, roles: ["applicant"] },
            children: [
                {
                    path: "",
                    component: () =>
                        import("../views/ApplicantView/RedirectProfileUI.vue"),
                },
                {
                    path: "notifications",
                    component: () =>
                        import("../views/ApplicantView/NotificationUI.vue"),
                },
                {
                    path: "inbox",
                    component: () =>
                        import("../views/ApplicantView/InboxUI.vue"),
                },
                {
                    path: "inbox/message",
                    component: () =>
                        import("../views/ApplicantView/RedirectInboxUI.vue"),
                },
                {
                    path: "inbox/message/:receiverId",
                    component: () =>
                        import("../views/ApplicantView/MessageUI.vue"),
                },
                {
                    path: "user-info",
                    component: () =>
                        import("../views/ApplicantView/UserProfileUI.vue"),
                },
                {
                    path: "education",
                    component: () =>
                        import("../views/ApplicantView/EducationUI.vue"),
                },
                {
                    path: "work-experience",
                    component: () =>
                        import("../views/ApplicantView/ExperienceUI.vue"),
                },
                {
                    path: "lang-ability",
                    component: () =>
                        import("../views/ApplicantView/LangAbilityUI.vue"),
                },
                {
                    path: "skill",
                    component: () =>
                        import("../views/ApplicantView/SkillUI.vue"),
                },
                {
                    path: "resume",
                    component: () =>
                        import("../views/ApplicantView/ResumeUI.vue"),
                },
                {
                    path: "wishlist",
                    component: () =>
                        import("../views/ApplicantView/WishlistUI.vue"),
                },
                {
                    path: "applied-job",
                    component: () =>
                        import("../views/ApplicantView/AppliedJobUI.vue"),
                },
            ],
        },
        {
            path: "/job",
            component: () => import("../views/JobView/RedirectSearchUI.vue"),
        },
        {
            path: "/job/search",
            component: () => import("../views/JobView/JobSearchUI.vue"),
        },
        {
            path: "/job/result",
            component: () => import("../views/JobView/ResultSearchUI.vue"),
        },
        {
            path: "/job/:jobId",
            component: () => import("../views/JobView/JobDetailUI.vue"),
        },
        {
            path: "/company/:companyId",
            component: () => import("../views/JobView/CompanyDetailUI.vue"),
        },
        {
            path: "/workspace",
            component: () =>
                import("../views/WorkspaceView/BaseWorkspaceUI.vue"),
            children: [
                {
                    path: "",
                    component: () =>
                        import("../views/WorkspaceView/WorkspaceUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "notifications",
                    component: () =>
                        import("../views/WorkspaceView/NotificationUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "user-info",
                    component: () =>
                        import("../views/WorkspaceView/UserProfileUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "inbox",
                    component: () =>
                        import("../views/WorkspaceView/InboxUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "inbox/message",
                    component: () =>
                        import("../views/WorkspaceView/RedirectInboxUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "inbox/message/:receiverId",
                    component: () =>
                        import("../views/WorkspaceView/MessageUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/new",
                    component: () =>
                        import("../views/WorkspaceView/NewRecruitUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/view-all",
                    component: () =>
                        import("../views/WorkspaceView/ViewRecruitUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId",
                    component: () =>
                        import("../views/WorkspaceView/RecruitDetailUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/edit",
                    component: () =>
                        import("../views/WorkspaceView/EditRecruitUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/applicant-list",
                    component: () =>
                        import("../views/WorkspaceView/ApplicantListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/applicant-list/candidate",
                    component: () =>
                        import("../views/WorkspaceView/RedirectListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/applicant-list/candidate/:candidateId",
                    component: () =>
                        import(
                            "../views/WorkspaceView/ApplicantCandidateUI.vue"
                        ),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/shortlist",
                    component: () =>
                        import("../views/WorkspaceView/ShortlistUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/shortlist/candidate",
                    component: () =>
                        import("../views/WorkspaceView/RedirectListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/shortlist/candidate/:candidateId",
                    component: () =>
                        import(
                            "../views/WorkspaceView/ShortlistCandidateUI.vue"
                        ),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/interview-list",
                    component: () =>
                        import("../views/WorkspaceView/InterviewListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/interview-list/candidate",
                    component: () =>
                        import("../views/WorkspaceView/RedirectListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/interview-list/candidate/:candidateId",
                    component: () =>
                        import(
                            "../views/WorkspaceView/InterviewCandidateUI.vue"
                        ),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/successful-list",
                    component: () =>
                        import("../views/WorkspaceView/SuccessfulListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/successful-list/candidate",
                    component: () =>
                        import("../views/WorkspaceView/RedirectListUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "recruitment/:jobId/successful-list/candidate/:candidateId",
                    component: () =>
                        import(
                            "../views/WorkspaceView/SuccessfulCandidateUI.vue"
                        ),
                    meta: {
                        requiresAuth: true,
                        roles: [
                            "admin",
                            "admin,hr",
                            "admin,manager",
                            "hr",
                            "manager",
                            "guest",
                        ],
                    },
                },
                {
                    path: "settings",
                    component: () =>
                        import("../views/WorkspaceView/SettingsUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: ["admin", "admin,hr", "admin,manager"],
                    },
                },
                {
                    path: "settings/edit-organization",
                    component: () =>
                        import("../views/WorkspaceView/EditOrgUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: ["admin", "admin,hr", "admin,manager"],
                    },
                },
                {
                    path: "settings/trash-bin",
                    component: () =>
                        import("../views/WorkspaceView/TrashBinUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: ["admin", "admin,hr", "admin,manager"],
                    },
                },
                {
                    path: "settings/add-officer",
                    component: () =>
                        import("../views/WorkspaceView/AddOfficerUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: ["admin", "admin,hr", "admin,manager"],
                    },
                },
                {
                    path: "settings/list-resign",
                    component: () =>
                        import("../views/WorkspaceView/ListResignUI.vue"),
                    meta: {
                        requiresAuth: true,
                        roles: ["admin", "admin,hr", "admin,manager"],
                    },
                },
            ],
        },
        {
            path: "/404-Not-Found",
            component: () => import("../views/NotFoundUI.vue"),
        },
        {
            path: "/:pathMatch(.*)*",
            component: () => import("../views/NotFoundUI.vue"),
        },
    ],
    // linkExactActiveClass is for router-link classname in that particular router, if it is active
    linkExactActiveClass: "text-gray-50 bg-indigo-800 hover:bg-indigo-900",
});

router.beforeEach(async (to, from, next) => {
    const isLoggedIn = await hasValidToken();
    const { role } = getRoleAndUserId();

    isAuthenticated.value = isLoggedIn;

    isNotWorkspace.value =
        to.path !== "/workspace" && to.path !== "/workspace/";

    if (to.meta.requiresAuth) {
        if (isLoggedIn) {
            if (to.meta.roles && to.meta.roles.includes(role)) {
                next();
            } else {
                next("/404-Not-Found");
            }
        } else {
            redirectLogin.value = true;
            messageRedirect.value = "Please login to continue.";
            continueUrl.value = to.path;
            next("/auth/login");
        }
    } else {
        next();
    }
});

export default router;
