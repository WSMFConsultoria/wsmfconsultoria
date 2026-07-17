import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ClipboardList, Search, Loader2, Calendar, Phone, Mail, FileText, CheckCircle, Clock, XCircle, FileDown, Save, X, Trash2 } from 'lucide-react';

interface BudgetRequest {
  id: string;
  nome: string;
  email: string;
  municipio: string;
  telefone: string;
  servicos_interesse: string[];
  mensagem_adicional: string;
  created_at: string;
  consultant_notes?: string;
  status?: string;
}

export default function AdminBudgets() {
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState<BudgetRequest | null>(null);
  
  // Evaluation State
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('Pendente');
  const [saving, setSaving] = useState(false);

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

  const handleDeleteBudget = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a solicitação de ${name}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('budget_requests')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (err: any) {
      console.error('Error deleting budget:', err);
      alert('Erro ao excluir solicitação: ' + err.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleOpenEvaluation = (budget: BudgetRequest) => {
    setSelectedBudget(budget);
    setNotes(budget.consultant_notes || '');
    setStatus(budget.status || 'Pendente');
  };

  const handleSaveEvaluation = async () => {
    if (!selectedBudget) return;
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('budget_requests')
        .update({ 
          consultant_notes: notes,
          status: status
        })
        .eq('id', selectedBudget.id);
        
      if (error) throw error;
      
      // Update local state
      setBudgets(budgets.map(b => 
        b.id === selectedBudget.id ? { ...b, consultant_notes: notes, status } : b
      ));
      
      setSelectedBudget({ ...selectedBudget, consultant_notes: notes, status });
      alert('Avaliação salva com sucesso!');
    } catch (err: any) {
      console.error('Error saving evaluation:', err);
      alert('Erro ao salvar avaliação: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusIcon = (statusName: string) => {
    switch (statusName) {
      case 'Aprovado': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Rejeitado': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Em Análise': return <Loader2 className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  const getStatusStyle = (statusName: string) => {
    switch (statusName) {
      case 'Aprovado': return 'bg-green-50 text-green-700 border-green-200';
      case 'Rejeitado': return 'bg-red-50 text-red-700 border-red-200';
      case 'Em Análise': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
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
                <div key={budget.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    budget.status === 'Aprovado' ? 'bg-green-500' :
                    budget.status === 'Rejeitado' ? 'bg-red-500' :
                    budget.status === 'Em Análise' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`}></div>
                  
                  <div className="flex justify-between items-start mb-4 gap-4 pl-3">
                    <div>
                      <h3 className="font-bold text-primary text-lg">{budget.municipio}</h3>
                      <p className="text-sm font-medium text-on-surface mt-0.5">{budget.nome}</p>
                      
                      <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(budget.status || 'Pendente')}`}>
                        {getStatusIcon(budget.status || 'Pendente')}
                        {budget.status || 'Pendente'}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="text-xs text-on-surface-variant flex items-center gap-1 font-mono bg-surface-container px-2 py-1 rounded">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(budget.created_at)}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDeleteBudget(budget.id, budget.nome)}
                          className="bg-surface hover:bg-red-50 text-red-500 border border-outline-variant hover:border-red-200 p-1.5 rounded transition-colors shadow-sm flex items-center justify-center"
                          title="Excluir solicitação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenEvaluation(budget)}
                          className="bg-primary hover:bg-secondary text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Avaliar
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 mt-4 border-t border-outline-variant pt-4">
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Phone className="w-4 h-4 text-secondary shrink-0" />
                      <span className="font-mono">{budget.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <Mail className="w-4 h-4 text-secondary shrink-0" />
                      <span className="truncate">{budget.email}</span>
                    </div>
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

      {/* Modal de Avaliação / PDF */}
      {selectedBudget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-outline-variant bg-surface-container-low rounded-t-xl shrink-0 no-print">
              <div>
                <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" />
                  Avaliação da Proposta
                </h2>
              </div>
              <button 
                onClick={() => setSelectedBudget(null)}
                className="text-on-surface-variant hover:text-red-500 transition-colors p-1 bg-white rounded-full border border-outline-variant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 bg-white">
              {/* === PRINT SECTION === */}
              <div className="print-section p-8 md:p-12 max-w-3xl mx-auto font-sans">
                {/* Header PDF */}
                <div className="flex justify-between items-start border-b-2 border-primary pb-6 mb-8">
                  <div>
                    <h1 className="text-2xl font-extrabold text-primary tracking-tight">WSMF CONSULTORIA</h1>
                    <p className="text-sm font-bold tracking-widest text-secondary uppercase mt-1">Gestão em Saúde & Endemias</p>
                  </div>
                  <div className="text-right text-xs text-on-surface-variant space-y-1 font-mono">
                    <p>Documento de Solicitação</p>
                    <p>ID: {selectedBudget.id.split('-')[0].toUpperCase()}</p>
                    <p>Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-primary mb-6 text-center uppercase tracking-wider bg-surface-container-lowest border border-outline-variant p-3 rounded">
                  Ficha de Solicitação de Orçamento
                </h2>
                
                <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Município</p>
                    <p className="font-bold text-lg text-primary">{selectedBudget.municipio}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Data da Solicitação</p>
                    <p className="font-medium text-on-surface">{formatDate(selectedBudget.created_at)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Solicitante</p>
                    <p className="font-medium text-on-surface">{selectedBudget.nome}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">Telefone / WhatsApp</p>
                    <p className="font-mono text-on-surface">{selectedBudget.telefone}</p>
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-1">E-mail</p>
                    <p className="font-mono text-on-surface">{selectedBudget.email}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-xs font-bold uppercase text-on-surface-variant mb-3 border-b border-outline-variant pb-2">Serviços de Interesse</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm font-medium text-primary">
                    {selectedBudget.servicos_interesse?.map((servico, i) => (
                      <li key={i}>{servico}</li>
                    ))}
                  </ul>
                  {(!selectedBudget.servicos_interesse || selectedBudget.servicos_interesse.length === 0) && (
                    <p className="text-sm italic text-on-surface-variant">Nenhum serviço específico assinalado.</p>
                  )}
                </div>

                {selectedBudget.mensagem_adicional && (
                  <div className="mb-8">
                    <p className="text-xs font-bold uppercase text-on-surface-variant mb-3 border-b border-outline-variant pb-2">Mensagem do Solicitante</p>
                    <p className="text-sm text-on-surface whitespace-pre-wrap italic bg-surface p-4 rounded-lg border border-outline-variant/50">
                      "{selectedBudget.mensagem_adicional}"
                    </p>
                  </div>
                )}
                
                {/* PDF Status Display (Only visible on print or evaluation) */}
                <div className="mb-8 p-5 rounded-lg border-2 border-primary/10 bg-surface-container-low">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm font-bold uppercase text-primary">Avaliação Interna (Consultor)</p>
                    <div className="text-xs font-bold uppercase px-3 py-1 rounded bg-white border border-outline-variant">
                      Status: {status}
                    </div>
                  </div>
                  
                  {/* Textarea is replaced by div in print view for better rendering */}
                  <div className="no-print">
                    <label className="block text-xs font-bold text-on-surface-variant mb-1">Anotações / Considerações</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 border border-outline-variant rounded-md text-sm min-h-[120px] focus:ring-1 focus:ring-secondary focus:outline-none"
                      placeholder="Adicione notas sobre essa solicitação para a proposta final..."
                    />
                  </div>
                  
                  {/* This block is only visible when printing */}
                  <div className="hidden print-section:block mt-2">
                    <p className="text-xs font-bold text-on-surface-variant mb-1">Anotações / Considerações:</p>
                    <p className="text-sm text-on-surface whitespace-pre-wrap min-h-[100px] border border-outline-variant p-3 rounded">
                      {notes || 'Nenhuma anotação registrada.'}
                    </p>
                  </div>
                </div>

                {/* Print Footer */}
                <div className="hidden print-section:block mt-16 pt-8 border-t border-outline-variant text-center space-y-4">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">WSMF Consultoria em Saúde - CNPJ: 00.000.000/0000-00</p>
                  <p className="text-xs text-on-surface-variant">wsmfconsultoria.com.br</p>
                </div>
              </div>
              {/* === END PRINT SECTION === */}
            </div>

            <div className="p-4 md:p-6 border-t border-outline-variant bg-surface-container-low flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-xl shrink-0 no-print">
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <label className="text-sm font-bold text-on-surface-variant shrink-0">Status:</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full md:w-auto px-3 py-2 border border-outline-variant rounded-lg text-sm font-bold bg-white focus:outline-none focus:border-secondary"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Aprovado">Aprovado</option>
                  <option value="Rejeitado">Rejeitado</option>
                </select>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={handlePrint}
                  className="flex-1 md:flex-none border border-secondary text-secondary hover:bg-secondary/10 px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <FileDown className="w-4 h-4" />
                  Exportar PDF
                </button>
                <button
                  onClick={handleSaveEvaluation}
                  disabled={saving}
                  className="flex-1 md:flex-none bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow disabled:opacity-70"
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Salvar Avaliação</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
