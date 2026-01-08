import { create } from "zustand";
import api from "../api/api";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/categories");
      set({ categories: res.data.categories || [], loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching categories",
        loading: false,
      });
    }
  },

  addCategory: async (categoryData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/categories", categoryData);
      set((state) => ({
        categories: [...state.categories, res.data.category],
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error creating category",
        loading: false,
      });
      return false;
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
        loading: false,
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error deleting category",
        loading: false,
      });
      return false;
    }
  },
}));
