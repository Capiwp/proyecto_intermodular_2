import { create } from "zustand";
import api from "../api/api";

export const useReportStore = create((set, get) => ({
  dashboardStats: null,
  loading: false,
  error: null,

  fetchDashboardStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/reports/dashboard-stats");
      // Unwrap the 'stats' property from the response
      set({ dashboardStats: response.data.stats || null, loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.response?.data?.error || "Error fetching stats",
        loading: false,
      });
    }
  },

  yearlyTrend: [],
  fetchYearlyTrend: async () => {
    try {
      const response = await api.get("/reports/yearly-trend");
      // Unwrap the 'yearlyTrend' property from the response
      // Ensure it is always an array to prevent .map errors
      set({
        yearlyTrend: Array.isArray(response.data.yearlyTrend)
          ? response.data.yearlyTrend
          : [],
      });
    } catch (err) {
      console.error(err);
      set({ yearlyTrend: [] });
    }
  },
}));
