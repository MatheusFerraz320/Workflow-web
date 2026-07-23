import { useEffect, useState } from 'react';
import type { User } from '@/types/user';

const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/users`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return { users, isLoading };
}
