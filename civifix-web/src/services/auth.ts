import api, { unwrapResponse } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";

export interface UserSession {
  access_token: string;
  refresh_token?: string;
  user?: any;
}

export interface UserProfile {
  id: string | number;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

export interface Complaint {
  id: string | number;
  title: string;
  description: string;
  status: string;
  [key: string]: any;
}

const storeSession = (session: UserSession) => {
  if (!session?.access_token) return;
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", session.access_token);
    if (session.refresh_token) {
      localStorage.setItem("refreshToken", session.refresh_token);
    }
  }
};

const e2eMocksEnabled = process.env.NEXT_PUBLIC_E2E_MOCKS === "true";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const e2eDistricts = [
  { _id: "e2e-district-1", id: "e2e-district-1", name: "Central District", active: true },
  { _id: "e2e-district-2", id: "e2e-district-2", name: "North District", active: true },
];

const e2eWardsByDistrict: Record<string, Array<Record<string, any>>> = {
  "e2e-district-1": [
    { _id: "e2e-ward-1", id: "e2e-ward-1", ward_name: "Ward 1 - Central", ward_number: 1 },
    { _id: "e2e-ward-2", id: "e2e-ward-2", ward_name: "Ward 2 - Market", ward_number: 2 },
  ],
  "e2e-district-2": [
    { _id: "e2e-ward-3", id: "e2e-ward-3", ward_name: "Ward 3 - North", ward_number: 3 },
    { _id: "e2e-ward-4", id: "e2e-ward-4", ward_name: "Ward 4 - Lake", ward_number: 4 },
  ],
};

const getMockRole = (): string => {
  if (typeof window === "undefined") return "CITIZEN";
  return (localStorage.getItem("e2eRole") || "CITIZEN").toUpperCase();
};

const getRoleProfile = (role: string): UserProfile => {
  const normalizedRole = role.toUpperCase();
  const profiles: Record<string, UserProfile> = {
    CITIZEN: {
      id: "e2e-user-citizen",
      email: "selenium-test@civifix.local",
      name: "Selenium Citizen",
      role: "CITIZEN",
      mobile_number: "9876543210",
      district: "e2e-district-1",
      district_id: "e2e-district-1",
    },
    INSPECTOR: {
      id: "e2e-user-inspector",
      email: "inspector@civifix.local",
      name: "Inspector Isha",
      role: "INSPECTOR",
      mobile_number: "9876500001",
      district: "e2e-district-1",
      district_id: "e2e-district-1",
      ward_id: "e2e-ward-1",
    },
    WORKER: {
      id: "e2e-user-worker",
      email: "worker@civifix.local",
      name: "Worker Wren",
      role: "WORKER",
      mobile_number: "9876500002",
      district: "e2e-district-1",
      district_id: "e2e-district-1",
      ward_id: "e2e-ward-1",
    },
    DISTRICT_ADMIN: {
      id: "e2e-user-district-admin",
      email: "district.admin@civifix.local",
      name: "District Admin Dana",
      role: "DISTRICT_ADMIN",
      mobile_number: "9876500003",
      district: "e2e-district-1",
      district_id: "e2e-district-1",
    },
    SUPER_ADMIN: {
      id: "e2e-user-super-admin",
      email: "super.admin@civifix.local",
      name: "Super Admin Sam",
      role: "SUPER_ADMIN",
      mobile_number: "9876500004",
      district: "Central District",
      district_id: "central-district",
    },
  };

  return clone(profiles[normalizedRole] || profiles.CITIZEN);
};

