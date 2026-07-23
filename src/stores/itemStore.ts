import { create } from 'zustand';
import type { Item, CreateItemDto, UpdateItemDto } from '@/types/item';

const API_URL = import.meta.env.VITE_API_URL;

interface ItemState {
  itemsByBoard: Item[];
  currentItem: Item | null;
  isLoading: boolean;

  fetchItemsByBoard: (boardId: string) => Promise<void>;
  fetchItem: (id: string) => Promise<void>;
  createItem: (dto: CreateItemDto) => Promise<Item>;
  updateItem: (id: string, dto: UpdateItemDto) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const useItemStore = create<ItemState>((set) => ({
  itemsByBoard: [],
  currentItem: null,
  isLoading: false,

  fetchItemsByBoard: async (boardId) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/items/board/${boardId}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao carregar itens');
      }
      const items: Item[] = await res.json();
      set({ itemsByBoard: items });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchItem: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/items/${id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao carregar item');
      }
      const item: Item = await res.json();
      set({ currentItem: item });
    } finally {
      set({ isLoading: false });
    }
  },

  createItem: async (dto) => {
    const res = await fetch(`${API_URL}/items/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao criar item');
    }
    set((state) => ({ itemsByBoard: [...state.itemsByBoard, data] }));
    return data as Item;
  },

  updateItem: async (id, dto) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(dto),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao atualizar item');
    }
    set((state) => ({
      itemsByBoard: state.itemsByBoard.map((i) => (i.id === id ? data : i)),
      currentItem: state.currentItem?.id === id ? data : state.currentItem,
    }));
    return data as Item;
  },

  deleteItem: async (id) => {
    const res = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Erro ao deletar item');
    }
    set((state) => ({
      itemsByBoard: state.itemsByBoard.filter((i) => i.id !== id),
      currentItem: state.currentItem?.id === id ? null : state.currentItem,
    }));
  },
}));
