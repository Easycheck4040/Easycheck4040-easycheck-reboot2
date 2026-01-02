import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home'; // Agora importamos a Home original
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboard from './pages/Onboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        {/* Rota Pública - Agora aponta para a Home bonita */}
        <Route path="/" element={<Home />} />
        
        {/* Rota de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rotas Protegidas */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/onboard" 
          element={
            <ProtectedRoute>
              <Onboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Qualquer outro link vai para a Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}