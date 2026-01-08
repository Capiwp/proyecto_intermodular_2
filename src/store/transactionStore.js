import { create } from "zustand";
import api from "../api/api";

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      // params can include from, to, category, limit, offset
      const response = await api.get("/transactions", { params });
      set({ transactions: response.data.transactions || [], loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.response?.data?.error || "Error fetching transactions",
        loading: false,
      });
    }
  },

  addTransaction: async (transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/transactions", transactionData);
      // Prepend the new transaction or refetch
      const newTx = response.data.transaction;
      set((state) => ({
        transactions: [newTx, ...state.transactions],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error creating transaction",
        loading: false,
      });
      return false;
    }
  },

  updateTransaction: async (id, transactionData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/transactions/${id}`, transactionData);
      const updatedTx = response.data.transaction;
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === id ? updatedTx : t
        ),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error updating transaction",
        loading: false,
      });
      return false;
    }
  },

  deleteTransaction: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error deleting transaction",
        loading: false,
      });
      return false;
    }
  },
}));