let e2eComplaints: Array<Record<string, any>> = [
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
    ward: { _id: "e2e-ward-1", ward_name: "Ward 1 - Central", ward_number: 1 },
    citizen: { name: "Selenium Citizen", phone: "9876543210", email: "selenium-test@civifix.local" },
    created_at: "2026-06-01T08:00:00.000Z",
    history: [
      {
        _id: "hist-1",
        action: "Complaint submitted",
        old_status: "",
        new_status: "OPEN",
        remarks: "Submitted from the citizen portal.",
        created_at: "2026-06-01T08:00:00.000Z",
      },
    ],
    citizen_note: "Please collect the garbage before the weekend.",
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
    ward: { _id: "e2e-ward-1", ward_name: "Ward 1 - Central", ward_number: 1 },
    citizen: { name: "Selenium Citizen", phone: "9876543210", email: "selenium-test@civifix.local" },
    created_at: "2026-06-02T08:00:00.000Z",
    worker_note: "Temporary barricade installed; repair in progress.",
    history: [
      {
        _id: "hist-2a",
        action: "Complaint started",
        old_status: "OPEN",
        new_status: "IN_PROGRESS",
        remarks: "Inspector moved the case to active work.",
        created_at: "2026-06-02T10:00:00.000Z",
      },
    ],
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
    ward: { _id: "e2e-ward-2", ward_name: "Ward 2 - Market", ward_number: 2 },
    citizen: { name: "Selenium Citizen", phone: "9876543210", email: "selenium-test@civifix.local" },
    created_at: "2026-06-03T08:00:00.000Z",
    inspector_note: "Verified resolved during evening inspection.",
    history: [
      {
        _id: "hist-3a",
        action: "Complaint resolved",
        old_status: "IN_PROGRESS",
        new_status: "CLOSED",
        remarks: "Closed after replacement of the streetlight.",
        created_at: "2026-06-04T12:00:00.000Z",
      },
    ],
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
    ward: { _id: "e2e-ward-2", ward_name: "Ward 2 - Market", ward_number: 2 },
    citizen: { name: "Selenium Citizen", phone: "9876543210", email: "selenium-test@civifix.local" },
    created_at: "2026-06-04T08:00:00.000Z",
    history: [
      {
        _id: "hist-4a",
        action: "Sent for review",
        old_status: "WORKING",
        new_status: "APPROVAL",
        remarks: "Awaiting inspector approval.",
        created_at: "2026-06-05T08:00:00.000Z",
      },
    ],
  },
];

const e2eSession = (): UserSession => ({
  access_token: "e2e-access-token",
  refresh_token: "e2e-refresh-token",
  user: getRoleProfile(getMockRole()),
});

const getComplaint = (id: string | number) =>
  e2eComplaints.find((c) => c._id === id || c.complaint_id === id || c.id === id);

