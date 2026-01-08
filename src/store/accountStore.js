import { create } from "zustand";
import api from "../api/api";

export const useAccountStore = create((set, get) => ({
  accounts: [],
  transfers: [],
  loading: false,
  error: null,

  fetchAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/accounts");
      // Unwrap if wrapped in { accounts: [...] }
      set({ accounts: response.data.accounts || [], loading: false });
    } catch (err) {
      console.error(err);
      set({
        error: err.response?.data?.error || "Error fetching accounts",
        loading: false,
      });
    }
  },

  addAccount: async (accountData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/accounts", accountData);
      set((state) => ({
        accounts: [response.data.account, ...state.accounts],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error creating account",
        loading: false,
      });
      return false;
    }
  },

  updateAccount: async (id, accountData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/accounts/${id}`, accountData);
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === id ? response.data.account : a
        ),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error updating account",
        loading: false,
      });
      return false;
    }
  },

  deleteAccount: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/accounts/${id}`);
      set((state) => ({
        accounts: state.accounts.filter((a) => a.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error deleting account",
        loading: false,
      });
      return false;
    }
  },

  fetchTransfers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get("/accounts/transfers/history");
      set({ transfers: response.data.transfers || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching transfers",
        loading: false,
      });
    }
  },

  createTransfer: async (transferData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post("/accounts/transfers", transferData);
      // Refresh accounts to reflect balance changes
      await get().fetchAccounts();
      await get().fetchTransfers();
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error creating transfer",
        loading: false,
      });
      return false;
    }
  },
}));
