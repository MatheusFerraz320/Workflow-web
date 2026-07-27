import { create } from 'zustand';
import type { User } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  updateMe: (dto: { name?: string; email?: string; password?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    localStorage.setItem('token', data.access_token);
    set({ user: data.user, token: data.access_token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    set({ isLoading: true });

    try {
      const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isLoading: false });
        return;
      }

      const user: User = await res.json();
      set({ user, token, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },

  updateMe: async (dto) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Não autenticado');

    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar perfil');
    }

    set((state) => ({ user: state.user ? { ...state.user, ...data } : data }));
  },
}));
