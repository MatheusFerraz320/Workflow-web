import { create } from 'zustand';
import type { Board, CreateBoardDto, UpdateBoardDto } from '@/types/board';

const API_URL = import.meta.env.VITE_API_URL;

interface BoardState {
  boards: Board[];
  isLoading: boolean;

  fetchBoards: () => Promise<void>;
  createBoard: (dto: CreateBoardDto) => Promise<Board>;
  updateBoard: (id: string, dto: UpdateBoardDto) => Promise<Board>;
  deleteBoard: (id: string) => Promise<void>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  isLoading: false,

  fetchBoards: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/boards`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao carregar boards');
      }
      const boards: Board[] = await res.json();
      set({ boards });
    } finally {
      set({ isLoading: false });
    }
  },

  createBoard: async (dto) => {
    const res = await fetch(`${API_URL}/boards/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar board');
    }
    set((state) => ({ boards: [data, ...state.boards] }));
    return data as Board;
  },

  updateBoard: async (id, dto) => {
    const res = await fetch(`${API_URL}/boards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar board');
    }
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...data } : b)),
    }));
    return data as Board;
  },

  deleteBoard: async (id) => {
    const res = await fetch(`${API_URL}/boards/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Erro ao deletar board');
    }
    set((state) => ({ boards: state.boards.filter((b) => b.id !== id) }));
  },
}));
