import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboard from './pages/Onboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Rota Pública (Página Inicial) */}
        <Route path="/" element={<Landing />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas (Só entra quem tem login) */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        {/* A Rota que faltava: Criar Empresa */}
        <Route 
          path="/onboard" 
          element={
            <ProtectedRoute>
              <Onboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Se alguém tentar inventar um link, vai para a inicial */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}