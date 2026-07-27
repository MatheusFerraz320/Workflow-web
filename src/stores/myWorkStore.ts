import { create } from 'zustand';
import type { Item, ItemStatus } from '@/types/item';

const API_URL = import.meta.env.VITE_API_URL;
const PINNED_KEY = 'b2work:pinnedItems';

// TODO: Backend deve criar os seguintes endpoints:
// POST /items/:id/pin   — registra que o usuário fixou o item
// DELETE /items/:id/pin — remove a fixação do item
// GET /items/pinned     — retorna todos os itens fixados pelo usuário autenticado
// O campo `pinned` deve ser adicionado ao modelo Item no banco de dados

interface MyWorkState {
  assignedItems: Item[];
  pinnedItemIds: string[];
  isLoading: boolean;
  filter: 'all' | 'assigned' | 'pinned';

  fetchMyWork: () => Promise<void>;
  setFilter: (filter: 'all' | 'assigned' | 'pinned') => void;
  togglePin: (itemId: string) => void;
  isPinned: (itemId: string) => boolean;
  loadPinned: () => void;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function loadPinnedFromStorage(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePinnedToStorage(ids: string[]) {
  localStorage.setItem(PINNED_KEY, JSON.stringify(ids));
}

export const useMyWorkStore = create<MyWorkState>((set, get) => ({
  assignedItems: [],
  pinnedItemIds: loadPinnedFromStorage(),
  isLoading: false,
  filter: 'all',

  fetchMyWork: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/users/me/assigned-items`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erro ao carregar seus itens');
      }
      const items: Item[] = await res.json();
      set({ assignedItems: items });
    } finally {
      set({ isLoading: false });
    }
  },

  setFilter: (filter) => set({ filter }),

  togglePin: (itemId) => {
    const current = get().pinnedItemIds;
    const next = current.includes(itemId)
      ? current.filter((id) => id !== itemId)
      : [...current, itemId];
    savePinnedToStorage(next);
    set({ pinnedItemIds: next });
  },

  isPinned: (itemId) => get().pinnedItemIds.includes(itemId),

  loadPinned: () => {
    set({ pinnedItemIds: loadPinnedFromStorage() });
  },
}));
