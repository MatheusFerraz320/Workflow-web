import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Login } from '@/pages/login/Login';
import { Home } from '@/pages/home/Home';
import { Layout } from '@/components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors closeButton expand={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
