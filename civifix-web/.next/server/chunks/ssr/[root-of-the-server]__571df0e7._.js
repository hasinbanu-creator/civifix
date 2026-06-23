module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/src/constants/endpoints.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_URL",
    ()=>API_URL,
    "ENDPOINTS",
    ()=>ENDPOINTS,
    "default",
    ()=>__TURBOPACK__default__export__
]);
const API_URL = ("TURBOPACK compile-time value", "http://34.14.168.135:8000/api/v1") || "http://34.14.168.135:8000/api/v1";
const ENDPOINTS = {
    // Auth endpoints
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_LOGIN: "/auth/verify-login-otp",
    VERIFY_REGISTER: "/auth/verify-otp",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    // User endpoints
    GET_PROFILE: "/auth/me",
    UPDATE_PROFILE: "/auth/me",
    // Complaints endpoints
    GET_COMPLAINTS: "/complaints/my/dashboard",
    CREATE_COMPLAINT: "/complaints",
    GET_COMPLAINT: (id)=>`/complaints/${id}`,
    // Ward/admin endpoints
    GET_WARDS_BY_DISTRICT: (districtId)=>`/wards/district/${districtId}`,
    SEARCH_WARDS: (districtId)=>`/wards/search/${districtId}`,
    GET_DISTRICTS: "/admin/districts",
    // Ward endpoints
    GET_WARDS: "/wards/district",
    GET_WARD_DETAIL: (wardId)=>`/wards/${wardId}`,
    GET_INSPECTOR_WARD: "/wards/inspector/assigned",
    ASSIGN_INSPECTOR_TO_WARD: (wardId)=>`/wards/${wardId}/assign-inspector`,
    // Dashboard role-specific
    GET_INSPECTOR_DASHBOARD: "/dashboard/inspector/dashboard",
    GET_DISTRICT_ADMIN_DASHBOARD: "/dashboard/district-admin/dashboard",
    GET_WORKER_DASHBOARD: "/dashboard/worker/dashboard"
};
const __TURBOPACK__default__export__ = ENDPOINTS;
}),
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getErrorMessage",
    ()=>getErrorMessage,
    "unwrapResponse",
    ()=>unwrapResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/endpoints.ts [app-ssr] (ecmascript)");
