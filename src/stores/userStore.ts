import { create } from 'zustand';
import type { User, UpdateUserDto } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

interface UserState {
  users: User[];
  isLoading: boolean;

  fetchUsers: () => Promise<void>;
  updateUser: (id: string, dto: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false,

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao carregar usuários');
      }
      const users: User[] = await res.json();
      set({ users });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, dto) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar usuário');
    }
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
    return data as User;
  },

  deleteUser: async (id) => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Erro ao deletar usuário');
    }
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
  },
}));
