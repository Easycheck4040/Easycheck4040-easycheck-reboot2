import { useEffect, useState } from 'react';
// ⚠️ Este caminho assume que o ficheiro está em: src/hooks/useAccounting.ts
// e o cliente supabase está em: src/supabase/client.ts
import { supabase } from '../supabase/client'; 

// --- INTERFACES (Para o TypeScript não dar erro) ---
export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
}

export interface JournalItem {
  id: string;
  debit: number;
  credit: number;
  company_accounts: {
    code: string;
    name: string;
  } | null;
}

export interface JournalEntry {
  id: string;
  date: string;
  description: string;
  document_ref?: string;
  journal_items: JournalItem[];
}

// --- O HOOK PRINCIPAL ---
export function useAccounting() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // 1. Buscar Plano de Contas
      const { data: accData, error: accError } = await supabase
        .from('company_accounts')
        .select('*')
        .order('code', { ascending: true });

      if (accError) throw accError;

      // 2. Buscar Movimentos (Diário) com as linhas associadas
      const { data: entryData, error: entryError } = await supabase
        .from('journal_entries')
        .select(`
          id, date, description, document_ref,
          journal_items (
            id, debit, credit,
            company_accounts ( code, name )
          )
        `)
        .order('date', { ascending: false });

      if (entryError) throw entryError;

      // Atualizar estados (com "as any" por segurança se os tipos do Supabase variarem)
      if (accData) setAccounts(accData as any);
      if (entryData) setEntries(entryData as any);
      
    } catch (err: any) {
      console.error("Erro no useAccounting:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Função para criar lançamentos manuais (opcional, mas útil ter já)
  const createEntry = async (description: string, date: string, items: any[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Criar Cabeçalho
    const { data: entry, error } = await supabase
      .from('journal_entries')
      .insert([{ user_id: user.id, description, date }])
      .select()
      .single();

    if (error) throw error;

    // 2. Criar Linhas
    const itemsToInsert = items.map((item: any) => ({
      entry_id: entry.id,
      account_id: item.account_id,
      debit: item.debit,
      credit: item.credit
    }));

    const { error: itemsError } = await supabase
      .from('journal_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
    
    await fetchData(); 
  };

  return { accounts, entries, loading, error, createEntry, refresh: fetchData };
}