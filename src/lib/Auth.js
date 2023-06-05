import router from "../router";
import { baseEndpoint } from "../stores";

/**
 * Function to push user to login page, if user try to access any required authenticated pages
 */
export async function hasValidToken() {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ACCSS_TKN_HIREFLASH="))
        ?.split("=")[1];

    const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("RFRSH_TKN_HIREFLASH="))
        ?.split("=")[1];

    const privelegeToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("PRVLG_TKN_HIREFLASH="))
        ?.split("=")[1];

    if (!accessToken || !refreshToken || !privelegeToken) {
        return false;
    }

    const response = await fetch(baseEndpoint + "/auth/validate-token", {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
            refreshToken: refreshToken,
        }),
    });

    const res = await response.json();

    if (response.status !== 200) {
        return false;
    }

    document.cookie = `RFRSH_TKN_HIREFLASH=${res.data.refreshToken}; Path=/; SameSite=Strict;`;

    return true;
}

/**
 * Function to validate the user role, if it is officer
 * @returns
 */
export function isOfficer() {
    const { role } = getRoleAndUserId();

    const typeOfOfficer = [
        "admin",
        "admin,hr",
        "admin,manager",
        "hr",
        "manager",
        "guest",
    ];

    if (!typeOfOfficer.includes(role)) {
        return false;
    }

    return true;
}

/**
 * Function to validate the user role, if it is applicant
 * @returns
 */
export function isApplicant() {
    const { role } = getRoleAndUserId();

    if (role !== "applicant") {
        return false;
    }

    return true;
}

/**
 * Function to get user role and user id
 * @returns
 */
export function getRoleAndUserId() {
    const privelegeToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("PRVLG_TKN_HIREFLASH="))
        ?.split("=")[1];

    let role = "";
    let user_id = "";

    try {
        const [hexRole, splitted_user_id] = privelegeToken.split(".");

        role = hexToString(hexRole);
        user_id = splitted_user_id;
    } catch (error) {}

    return { role, user_id };
}

/**
 * Function to get full role
 * @param {*} role
 * @returns
 */
export function getFullRole(role) {
    let fullRole = "";

    switch (role) {
        case "admin":
            fullRole = "Account Administrator";
            break;

        case "admin,hr":
            fullRole = "Account Administrator and HR Officer";
            break;

        case "admin,manager":
            fullRole = "Account Administrator and Hiring Manager";
            break;

        case "hr":
            fullRole = "HR Officer";
            break;

        case "manager":
            fullRole = "Hiring Manager";
            break;

        case "guest":
            fullRole = "Guest";
            break;

        case "applicant":
            fullRole = "Applicant";
            break;

        default:
            break;
    }

    return fullRole;
}

/**
 * Function to create cookie for accessToken, refreshToken and privilegeToken
 * @param {*} role The user role
 */
export function createCookie(accessToken, refreshToken, role, user_id) {
    document.cookie = `ACCSS_TKN_HIREFLASH=${accessToken}; Path=/; SameSite=Strict;`;
    document.cookie = `RFRSH_TKN_HIREFLASH=${refreshToken}; Path=/; SameSite=Strict;`;
    document.cookie = `PRVLG_TKN_HIREFLASH=${stringToHex(
        role
    )}.${user_id}; Path=/; SameSite=Strict;`;
}

/**
 * Function to delete cookie for accessToken, refreshToken and privilegeToken
 */
export function deleteCookie() {
    document.cookie = `ACCSS_TKN_HIREFLASH=deleted; Path=/; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    document.cookie = `RFRSH_TKN_HIREFLASH=deleted; Path=/; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    document.cookie = `PRVLG_TKN_HIREFLASH=deleted; Path=/; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}

/**
 * Function to auto relogin user, if the token is exists
 * @returns
 */
export async function autoLogin() {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("ACCSS_TKN_HIREFLASH="))
        ?.split("=")[1];

    const refreshToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("RFRSH_TKN_HIREFLASH="))
        ?.split("=")[1];

    const privelegeToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("PRVLG_TKN_HIREFLASH="))
        ?.split("=")[1];

    if (!accessToken || !refreshToken || !privelegeToken) {
        return;
    }

    const response = await fetch(baseEndpoint + "/auth/validate-token", {
        method: "PATCH",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: "same-origin",
        body: JSON.stringify({
            refreshToken: refreshToken,
        }),
    });

    const res = await response.json();

    if (response.status !== 200) {
        return;
    }
    document.cookie = `RFRSH_TKN_HIREFLASH=${res.data.refreshToken}; Path=/; SameSite=Strict;`;

    const { role } = getRoleAndUserId();

    if (role === "applicant") {
        router.push("/profile");
    } else {
        router.push("/workspace");
    }
}

function stringToHex(str) {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i).toString(16);
        hex += charCode.padStart(2, "0"); // Ensure two digits for each character
    }
    return hex;
}

function hexToString(hex) {
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        const hexChars = hex.substr(i, 2);
        const charCode = parseInt(hexChars, 16);
        str += String.fromCharCode(charCode);
    }
    return str;
}
