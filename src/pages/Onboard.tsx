import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// Configuração rápida do Supabase para esta página funcionar sozinha
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Onboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    nif: '',
    address: '',
    phone: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Quem é o utilizador que está a tentar criar a empresa?
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Precisas de fazer login novamente.');

      // 2. Guardar a empresa na base de dados
      const { error } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.name,
            nif: formData.nif,
            address: formData.address,
            phone: formData.phone,
            user_id: user.id 
          }
        ]);

      if (error) throw error;

      // 3. Sucesso! Vamos para o painel principal
      navigate('/dashboard');
      
    } catch (error: any) {
      alert('Erro ao criar empresa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Criar a tua Empresa 🚀</h2>
        <p className="text-center text-gray-500 mb-8">Precisamos destes dados para gerar as tuas faturas.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
            <input
              type="text"
              required
              placeholder="Ex: Minha Loja Lda"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NIF</label>
            <input
              type="text"
              required
              placeholder="Ex: 500100200"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.nif}
              onChange={e => setFormData({...formData, nif: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Morada (Opcional)</label>
            <input
              type="text"
              placeholder="Rua do Comércio, 123"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
              value={formData.address}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors"
          >
            {loading ? 'A criar empresa...' : 'Confirmar e Entrar ->'}
          </button>
        </form>
      </div>
    </div>
  );
}