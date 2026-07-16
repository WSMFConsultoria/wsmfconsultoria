import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2, ClipboardList, Building } from 'lucide-react';
import { BudgetRequest } from '../../types';
import { useModalStore } from '../../store/useModalStore';
import { useAppStore } from '../../store/useAppStore';

export default function BudgetModal() {
  const isOpen = useModalStore((state) => state.isBudgetModalOpen);
  const onClose = useModalStore((state) => state.closeBudgetModal);
  const onAddBudget = useAppStore((state) => state.addBudget);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [telefone, setTelefone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [success, setSuccess] = useState(false);

  const availableServices = [
    "Estratificação de Risco",
    "Reconhecimento Geográfico (RG)",
    "Monitoramento com Ovitrampas",
    "Capacitação e Treinamento (ACE)"
  ];

  const handleCheckboxChange = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !municipio || !telefone) return;

    const newRequest: BudgetRequest = {
      id: Date.now().toString(),
      nome,
      email,
      municipio,
      telefone,
      servicosInteresse: selectedServices,
      mensagemAdicional: mensagem,
      data: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    onAddBudget(newRequest);
    setSuccess(true);

    // Reset after a short delay and close
    setTimeout(() => {
      setSuccess(false);
      setNome('');
      setEmail('');
      setMunicipio('');
      setTelefone('');
      setSelectedServices([]);
      setMensagem('');
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" id="budget-modal-container">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/80 backdrop-blur-sm"
          ></motion.div>

          {/* Modal Content container */}
          <div className="flex min-h-full items-center justify-center p-4 md:p-6 relative z-10">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-full max-w-2xl bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl relative overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 left-0 w-full h-[4px] bg-secondary"></div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {!success ? (
                    <motion.div
                      key="form-step"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      {/* Title block */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-secondary">
                          <ClipboardList className="w-5 h-5" />
                          <span className="font-mono text-xs uppercase tracking-widest font-bold">Solicitar Orçamento</span>
                        </div>
                        <h2 className="font-sans text-xl md:text-2xl font-extrabold text-primary">
                          Proposta para seu Município
                        </h2>
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                          Preencha as informações abaixo para que nossa equipe técnica analise os índices e estruture a proposta ideal de assessoria.
                        </p>
                      </div>

                      {/* Main Form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                              Seu Nome Completo
                            </label>
                            <input
                              type="text"
                              value={nome}
                              onChange={(e) => setNome(e.target.value)}
                              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                              placeholder="Nome completo"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                              E-mail Corporativo
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                              placeholder="seu@municipio.gov.br"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                              Município / UF
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={municipio}
                                onChange={(e) => setMunicipio(e.target.value)}
                                className="w-full bg-surface-container-low border border-outline-variant rounded pl-10 pr-3 py-2.5 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                                placeholder="Cidade - Estado"
                                required
                              />
                              <Building className="w-4 h-4 text-on-surface-variant/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                              Telefone de Contato
                            </label>
                            <input
                              type="tel"
                              value={telefone}
                              onChange={(e) => setTelefone(e.target.value)}
                              className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                              placeholder="(00) 00000-0000"
                              required
                            />
                          </div>
                        </div>

                        {/* Services List checkboxes */}
                        <div className="space-y-2">
                          <span className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                            Serviços de Interesse
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {availableServices.map((service, idx) => {
                              const isChecked = selectedServices.includes(service);
                              return (
                                <label
                                  key={idx}
                                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer select-none transition-all ${
                                    isChecked
                                      ? 'border-secondary bg-surface-container text-primary font-bold'
                                      : 'border-outline-variant bg-surface-container-low hover:bg-surface-container/50 text-on-surface-variant'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleCheckboxChange(service)}
                                    className="accent-secondary w-4 h-4 rounded cursor-pointer"
                                  />
                                  <span className="text-xs font-sans leading-none">{service}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Additional notes */}
                        <div className="space-y-1.5">
                          <label className="block font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold">
                            Observações ou Necessidades Adicionais
                          </label>
                          <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="w-full bg-surface-container-low border border-outline-variant rounded px-3 py-2.5 font-sans text-xs text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
                            placeholder="Descreva detalhes como quantitativo populacional, equipe de campo, etc."
                            rows={3}
                          ></textarea>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-primary/5">
                          <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary rounded text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-primary hover:bg-secondary text-on-primary py-2.5 px-6 rounded font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow hover:shadow-md"
                          >
                            <span>Enviar Solicitação</span>
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success-step"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 shadow-inner">
                        <CheckCircle2 className="w-10 h-10 animate-bounce" />
                      </div>
                      <h2 className="font-sans text-2xl font-extrabold text-primary">
                        Solicitação Enviada!
                      </h2>
                      <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed">
                        Recebemos seus dados com sucesso. Nossa equipe técnica de consultoria e engenharia de saúde analisará o perfil do seu município e entrará em contato em breve.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
