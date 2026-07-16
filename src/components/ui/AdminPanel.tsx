import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Inbox, 
  MessageSquare, 
  FileSpreadsheet, 
  Trash2, 
  X, 
  Layers, 
  BarChart, 
  AlertTriangle 
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function AdminPanel() {
  const messages = useAppStore((state) => state.messages);
  const budgets = useAppStore((state) => state.budgets);
  const onClearMessages = useAppStore((state) => state.clearMessages);
  const onClearBudgets = useAppStore((state) => state.clearBudgets);

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'budgets' | 'epidemiology'>('budgets');

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-40 select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-secondary hover:bg-secondary-container text-white px-4 py-3 rounded-full shadow-2xl transition-all font-mono text-xs font-bold cursor-pointer border border-white/10"
          id="btn-admin-panel"
        >
          <Inbox className="w-4 h-4 animate-pulse" />
          Inbox Demo ({messages.length + budgets.length})
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" id="admin-drawer-container">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50"
            ></motion.div>

            {/* Sliding Panel */}
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, duration: 0.4 }}
                className="w-screen max-w-md md:max-w-xl bg-surface-container-lowest border-l border-outline-variant flex flex-col h-full shadow-2xl"
              >
                {/* Header */}
                <div className="bg-primary text-on-primary px-6 py-4 flex justify-between items-center relative">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-secondary"></div>
                  <div>
                    <h2 className="font-sans font-extrabold text-lg flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-secondary-fixed-dim" />
                      Painel de Gestão WSMF (Demo)
                    </h2>
                    <p className="font-sans text-[10px] text-primary-fixed-dim mt-0.5 uppercase tracking-widest">
                      Visualizador de Submissões de Formulários
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-full hover:bg-white/10 text-on-primary/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-outline-variant bg-surface-container-low px-4 py-1.5">
                  <button
                    onClick={() => setActiveTab('budgets')}
                    className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all font-semibold cursor-pointer ${
                      activeTab === 'budgets'
                        ? 'bg-secondary text-white'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    Propostas ({budgets.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all font-semibold cursor-pointer ${
                      activeTab === 'messages'
                        ? 'bg-secondary text-white'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Contatos ({messages.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('epidemiology')}
                    className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[10px] uppercase tracking-wider rounded-md transition-all font-semibold cursor-pointer ${
                      activeTab === 'epidemiology'
                        ? 'bg-secondary text-white'
                        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Índices
                  </button>
                </div>

                {/* Content body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {activeTab === 'budgets' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                          Solicitações de Orçamentos Recebidos
                        </span>
                        {budgets.length > 0 && (
                          <button
                            onClick={onClearBudgets}
                            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-error hover:underline"
                          >
                            <Trash2 className="w-3 h-3" /> Limpar
                          </button>
                        )}
                      </div>

                      {budgets.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-outline-variant rounded-2xl bg-surface p-6">
                          <FileSpreadsheet className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
                          <p className="font-sans text-sm font-bold text-primary">Nenhuma proposta solicitada ainda.</p>
                          <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                            Submeta o formulário clicando no botão "Solicitar Orçamento" para ver sua proposta aparecer em tempo real aqui!
                          </p>
                        </div>
                      ) : (
                        budgets.map((req) => (
                          <div
                            key={req.id}
                            className="bg-surface border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm hover:border-secondary transition-colors"
                          >
                            <div className="flex justify-between items-start border-b border-primary/5 pb-2">
                              <div>
                                <h3 className="font-sans font-bold text-primary">{req.nome}</h3>
                                <p className="font-sans text-xs text-on-surface-variant">{req.email} • {req.telefone}</p>
                              </div>
                              <span className="font-mono text-[9px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                                {req.data}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block font-mono text-[9px] uppercase tracking-wider text-secondary font-bold">
                                Município de Interesse:
                              </span>
                              <p className="font-sans text-xs text-primary font-bold">{req.municipio}</p>
                            </div>

                            {req.servicosInteresse.length > 0 && (
                              <div className="space-y-1">
                                <span className="block font-mono text-[9px] uppercase tracking-wider text-secondary font-bold">
                                  Serviços Selecionados:
                                </span>
                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                  {req.servicosInteresse.map((srv, idx) => (
                                    <span key={idx} className="bg-secondary/10 border border-secondary/20 text-secondary font-sans text-[10px] font-bold px-2 py-0.5 rounded">
                                      {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {req.mensagemAdicional && (
                              <div className="space-y-1 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                                <span className="block font-mono text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold">
                                  Observações:
                                </span>
                                <p className="font-sans text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed mt-0.5">
                                  {req.mensagemAdicional}
                                </p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                          Contatos e Mensagens Recebidas
                        </span>
                        {messages.length > 0 && (
                          <button
                            onClick={onClearMessages}
                            className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-error hover:underline"
                          >
                            <Trash2 className="w-3 h-3" /> Limpar
                          </button>
                        )}
                      </div>

                      {messages.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-outline-variant rounded-2xl bg-surface p-6">
                          <MessageSquare className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-3" />
                          <p className="font-sans text-sm font-bold text-primary">Nenhuma mensagem recebida ainda.</p>
                          <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
                            Preencha o formulário na página de Contatos para testar a gravação segura!
                          </p>
                        </div>
                      ) : (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className="bg-surface border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm hover:border-secondary transition-colors"
                          >
                            <div className="flex justify-between items-start border-b border-primary/5 pb-2">
                              <div>
                                <h3 className="font-sans font-bold text-primary">{msg.nome}</h3>
                                <p className="font-sans text-xs text-on-surface-variant">{msg.email}</p>
                              </div>
                              <span className="font-mono text-[9px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
                                {msg.data}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <span className="block font-mono text-[9px] uppercase tracking-wider text-secondary font-bold">
                                Assunto:
                              </span>
                              <p className="font-sans text-xs text-primary font-bold">{msg.assunto}</p>
                            </div>

                            <div className="space-y-1 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/30">
                              <span className="block font-mono text-[9px] uppercase tracking-wider text-on-surface-variant font-semibold">
                                Mensagem:
                              </span>
                              <p className="font-sans text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed mt-0.5">
                                {msg.mensagem}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'epidemiology' && (
                    <div className="space-y-6">
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                        Índices Epidemiológicos Demonstrativos
                      </span>

                      {/* Demo charts */}
                      <div className="bg-surface border border-outline-variant rounded-xl p-5 space-y-4 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-primary/5 pb-2">
                          <BarChart className="w-4 h-4 text-secondary" />
                          <h4 className="font-sans font-bold text-primary text-sm">Índice de Infestação Predial (IIP)</h4>
                        </div>
                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>Meta do Ministério da Saúde</span>
                              <span className="font-bold text-green-600">&lt; 1,0%</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="w-[20%] h-full bg-green-500 rounded-full"></div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>Antes da WSMF Consultoria</span>
                              <span className="font-bold text-error">4,2% (Alto Risco)</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="w-[84%] h-full bg-error rounded-full"></div>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between font-mono text-[10px]">
                              <span>Após 6 meses de Ovitrampas WSMF</span>
                              <span className="font-bold text-secondary">0,8% (Baixo Risco)</span>
                            </div>
                            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                              <div className="w-[16%] h-full bg-secondary rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Warning advisory notice */}
                      <div className="bg-amber-100/75 border border-amber-200 text-amber-900 rounded-xl p-4 flex gap-3 text-xs">
                        <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0" />
                        <div className="leading-relaxed font-sans">
                          <strong>Vigilância Epidemiológica Preventiva:</strong> O controle estratégico em bases territoriais reduz consideravelmente a proliferação viral, economizando até 70% dos cofres do município em atendimento médico de emergência.
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer of drawer */}
                <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
                  <span>Modo Sandbox Protótipo</span>
                  <span>Zustand + LocalStorage</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