const recordHistory = (complaint: Record<string, any>, entry: Record<string, any>) => {
  complaint.history = Array.isArray(complaint.history) ? complaint.history : [];
  complaint.history = [
    ...complaint.history,
    {
      _id: `hist-${complaint.history.length + 1}-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...entry,
    },
  ];
};

const getComplaintSummary = () => {
  const summary = { OPEN: 0, WORKING: 0, APPROVAL: 0, CLOSED: 0, REJECTED: 0, IN_PROGRESS: 0 } as Record<string, number>;
  for (const complaint of e2eComplaints) {
    const status = (complaint.status || "OPEN").toUpperCase();
    summary[status] = (summary[status] || 0) + 1;
  }
  return summary;
};

const getDashboardData = (role: string) => {
  const normalizedRole = role.toUpperCase();
  const wardComplaints = e2eComplaints.filter((complaint) => complaint.ward_id === "e2e-ward-1");
  if (normalizedRole === "SUPER_ADMIN" || normalizedRole === "DISTRICT_ADMIN") {
    return {
      stats: {
        total_wards: e2eDistricts.length * 2,
        total_inspectors: 4,
        total_complaints: e2eComplaints.length,
        resolved_complaints: e2eComplaints.filter((complaint) => ["CLOSED", "RESOLVED"].includes((complaint.status || "").toUpperCase())).length,
      },
    };
  }

  return {
    ward_info: { ward_name: "Ward 1 - Central", ward_number: 1 },
    recent_complaints: clone(wardComplaints),
    pending_approvals: wardComplaints.filter((complaint) => (complaint.status || "").toUpperCase() === "APPROVAL").length,
    stats: {
      total_complaints: wardComplaints.length,
      pending: wardComplaints.filter((complaint) => ["OPEN", "PENDING"].includes((complaint.status || "").toUpperCase())).length,
      in_progress: wardComplaints.filter((complaint) => ["WORKING", "IN_PROGRESS"].includes((complaint.status || "").toUpperCase())).length,
      resolved_complaints: wardComplaints.filter((complaint) => ["CLOSED", "RESOLVED"].includes((complaint.status || "").toUpperCase())).length,
      resolved: wardComplaints.filter((complaint) => ["CLOSED", "RESOLVED"].includes((complaint.status || "").toUpperCase())).length,
      for_review: wardComplaints.filter((complaint) => (complaint.status || "").toUpperCase() === "APPROVAL").length,
    },
  };
};

const getWardComplaints = () => e2eComplaints.filter((complaint) => complaint.ward_id === "e2e-ward-1");

const getAssignedComplaints = () => {
  const role = getMockRole();
  if (role === "INSPECTOR") return getWardComplaints();
  return e2eComplaints.filter((complaint) => ["IN_PROGRESS", "WORKING", "APPROVAL"].includes((complaint.status || "").toUpperCase()));
};

export const authService = {
  register: async (userData: any): Promise<any> => {
    if (e2eMocksEnabled) return { message: "OTP sent", user: userData };
    const response = await api.post(ENDPOINTS.REGISTER, userData);
    return unwrapResponse(response);
  },

  login: async (email: string): Promise<any> => {
    if (e2eMocksEnabled) return { message: "OTP sent", email };
    const response = await api.post(ENDPOINTS.LOGIN, { email });
    return unwrapResponse(response);
  },

  verifyLogin: async (email: string, otp: string): Promise<UserSession> => {
    if (e2eMocksEnabled) {
      const session = e2eSession();
      storeSession(session);
      return session;
    }
    const response = await api.post(ENDPOINTS.VERIFY_LOGIN, { email, otp });
    const session = unwrapResponse<UserSession>(response);
    storeSession(session);
    return session;
  },

  verifyRegister: async (email: string, otp: string): Promise<UserSession> => {
    if (e2eMocksEnabled) {
      const session = e2eSession();
      storeSession(session);
      return session;
    }
    const response = await api.post(ENDPOINTS.VERIFY_REGISTER, { email, otp });
    const session = unwrapResponse<UserSession>(response);
    storeSession(session);
    return session;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn("Logout API failed, clearing local storage", error);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  getProfile: async (): Promise<UserProfile> => {
    if (e2eMocksEnabled) return getRoleProfile(getMockRole());
    const response = await api.get(ENDPOINTS.GET_PROFILE);
    return unwrapResponse<UserProfile>(response);
  },

  updateProfile: async (userData: any): Promise<UserProfile> => {
    if (e2eMocksEnabled) return { ...getRoleProfile(getMockRole()), ...userData };
    const response = await api.put(ENDPOINTS.UPDATE_PROFILE, userData);
    return unwrapResponse<UserProfile>(response);
  },

  getComplaints: async ({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string } = {}): Promise<any> => {
    if (e2eMocksEnabled) {
      const filtered = status ? e2eComplaints.filter((c) => (c.status || "").toUpperCase() === status.toUpperCase()) : e2eComplaints;
      const statusCounts = getComplaintSummary();
      return {
        data: clone(filtered.slice(0, limit)),
        meta: {
          page,
          limit,
          total_records: filtered.length,
          status_counts: statusCounts,
        },
      };
    }
    const response = await api.get(ENDPOINTS.GET_COMPLAINTS, {
      params: { page, limit, status },
    });
    return unwrapResponse(response);
  },

  getComplaint: async (id: string | number): Promise<Complaint> => {
    if (e2eMocksEnabled) return (e2eComplaints.find((c) => c._id === id || c.complaint_id === id) || e2eComplaints[0]) as unknown as Complaint;
    const response = await api.get(ENDPOINTS.GET_COMPLAINT(id));
    return unwrapResponse<Complaint>(response);
  },

  createComplaint: async (complaintData: any): Promise<Complaint> => {
    if (e2eMocksEnabled) {
      return {
        id: "e2e-created-1",
        _id: "e2e-created-1",
        complaint_id: "CIV-E2E-NEW",
        status: "OPEN",
        title: "Created Complaint",
        description: complaintData.description,
        ...complaintData,
      } as Complaint;
    }
    const response = await api.post(ENDPOINTS.CREATE_COMPLAINT, complaintData);
    return unwrapResponse<Complaint>(response);
  },

  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      return !!token;
    }
    return false;
  },

  getMe: async (): Promise<UserProfile> => {
    if (e2eMocksEnabled) return getRoleProfile(getMockRole());
    const res = await api.get(ENDPOINTS.GET_PROFILE);
    return unwrapResponse<UserProfile>(res);
  },

  // ─── SUPER ADMIN ─────────────────────────────────────────────────────────────
  getAdminStats: async (): Promise<any> => {
    if (e2eMocksEnabled) return { stats: getComplaintSummary() };
    const res = await api.get("/admin/stats");
    return unwrapResponse(res);
  },

  // ─── DISTRICT ADMIN ──────────────────────────────────────────────────────────
  getInspectors: async (): Promise<any[]> => {
    const res = await api.get("/admin/inspectors");
    return unwrapResponse<any[]>(res);
  },

  getWorkers: async (): Promise<any[]> => {
    const res = await api.get("/admin/workers");
    return unwrapResponse<any[]>(res);
  },

  getDistrictUsers: async (): Promise<any[]> => {
    const res = await api.get("/admin/users");
    return unwrapResponse<any[]>(res);
  },

  // ─── INSPECTOR ───────────────────────────────────────────────────────────────
  getWardComplaints: async ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status?: string } = {}): Promise<any> => {
    if (e2eMocksEnabled) {
      const source = getWardComplaints();
      const filtered = status ? source.filter((complaint) => (complaint.status || "").toUpperCase() === status.toUpperCase()) : source;
      return { complaints: clone(filtered.slice(0, limit)), page, limit };
    }
    const params: any = { page, limit };
    if (status) params.status = status;
    const res = await api.get("/inspector/complaints", { params });
    return unwrapResponse(res);
  },

  getWardWorkers: async (): Promise<any[]> => {
    const res = await api.get("/inspector/workers");
    return unwrapResponse<any[]>(res);
  },

  // ─── WORKER ──────────────────────────────────────────────────────────────────
  getAssignedComplaints: async ({ page = 1, limit = 20, status }: { page?: number; limit?: number; status?: string } = {}): Promise<any> => {
    if (e2eMocksEnabled) {
      const source = getAssignedComplaints();
      const filtered = status ? source.filter((complaint) => (complaint.status || "").toUpperCase() === status.toUpperCase()) : source;
      return { complaints: clone(filtered.slice(0, limit)), page, limit };
    }
    const params: any = { page, limit };
    if (status) params.status = status;
    const res = await api.get("/worker/complaints", { params });
    return unwrapResponse(res);
  },

  getWardsByDistrict: async (districtId: string | number, { page = 1, is_active = true, limit = 60 }: { page?: number; is_active?: boolean; limit?: number } = {}): Promise<any> => {
    if (e2eMocksEnabled) {
      const wards = e2eWardsByDistrict[String(districtId)] || e2eWardsByDistrict["e2e-district-1"];
      return { data: clone(wards.slice(0, limit)), meta: { page, is_active } };
    }
    const res = await api.get(`/wards/district/${districtId}`, {
      params: { page, is_active, limit },
    });
    return unwrapResponse(res);
  },

  // ─── WARD MANAGEMENT ─────────────────────────────────────────────────────────
  getWards: async ({ page = 1, limit = 20, is_active = true }: { page?: number; limit?: number; is_active?: boolean } = {}): Promise<any> => {
    if (e2eMocksEnabled) return { data: clone(e2eWardsByDistrict["e2e-district-1"].slice(0, limit)), meta: { page, is_active } };
    const res = await api.get("/wards/district", {
      params: { page, limit, is_active },
    });
    return unwrapResponse(res);
  },

  getWardDetail: async (wardId: string | number): Promise<any> => {
    const res = await api.get(`/wards/${wardId}`);
    return unwrapResponse(res);
  },

  getInspectorWard: async (): Promise<any> => {
    const res = await api.get("/wards/inspector/assigned");
    return unwrapResponse(res);
  },

  assignInspectorToWard: async (wardId: string | number, inspectorId: string | number): Promise<any> => {
    const res = await api.post(`/wards/${wardId}/assign-inspector`, {
      inspector_id: inspectorId,
    });
    return unwrapResponse(res);
  },

  // ─── DASHBOARD ROLE-SPECIFIC ────────────────────────────────────────────────
  getInspectorDashboard: async (): Promise<any> => {
    if (e2eMocksEnabled) return getDashboardData("INSPECTOR");
    const res = await api.get("/dashboard/inspector/dashboard");
    return unwrapResponse(res);
  },

  getDistrictAdminDashboard: async (): Promise<any> => {
    if (e2eMocksEnabled) return getDashboardData("DISTRICT_ADMIN");
    const res = await api.get("/dashboard/district-admin/dashboard");
    return unwrapResponse(res);
  },

  getWorkerDashboard: async (): Promise<any> => {
    if (e2eMocksEnabled) return getDashboardData("WORKER");
    const res = await api.get("/dashboard/worker/dashboard");
    return unwrapResponse(res);
  },

  // ─── INSPECTOR COMPLAINT ACTIONS ─────────────────────────────────────────────
  inspectorStartWork: async (complaintId: string | number): Promise<any> => {
    if (e2eMocksEnabled) {
      const complaint = getComplaint(complaintId);
      if (!complaint) return null;
      const previousStatus = complaint.status || "OPEN";
      complaint.status = "IN_PROGRESS";
      recordHistory(complaint, {
        action: "Inspector started work",
        old_status: previousStatus,
        new_status: "IN_PROGRESS",
        remarks: "Mock inspector workflow started work.",
      });
      return clone(complaint);
    }
    const res = await api.put(`/inspector/complaints/${complaintId}/start-work`);
    return unwrapResponse(res);
  },

  inspectorRejectComplaint: async (complaintId: string | number): Promise<any> => {
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
        remarks: complaint.rejection_reason,
      });
      return clone(complaint);
    }
    const res = await api.put(`/inspector/complaints/${complaintId}/reject`);
    return unwrapResponse(res);
  },

  inspectorResolveComplaint: async (complaintId: string | number): Promise<any> => {
    if (e2eMocksEnabled) {
      const complaint = getComplaint(complaintId);
      if (!complaint) return null;
      const previousStatus = complaint.status || "IN_PROGRESS";
      complaint.status = "CLOSED";
      recordHistory(complaint, {
        action: "Inspector resolved complaint",
        old_status: previousStatus,
        new_status: "CLOSED",
        remarks: "Resolved successfully in mock mode.",
      });
      return clone(complaint);
    }
    const res = await api.put(`/inspector/complaints/${complaintId}/resolve`);
    return unwrapResponse(res);
  },

  getDistricts: async (): Promise<any> => {
    if (e2eMocksEnabled) return { data: clone(e2eDistricts), meta: { total_records: e2eDistricts.length } };
    const response = await api.get(ENDPOINTS.GET_DISTRICTS);
    return unwrapResponse(response);
  },

  createComplaint: async (complaintData: any): Promise<Complaint> => {
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
        ward: e2eWardsByDistrict["e2e-district-1"].find((ward) => ward._id === complaintData.ward_id) || e2eWardsByDistrict["e2e-district-1"][0],
        citizen: getRoleProfile("CITIZEN"),
        created_at: new Date().toISOString(),
        history: [
          {
            _id: `hist-created-${Date.now()}`,
            action: "Complaint submitted",
            old_status: "",
            new_status: "OPEN",
            remarks: "Created in Selenium e2e mock mode.",
            created_at: new Date().toISOString(),
          },
        ],
        ...complaintData,
      } as Complaint;
      e2eComplaints = [clone(complaint), ...e2eComplaints];
      return clone(complaint);
    }
    const response = await api.post(ENDPOINTS.CREATE_COMPLAINT, complaintData);
    return unwrapResponse<Complaint>(response);
  },

  updateComplaintStatus: async (id: string | number, status: string): Promise<any> => {
    if (e2eMocksEnabled) {
      const complaint = getComplaint(id);
      if (!complaint) return null;
      const previousStatus = complaint.status || "OPEN";
      complaint.status = status.toUpperCase();
      recordHistory(complaint, {
        action: "Complaint status updated",
        old_status: previousStatus,
        new_status: complaint.status,
        remarks: `Status changed to ${complaint.status} in mock mode.`,
      });
      return clone(complaint);
    }
    const response = await api.put(`/complaints/${id}/status`, { status });
    return unwrapResponse(response);
  },

  addComplaintNote: async (id: string | number, payload: { text: string }): Promise<any> => {
    if (e2eMocksEnabled) {
      const complaint = getComplaint(id);
      if (!complaint) return null;
      complaint.inspector_note = payload.text;
      recordHistory(complaint, {
        action: "Note added",
        old_status: complaint.status,
        new_status: complaint.status,
        remarks: payload.text,
      });
      return clone(complaint);
    }
    const response = await api.put(`/complaints/${id}/note`, payload);
    return unwrapResponse(response);
  },
};

export default authService;
