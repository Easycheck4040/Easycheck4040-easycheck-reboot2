import { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { Save, UploadCloud, Building2, Globe, FileText, AlertCircle } from 'lucide-react';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    company_nif: '',
    company_address: '',
    country: '',
    currency: 'EUR',
    invoice_template_url: '', // O URL da imagem do Word
    tax_regime: 'normal'
  });

  // Lista de Países Suportados (Para ativar os Kits Contabilísticos)
  const countries = ["Portugal", "Angola", "Brasil", "Moçambique", "Cabo Verde", "França"];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        setFormData({
            company_name: data.company_name || '',
            company_nif: data.company_nif || '',
            company_address: data.company_address || '',
            country: data.country || '',
            currency: data.currency || 'EUR',
            invoice_template_url: data.invoice_template_url || '',
            tax_regime: data.tax_regime || 'normal'
        });
      }
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPLOAD DO TEMPLATE (WORD/IMAGEM) ---
  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `templates/${Date.now()}.${fileExt}`;

    try {
      // 1. Upload para o Bucket 'company-assets'
      const { error: uploadError } = await supabase.storage
        .from('company-assets') 
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // 2. Obter URL Público
      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(fileName);

      setFormData(prev => ({ ...prev, invoice_template_url: publicUrl }));
      alert("Template carregado com sucesso! A pré-visualização aparecerá na próxima fatura.");
      
    } catch (error: any) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  // --- GUARDAR E INICIALIZAR CONTABILIDADE ---
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sem utilizador");

      // 1. Guardar Perfil Básico
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: formData.company_name,
          company_nif: formData.company_nif,
          company_address: formData.company_address,
          country: formData.country,
          currency: formData.currency,
          invoice_template_url: formData.invoice_template_url,
          tax_regime: formData.tax_regime,
          updated_at: new Date()
        })
        .eq('id', user.id);

      if (error) throw error;

      // 2. A MAGIA: Inicializar Plano de Contas se o país mudou
      // Chama a função SQL que criámos no passo anterior
      if (formData.country) {
        const { error: rpcError } = await supabase.rpc('init_company_accounting', {
          target_user_id: user.id,
          target_country: formData.country
        });
        
        if (rpcError) console.error("Erro ao gerar plano de contas:", rpcError);
        else console.log("Plano de Contas gerado para " + formData.country);
      }

      alert("Definições guardadas e Contabilidade configurada!");
      
    } catch (error: any) {
      alert("Erro ao guardar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10">A carregar definições...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      
      {/* CABEÇALHO */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Building2 className="text-blue-600"/> Configuração da Empresa
        </h2>
        <p className="text-gray-500">
          Estes dados definem a sua fiscalidade e o aspeto das suas faturas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DADOS FISCAIS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 space-y-4">
          <h3 className="font-bold text-lg flex gap-2 items-center"><Globe size={20}/> Localização & Fiscalidade</h3>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">País Sede</label>
            <select 
              name="country" 
              value={formData.country} 
              onChange={handleChange}
              className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600"
            >
              <option value="">Selecione o país...</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-xs text-blue-500 mt-1 flex items-center gap-1">
              <AlertCircle size={12}/> Ao mudar o país, o Plano de Contas (SNC/PGC) será reconfigurado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Moeda</label>
              <input name="currency" value={formData.currency} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Regime IVA</label>
              <select name="tax_regime" value={formData.tax_regime} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600">
                <option value="normal">Normal (Trimestral)</option>
                <option value="mensal">Normal (Mensal)</option>
                <option value="isento">Isento (Artigo 53º / 9º)</option>
              </select>
            </div>
          </div>
        </div>

        {/* IDENTIDADE & TEMPLATE */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 space-y-4">
          <h3 className="font-bold text-lg flex gap-2 items-center"><FileText size={20}/> Identidade Visual</h3>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nome Legal</label>
            <input name="company_name" value={formData.company_name} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" placeholder="Ex: Minha Empresa, Lda." />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">NIF / CNPJ</label>
            <input name="company_nif" value={formData.company_nif} onChange={handleChange} className="w-full p-3 border rounded-xl dark:bg-gray-900 dark:border-gray-600" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Template da Fatura (Fundo A4)</label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-4 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
              <input 
                type="file" 
                onChange={handleTemplateUpload} 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center gap-2">
                {uploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div> : <UploadCloud className="text-gray-400 h-8 w-8"/>}
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {formData.invoice_template_url ? "Template Carregado (Clique para trocar)" : "Carregar imagem de fundo (Word/Canva)"}
                </span>
                <span className="text-xs text-gray-400">Suporta PNG ou JPG (A4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RODAPÉ FIXO DE AÇÃO */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={20}/> {saving ? 'A Guardar...' : 'Guardar Alterações'}
        </button>
      </div>

    </div>
  );
}