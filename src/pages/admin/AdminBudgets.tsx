import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ClipboardList, Search, Loader2, Calendar, Building, Phone, Mail } from 'lucide-react';

interface BudgetRequest {
  id: string;
  nome: string;
  email: string;
  municipio: string;
  telefone: string;
  servicos_interesse: string[];
  mensagem_adicional: string;
  created_at: string;
}

export default function AdminBudgets() {
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budget_requests')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setBudgets(data);
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredBudgets = budgets.filter(budget => 
    budget.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    budget.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-secondary" />
            Solicitações de Orçamento
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gerencie as solicitações de propostas e orçamentos dos municípios.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-outline-variant bg-surface">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Buscar por nome, município ou e-mail..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-background focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-surface-container">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : filteredBudgets.length > 0 ? (
            <div className="grid gap-4">
              {filteredBudgets.map((budget) => (
                <div key={budget.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                  <div className="flex justify-between items-start mb-4 gap-4 pl-2">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{budget.municipio}</h3>
                      <p className="text-sm font-medium text-on-surface mt-0.5">{budget.nome}</p>
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1 shrink-0 font-mono bg-surface-container px-2 py-1 rounded">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(budget.created_at)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pl-2">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Phone className="w-4 h-4 text-secondary" />
                      <span className="font-mono">{budget.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Mail className="w-4 h-4 text-secondary" />
                      <a href={`mailto:${budget.email}`} className="hover:underline hover:text-secondary transition-colors">
                        {budget.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-outline-variant pl-2">
                    <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold mb-2">Serviços de Interesse:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {budget.servicos_interesse && budget.servicos_interesse.length > 0 ? (
                        budget.servicos_interesse.map((servico, idx) => (
                          <span key={idx} className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                            {servico}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-on-surface-variant italic">Não especificado</span>
                      )}
                    </div>

                    {budget.mensagem_adicional && (
                      <div className="mt-3">
                        <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold mb-1">Mensagem / Observações:</p>
                        <p className="text-sm text-on-surface-variant whitespace-pre-wrap bg-surface-container-low p-3 rounded-lg border border-outline-variant">
                          {budget.mensagem_adicional}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <ClipboardList className="w-12 h-12 text-outline-variant" />
              <div>
                <p className="font-bold text-primary">Nenhum orçamento encontrado</p>
                <p className="text-sm text-on-surface-variant">As solicitações recebidas aparecerão aqui.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
