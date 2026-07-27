import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from '@/pages/login/Login';
import { Home } from '@/pages/home/Home';
import { BoardDetail } from '@/pages/boards/BoardDetail';
import { ItemDetailPage } from '@/pages/items/ItemDetailPage';
import { Register } from '@/pages/register/Register';
import { Users } from '@/pages/users/Users';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { Metrics } from '@/pages/metrics/Metrics';
import { MyWork } from '@/pages/my-work/MyWork';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useAuthStore } from '@/stores/authStore';

function App() {
  const loadUser = useAuthStore((s) => s.loadUser);
  const isLoading = useAuthStore((s) => s.isLoading);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton expand={false} />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-work" element={<MyWork />} />
            <Route path="/boards/:id" element={<BoardDetail />} />
            <Route path="/boards/:boardId/items/:itemId" element={<ItemDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/metrics" element={<Metrics />} />
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route path="/register" element={<Register />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
