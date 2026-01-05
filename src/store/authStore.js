import { create } from "zustand";
import api from "../api/api";



export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,

  // Acción de Login
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { email, password });
      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al iniciar sesión",
        loading: false,
      });
    }
  },

  // Acción de Logout
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = get().token;
      await api.post(
        "/auth/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Error al cambiar la contraseña' 
      };
    }
  },

  // Acción de registro
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/register", userData);
      set({ user: res.data.user, token: res.data.token, loading: false });
      localStorage.setItem("token", res.data.token);
    } catch (err) {
      set({
        error: err.response?.data?.error || err.response?.data?.errors || err.message,
        loading: false,
      });
      throw err;
    }
    set({ user: null, token: null });
  },

  // Intentar login automático si hay token
  tryAutoLogin: async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    set({ loading: true });
    try {
      // Ajusta este endpoint según el backend
      const res = await api.get("/auth/me");
      set({ user: res.data, token, loading: false });
    } catch (err) {
      console.error("Token inválido o expirado", err);
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },

  // Acción de recuperación de contraseña
  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/forgot-password", { email });
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || err.response?.data?.message || "Error al enviar el correo",
        loading: false,
      });
      return false;
    }
  },

  // Acción para confirmar nueva contraseña
  confirmPasswordReset: async (token, newPassword) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/reset-password", { token, newPassword });
      set({ loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al restablecer contraseña",
        loading: false,
      });
      return false;
    }
  },
  
  // Acción para subir avatar
  uploadAvatar: async (formData) => {
    set({ loading: true, error: null });
    try {
      // Necesitamos configurar el header para multipart/form-data
      const res = await api.post("/users/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Actualizamos el usuario con la nueva info (que incluirá avatar_url)
      set((state) => ({ 
        user: { ...state.user, ...res.data.user }, 
        loading: false 
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al subir la imagen",
        loading: false,
      });
      return false;
    }
  },
  // Acción para actualizar perfil completo
  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete("/users/me");
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al eliminar cuenta",
        loading: false,
      });
      return false;
    }
  },
  
  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    const currentUser = get().user;
    if (!currentUser) return false;
    
    try {
      const res = await api.put(`/users/${currentUser.id}`, profileData);
      set((state) => ({ 
        user: { ...state.user, ...res.data.user }, 
        loading: false 
      }));
      return true;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error al actualizar perfil",
        loading: false,
      });
      return false;
    }
  },
}));
