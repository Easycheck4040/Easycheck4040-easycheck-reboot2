import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
// Importa os outros ficheiros para não dar erro, mesmo que ainda não os tenhamos refeito visualmente
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';
import Onboard from './pages/Onboard';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      {/* A Navbar fica fora das Routes para aparecer em todo o lado */}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
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
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}