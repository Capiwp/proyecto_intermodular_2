import { create } from "zustand";
import api from "../api/api";

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  loading: false,
  error: null,

  fetchBudgets: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/budgets");
      set({ budgets: res.data.budgets || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching budgets",
        loading: false,
      });
    }
  },

  addBudget: async (budgetData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/budgets", budgetData);
      set((state) => ({
        budgets: [...state.budgets, res.data.budget],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error creating budget",
        loading: false,
      });
      return false;
    }
  },

  updateBudget: async (id, budgetData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/budgets/${id}`, budgetData);
      set((state) => ({
        budgets: state.budgets.map((b) => (b.id === id ? res.data.budget : b)),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error updating budget",
        loading: false,
      });
      return false;
    }
  },

  deleteBudget: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/budgets/${id}`);
      set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error deleting budget",
        loading: false,
      });
      return false;
    }
  },
}));