;
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["API_URL"],
    timeout: 10000
});
const unwrapResponse = (response)=>{
    return response?.data?.data ?? response?.data;
};
const getErrorMessage = (error, fallback = "Something went wrong")=>{
    const data = error?.response?.data;
    if (typeof data === "string") return data;
    return data?.message || data?.detail || data?.errors || error?.message || fallback;
};
api.interceptors.request.use((config)=>{
    if (process.env.NEXT_PUBLIC_ENABLE_DEBUG === "true") {
        console.log("API request:", api.getUri(config));
    }
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return config;
}, (error)=>Promise.reject(error));
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
        } catch (refreshError) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
}),
"[project]/src/services/auth.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/endpoints.ts [app-ssr] (ecmascript)");
;
;
const storeSession = (session)=>{
    if (!session?.access_token) return;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const e2eMocksEnabled = process.env.NEXT_PUBLIC_E2E_MOCKS === "true";
const clone = (value)=>JSON.parse(JSON.stringify(value));
const e2eDistricts = [
    {
        _id: "e2e-district-1",
        id: "e2e-district-1",
        name: "Central District",
        active: true
    },
    {
        _id: "e2e-district-2",
        id: "e2e-district-2",
        name: "North District",
        active: true
    }
];
const e2eWardsByDistrict = {
    "e2e-district-1": [
        {
            _id: "e2e-ward-1",
            id: "e2e-ward-1",
            ward_name: "Ward 1 - Central",
            ward_number: 1
        },
        {
            _id: "e2e-ward-2",
            id: "e2e-ward-2",
            ward_name: "Ward 2 - Market",
            ward_number: 2
        }
    ],
    "e2e-district-2": [
        {
            _id: "e2e-ward-3",
            id: "e2e-ward-3",
            ward_name: "Ward 3 - North",
            ward_number: 3
        },
        {
            _id: "e2e-ward-4",
            id: "e2e-ward-4",
            ward_name: "Ward 4 - Lake",
            ward_number: 4
        }
    ]
};
const getMockRole = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return "CITIZEN";
    //TURBOPACK unreachable
    ;
};
const getRoleProfile = (role)=>{
    const normalizedRole = role.toUpperCase();
    const profiles = {
        CITIZEN: {
            id: "e2e-user-citizen",
            email: "selenium-test@civifix.local",
            name: "Selenium Citizen",
            role: "CITIZEN",
            mobile_number: "9876543210",
            district: "e2e-district-1",
            district_id: "e2e-district-1"
        },
        INSPECTOR: {
            id: "e2e-user-inspector",
            email: "inspector@civifix.local",
            name: "Inspector Isha",
            role: "INSPECTOR",
            mobile_number: "9876500001",
            district: "e2e-district-1",
            district_id: "e2e-district-1",
            ward_id: "e2e-ward-1"
        },
        WORKER: {
            id: "e2e-user-worker",
            email: "worker@civifix.local",
            name: "Worker Wren",
            role: "WORKER",
            mobile_number: "9876500002",
            district: "e2e-district-1",
            district_id: "e2e-district-1",
            ward_id: "e2e-ward-1"
        },
        DISTRICT_ADMIN: {
            id: "e2e-user-district-admin",
            email: "district.admin@civifix.local",
            name: "District Admin Dana",
            role: "DISTRICT_ADMIN",
            mobile_number: "9876500003",
            district: "e2e-district-1",
            district_id: "e2e-district-1"
        },
        SUPER_ADMIN: {
            id: "e2e-user-super-admin",
            email: "super.admin@civifix.local",
            name: "Super Admin Sam",
            role: "SUPER_ADMIN",
            mobile_number: "9876500004",
            district: "Central District",
            district_id: "central-district"
        }
    };
    return clone(profiles[normalizedRole] || profiles.CITIZEN);
};
let e2eComplaints = [
    {
        _id: "e2e-complaint-1",
        complaint_id: "CIV-E2E-001",
        complaint_type: "GARBAGE",
        title: "Waste Collection",
        description: "Garbage has not been collected near the community park.",
        status: "OPEN",
        priority: "MEDIUM",
        address: "Near post office, Main Road",
        ward_id: "e2e-ward-1",
        ward: {
            _id: "e2e-ward-1",
            ward_name: "Ward 1 - Central",
            ward_number: 1
        },
        citizen: {
            name: "Selenium Citizen",
            phone: "9876543210",
            email: "selenium-test@civifix.local"
        },
        created_at: "2026-06-01T08:00:00.000Z",
        history: [
            {
                _id: "hist-1",
                action: "Complaint submitted",
                old_status: "",
                new_status: "OPEN",
                remarks: "Submitted from the citizen portal.",
                created_at: "2026-06-01T08:00:00.000Z"
            }
        ],
        citizen_note: "Please collect the garbage before the weekend."
    },
    {
        _id: "e2e-complaint-2",
        complaint_id: "CIV-E2E-002",
        complaint_type: "ROAD_DAMAGE",
        title: "Road Damage",
        description: "Pothole on the main market road requires repair.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        address: "Market Road",
        ward_id: "e2e-ward-1",
        ward: {
            _id: "e2e-ward-1",
            ward_name: "Ward 1 - Central",
            ward_number: 1
        },
        citizen: {
            name: "Selenium Citizen",
            phone: "9876543210",
            email: "selenium-test@civifix.local"
        },
        created_at: "2026-06-02T08:00:00.000Z",
        worker_note: "Temporary barricade installed; repair in progress.",
        history: [
            {
                _id: "hist-2a",
                action: "Complaint started",
                old_status: "OPEN",
                new_status: "IN_PROGRESS",
                remarks: "Inspector moved the case to active work.",
                created_at: "2026-06-02T10:00:00.000Z"
            }
        ]
    },
    {
        _id: "e2e-complaint-3",
        complaint_id: "CIV-E2E-003",
        complaint_type: "STREETLIGHT",
        title: "Street Light",
        description: "Streetlight is not working near the bus stop.",
        status: "CLOSED",
        priority: "LOW",
        address: "Bus stop lane",
        ward_id: "e2e-ward-2",
        ward: {
            _id: "e2e-ward-2",
            ward_name: "Ward 2 - Market",
            ward_number: 2
        },
        citizen: {
            name: "Selenium Citizen",
            phone: "9876543210",
            email: "selenium-test@civifix.local"
        },
        created_at: "2026-06-03T08:00:00.000Z",
        inspector_note: "Verified resolved during evening inspection.",
        history: [
            {
                _id: "hist-3a",
                action: "Complaint resolved",
                old_status: "IN_PROGRESS",
                new_status: "CLOSED",
                remarks: "Closed after replacement of the streetlight.",
                created_at: "2026-06-04T12:00:00.000Z"
            }
        ]
    },
    {
        _id: "e2e-complaint-4",
        complaint_id: "CIV-E2E-004",
        complaint_type: "DRAINAGE",
        title: "Drainage Blockage",
        description: "Drainage near the school is partially blocked after rain.",
        status: "APPROVAL",
        priority: "MEDIUM",
        address: "School Road",
        ward_id: "e2e-ward-2",
        ward: {
            _id: "e2e-ward-2",
            ward_name: "Ward 2 - Market",
            ward_number: 2
        },
        citizen: {
            name: "Selenium Citizen",
            phone: "9876543210",
            email: "selenium-test@civifix.local"
        },
        created_at: "2026-06-04T08:00:00.000Z",
        history: [
            {
                _id: "hist-4a",
                action: "Sent for review",
                old_status: "WORKING",
                new_status: "APPROVAL",
                remarks: "Awaiting inspector approval.",
                created_at: "2026-06-05T08:00:00.000Z"
            }
        ]
    }
];
const e2eSession = ()=>({
        access_token: "e2e-access-token",
        refresh_token: "e2e-refresh-token",
        user: getRoleProfile(getMockRole())
    });
