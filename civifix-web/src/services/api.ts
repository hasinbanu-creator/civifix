import api, { unwrapResponse } from "@/lib/api";
import authService from "@/services/auth";

export const complaintsApi = {
  getMockMode: (): boolean => process.env.NEXT_PUBLIC_E2E_MOCKS === "true",

  updateStatus: async (id: string, status: string) => {
    if (process.env.NEXT_PUBLIC_E2E_MOCKS === "true") {
      return authService.updateComplaintStatus(id, status);
    }
    const res = await api.put(`/complaints/${id}/status`, { status });
    return unwrapResponse(res);
  },
  
  addNote: async (id: string, payload: { text: string }) => {
    if (process.env.NEXT_PUBLIC_E2E_MOCKS === "true") {
      return authService.addComplaintNote(id, payload);
    }
    const res = await api.put(`/complaints/${id}/note`, payload);
    return unwrapResponse(res);
  }
};
