import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Onboard from './pages/Onboard';
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/ProtectedRoute';

// Componente auxiliar para esconder a Navbar no Dashboard
function MainContent() {
  const location = useLocation();
  
  // Se o link começar por "/dashboard", NÃO mostra a Navbar pública
  const showPublicNavbar = !location.pathname.startsWith('/dashboard');

  return (
    <>
      {showPublicNavbar && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        
        <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route path="/onboard" element={
            <ProtectedRoute>
              <Onboard />
            </ProtectedRoute>
          } 
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <MainContent />
    </BrowserRouter>
  );
}