const getComplaint = (id)=>e2eComplaints.find((c)=>c._id === id || c.complaint_id === id || c.id === id);
const recordHistory = (complaint, entry)=>{
    complaint.history = Array.isArray(complaint.history) ? complaint.history : [];
    complaint.history = [
        ...complaint.history,
        {
            _id: `hist-${complaint.history.length + 1}-${Date.now()}`,
            created_at: new Date().toISOString(),
            ...entry
        }
    ];
};
const getComplaintSummary = ()=>{
    const summary = {
        OPEN: 0,
        WORKING: 0,
        APPROVAL: 0,
        CLOSED: 0,
        REJECTED: 0,
        IN_PROGRESS: 0
    };
    for (const complaint of e2eComplaints){
        const status = (complaint.status || "OPEN").toUpperCase();
        summary[status] = (summary[status] || 0) + 1;
    }
    return summary;
};
const getDashboardData = (role)=>{
    const normalizedRole = role.toUpperCase();
    const wardComplaints = e2eComplaints.filter((complaint)=>complaint.ward_id === "e2e-ward-1");
    if (normalizedRole === "SUPER_ADMIN" || normalizedRole === "DISTRICT_ADMIN") {
        return {
            stats: {
                total_wards: e2eDistricts.length * 2,
                total_inspectors: 4,
                total_complaints: e2eComplaints.length,
                resolved_complaints: e2eComplaints.filter((complaint)=>[
                        "CLOSED",
                        "RESOLVED"
                    ].includes((complaint.status || "").toUpperCase())).length
            }
        };
    }
    return {
        ward_info: {
            ward_name: "Ward 1 - Central",
            ward_number: 1
        },
        recent_complaints: clone(wardComplaints),
        pending_approvals: wardComplaints.filter((complaint)=>(complaint.status || "").toUpperCase() === "APPROVAL").length,
        stats: {
            total_complaints: wardComplaints.length,
            pending: wardComplaints.filter((complaint)=>[
                    "OPEN",
                    "PENDING"
                ].includes((complaint.status || "").toUpperCase())).length,
            in_progress: wardComplaints.filter((complaint)=>[
                    "WORKING",
                    "IN_PROGRESS"
                ].includes((complaint.status || "").toUpperCase())).length,
            resolved_complaints: wardComplaints.filter((complaint)=>[
                    "CLOSED",
                    "RESOLVED"
                ].includes((complaint.status || "").toUpperCase())).length,
            resolved: wardComplaints.filter((complaint)=>[
                    "CLOSED",
                    "RESOLVED"
                ].includes((complaint.status || "").toUpperCase())).length,
            for_review: wardComplaints.filter((complaint)=>(complaint.status || "").toUpperCase() === "APPROVAL").length
        }
    };
};
const getWardComplaints = ()=>e2eComplaints.filter((complaint)=>complaint.ward_id === "e2e-ward-1");
const getAssignedComplaints = ()=>{
    const role = getMockRole();
    if (role === "INSPECTOR") return getWardComplaints();
    return e2eComplaints.filter((complaint)=>[
            "IN_PROGRESS",
            "WORKING",
            "APPROVAL"
        ].includes((complaint.status || "").toUpperCase()));
};
const authService = {
    register: async (userData)=>{
        if (e2eMocksEnabled) return {
            message: "OTP sent",
            user: userData
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].REGISTER, userData);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    login: async (email)=>{
        if (e2eMocksEnabled) return {
            message: "OTP sent",
            email
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].LOGIN, {
            email
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    verifyLogin: async (email, otp)=>{
        if (e2eMocksEnabled) {
            const session = e2eSession();
            storeSession(session);
            return session;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].VERIFY_LOGIN, {
            email,
            otp
        });
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
        storeSession(session);
        return session;
    },
    verifyRegister: async (email, otp)=>{
        if (e2eMocksEnabled) {
            const session = e2eSession();
            storeSession(session);
            return session;
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].VERIFY_REGISTER, {
            email,
            otp
        });
        const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
        storeSession(session);
        return session;
    },
    logout: async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].LOGOUT);
        } catch (error) {
            console.warn("Logout API failed, clearing local storage", error);
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    getProfile: async ()=>{
        if (e2eMocksEnabled) return getRoleProfile(getMockRole());
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].GET_PROFILE);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    updateProfile: async (userData)=>{
        if (e2eMocksEnabled) return {
            ...getRoleProfile(getMockRole()),
            ...userData
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].UPDATE_PROFILE, userData);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    getComplaints: async ({ page = 1, limit = 10, status } = {})=>{
        if (e2eMocksEnabled) {
            const filtered = status ? e2eComplaints.filter((c)=>(c.status || "").toUpperCase() === status.toUpperCase()) : e2eComplaints;
            const statusCounts = getComplaintSummary();
            return {
                data: clone(filtered.slice(0, limit)),
                meta: {
                    page,
                    limit,
                    total_records: filtered.length,
                    status_counts: statusCounts
                }
            };
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].GET_COMPLAINTS, {
            params: {
                page,
                limit,
                status
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    getComplaint: async (id)=>{
        if (e2eMocksEnabled) return e2eComplaints.find((c)=>c._id === id || c.complaint_id === id) || e2eComplaints[0];
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].GET_COMPLAINT(id));
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    createComplaint: async (complaintData)=>{
        if (e2eMocksEnabled) {
            return {
                id: "e2e-created-1",
                _id: "e2e-created-1",
                complaint_id: "CIV-E2E-NEW",
                status: "OPEN",
                title: "Created Complaint",
                description: complaintData.description,
                ...complaintData
            };
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].CREATE_COMPLAINT, complaintData);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    getToken: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return null;
    },
    isAuthenticated: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    },
    getMe: async ()=>{
        if (e2eMocksEnabled) return getRoleProfile(getMockRole());
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].GET_PROFILE);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── SUPER ADMIN ─────────────────────────────────────────────────────────────
    getAdminStats: async ()=>{
        if (e2eMocksEnabled) return {
            stats: getComplaintSummary()
        };
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/stats");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── DISTRICT ADMIN ──────────────────────────────────────────────────────────
    getInspectors: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/inspectors");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getWorkers: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/workers");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getDistrictUsers: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/admin/users");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── INSPECTOR ───────────────────────────────────────────────────────────────
    getWardComplaints: async ({ page = 1, limit = 20, status } = {})=>{
        if (e2eMocksEnabled) {
            const source = getWardComplaints();
            const filtered = status ? source.filter((complaint)=>(complaint.status || "").toUpperCase() === status.toUpperCase()) : source;
            return {
                complaints: clone(filtered.slice(0, limit)),
                page,
                limit
            };
        }
        const params = {
            page,
            limit
        };
        if (status) params.status = status;
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/inspector/complaints", {
            params
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getWardWorkers: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/inspector/workers");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── WORKER ──────────────────────────────────────────────────────────────────
    getAssignedComplaints: async ({ page = 1, limit = 20, status } = {})=>{
        if (e2eMocksEnabled) {
            const source = getAssignedComplaints();
            const filtered = status ? source.filter((complaint)=>(complaint.status || "").toUpperCase() === status.toUpperCase()) : source;
            return {
                complaints: clone(filtered.slice(0, limit)),
                page,
                limit
            };
        }
        const params = {
            page,
            limit
        };
        if (status) params.status = status;
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/worker/complaints", {
            params
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getWardsByDistrict: async (districtId, { page = 1, is_active = true, limit = 60 } = {})=>{
        if (e2eMocksEnabled) {
            const wards = e2eWardsByDistrict[String(districtId)] || e2eWardsByDistrict["e2e-district-1"];
            return {
                data: clone(wards.slice(0, limit)),
                meta: {
                    page,
                    is_active
                }
            };
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/wards/district/${districtId}`, {
            params: {
                page,
                is_active,
                limit
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── WARD MANAGEMENT ─────────────────────────────────────────────────────────
    getWards: async ({ page = 1, limit = 20, is_active = true } = {})=>{
        if (e2eMocksEnabled) return {
            data: clone(e2eWardsByDistrict["e2e-district-1"].slice(0, limit)),
            meta: {
                page,
                is_active
            }
        };
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/wards/district", {
            params: {
                page,
                limit,
                is_active
            }
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getWardDetail: async (wardId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(`/wards/${wardId}`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getInspectorWard: async ()=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/wards/inspector/assigned");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    assignInspectorToWard: async (wardId, inspectorId)=>{
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`/wards/${wardId}/assign-inspector`, {
            inspector_id: inspectorId
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── DASHBOARD ROLE-SPECIFIC ────────────────────────────────────────────────
    getInspectorDashboard: async ()=>{
        if (e2eMocksEnabled) return getDashboardData("INSPECTOR");
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/dashboard/inspector/dashboard");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getDistrictAdminDashboard: async ()=>{
        if (e2eMocksEnabled) return getDashboardData("DISTRICT_ADMIN");
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/dashboard/district-admin/dashboard");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getWorkerDashboard: async ()=>{
        if (e2eMocksEnabled) return getDashboardData("WORKER");
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("/dashboard/worker/dashboard");
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    // ─── INSPECTOR COMPLAINT ACTIONS ─────────────────────────────────────────────
    inspectorStartWork: async (complaintId)=>{
        if (e2eMocksEnabled) {
            const complaint = getComplaint(complaintId);
            if (!complaint) return null;
            const previousStatus = complaint.status || "OPEN";
            complaint.status = "IN_PROGRESS";
            recordHistory(complaint, {
                action: "Inspector started work",
                old_status: previousStatus,
                new_status: "IN_PROGRESS",
                remarks: "Mock inspector workflow started work."
            });
            return clone(complaint);
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/inspector/complaints/${complaintId}/start-work`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    inspectorRejectComplaint: async (complaintId)=>{
        if (e2eMocksEnabled) {
            const complaint = getComplaint(complaintId);
            if (!complaint) return null;
            const previousStatus = complaint.status || "OPEN";
            complaint.status = "REJECTED";
            complaint.rejection_reason = complaint.rejection_reason || "Complaint rejected after inspection in mock mode.";
            recordHistory(complaint, {
                action: "Inspector rejected complaint",
                old_status: previousStatus,
                new_status: "REJECTED",
                remarks: complaint.rejection_reason
            });
            return clone(complaint);
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/inspector/complaints/${complaintId}/reject`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    inspectorResolveComplaint: async (complaintId)=>{
        if (e2eMocksEnabled) {
            const complaint = getComplaint(complaintId);
            if (!complaint) return null;
            const previousStatus = complaint.status || "IN_PROGRESS";
            complaint.status = "CLOSED";
            recordHistory(complaint, {
                action: "Inspector resolved complaint",
                old_status: previousStatus,
                new_status: "CLOSED",
                remarks: "Resolved successfully in mock mode."
            });
            return clone(complaint);
        }
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/inspector/complaints/${complaintId}/resolve`);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(res);
    },
    getDistricts: async ()=>{
        if (e2eMocksEnabled) return {
            data: clone(e2eDistricts),
            meta: {
                total_records: e2eDistricts.length
            }
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].GET_DISTRICTS);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    createComplaint: async (complaintData)=>{
        if (e2eMocksEnabled) {
            const complaint = {
                id: `e2e-created-${e2eComplaints.length + 1}`,
                _id: `e2e-created-${e2eComplaints.length + 1}`,
                complaint_id: `CIV-E2E-${String(e2eComplaints.length + 1).padStart(3, "0")}`,
                status: "OPEN",
                title: complaintData.title || "Created Complaint",
                description: complaintData.description,
                complaint_type: complaintData.complaint_type,
                priority: complaintData.priority || "MEDIUM",
                address: complaintData.address || "",
                ward_id: complaintData.ward_id,
                ward: e2eWardsByDistrict["e2e-district-1"].find((ward)=>ward._id === complaintData.ward_id) || e2eWardsByDistrict["e2e-district-1"][0],
                citizen: getRoleProfile("CITIZEN"),
                created_at: new Date().toISOString(),
                history: [
                    {
                        _id: `hist-created-${Date.now()}`,
                        action: "Complaint submitted",
                        old_status: "",
                        new_status: "OPEN",
                        remarks: "Created in Selenium e2e mock mode.",
                        created_at: new Date().toISOString()
                    }
                ],
                ...complaintData
            };
            e2eComplaints = [
                clone(complaint),
                ...e2eComplaints
            ];
            return clone(complaint);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$endpoints$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ENDPOINTS"].CREATE_COMPLAINT, complaintData);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    updateComplaintStatus: async (id, status)=>{
        if (e2eMocksEnabled) {
            const complaint = getComplaint(id);
            if (!complaint) return null;
            const previousStatus = complaint.status || "OPEN";
            complaint.status = status.toUpperCase();
            recordHistory(complaint, {
                action: "Complaint status updated",
                old_status: previousStatus,
                new_status: complaint.status,
                remarks: `Status changed to ${complaint.status} in mock mode.`
            });
            return clone(complaint);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/complaints/${id}/status`, {
            status
        });
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    },
    addComplaintNote: async (id, payload)=>{
        if (e2eMocksEnabled) {
            const complaint = getComplaint(id);
            if (!complaint) return null;
            complaint.inspector_note = payload.text;
            recordHistory(complaint, {
                action: "Note added",
                old_status: complaint.status,
                new_status: complaint.status,
                remarks: payload.text
            });
            return clone(complaint);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].put(`/complaints/${id}/note`, payload);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["unwrapResponse"])(response);
    }
};
const __TURBOPACK__default__export__ = authService;
}),
"[project]/src/context/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/auth.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const AuthProvider = ({ children })=>{
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userToken, setUserToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSignout, setIsSignout] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setErrorState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const bootstrapAsync = async ()=>{
            try {
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
            } catch (e) {
                console.error("Auth restoration error:", e);
            } finally{
                setIsLoading(false);
            }
        };
        bootstrapAsync();
    }, []);
    const signIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email)=>{
        try {
            setErrorState(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].login(email);
            return response;
        } catch (err) {
            const errMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err);
            setErrorState(errMsg);
            throw err;
        }
    }, []);
    const signUp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (userData)=>{
        try {
            setErrorState(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].register(userData);
            return response;
        } catch (err) {
            const errMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err);
            setErrorState(errMsg);
            throw err;
        }
    }, []);
    const verifyLogin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, otp)=>{
        try {
            setErrorState(null);
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].verifyLogin(email, otp);
            setUserToken(session.access_token);
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getProfile();
            setUser(profile);
            setIsSignout(false);
            return session;
        } catch (err) {
            const errMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err);
            setErrorState(errMsg);
            throw err;
        }
    }, []);
    const verifyRegister = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, otp)=>{
        try {
            setErrorState(null);
            const session = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].verifyRegister(email, otp);
            setUserToken(session.access_token);
            const profile = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].getProfile();
            setUser(profile);
            setIsSignout(false);
            return session;
        } catch (err) {
            const errMsg = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getErrorMessage"])(err);
            setErrorState(errMsg);
            throw err;
        }
    }, []);
    const signOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$auth$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].logout();
        } catch (err) {
            console.error("Logout error:", err);
        }
        setUser(null);
        setUserToken(null);
        setIsSignout(true);
    }, []);
    const clearError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setErrorState(null);
    }, []);
    const setError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((msg)=>{
        setErrorState(msg);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            userToken,
            isLoading,
            isSignout,
            error,
            signIn,
            signUp,
            verifyLogin,
            verifyRegister,
            signOut,
            clearError,
            setError
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/auth-context.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
}),
"[project]/src/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/auth-context.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Providers({ children }) {
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                    refetchOnWindowFocus: false,
                    retry: 1
                }
            }
        }));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/src/app/providers.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/providers.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__571df0e7._.js.map