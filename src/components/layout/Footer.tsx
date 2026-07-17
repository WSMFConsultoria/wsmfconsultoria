import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';
import { supabase } from '../../lib/supabase';

export default function Footer() {
  const navigate = useNavigate();
  const openBudgetModal = useModalStore((state) => state.openBudgetModal);

  const [contactInfo, setContactInfo] = useState<any>({
    email: 'wsmfconsultoria@gmail.com',
    phone: '75 99903-4004',
    address: 'Santo Estevão - BA, Bairro Alagoinhas, nº 140 - CEP 44190-000',
    instagram: '@wsmfgestaoemsaude',
    coords: 'Santo Estevão - BA'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('content')
          .eq('section_name', 'contact_info')
          .single();
          
        if (error) throw error;
        if (data && data.content) {
          setContactInfo(data.content);
        }
      } catch (error) {
        console.error('Error fetching contact info for footer:', error);
      }
    };
    
    fetchContactInfo();
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary dark:bg-primary-container text-slate-300 w-full border-t border-white/10">
      {/* Top half: Quick Contacts & Links */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4">
          <div className="font-sans text-xl font-bold tracking-tight text-white">
            WSMF Consultoria
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Gestão inteligente em saúde pública, vigilância epidemiológica e controle estratégico de endemias municipais.
          </p>
        </div>

        {/* Quick navigation */}
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-blue-400 dark:text-inverse-primary font-bold mb-4">
            Institucional
          </span>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                onClick={() => handleNavClick('/')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/servicos')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Nossos Serviços
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/tecnologia')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Tecnologia SisEndemias
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/contato')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Contato
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/acoes-equipe')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Workshops e Treinamentos
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/feedback')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Avaliações
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('/sobre')}
                className="text-slate-300 hover:text-white hover:underline transition-all cursor-pointer text-left"
              >
                Sobre Nós
              </button>
            </li>
          </ul>
        </div>

        {/* Support & Links */}
        <div>
          <span className="block font-mono text-xs uppercase tracking-widest text-blue-400 dark:text-inverse-primary font-bold mb-4">
            Contatos Rápidos
          </span>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-blue-400 dark:text-inverse-primary shrink-0" />
              <span className="truncate text-slate-300">{contactInfo.email}</span>
            </li>
            <li className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-blue-400 dark:text-inverse-primary shrink-0" />
              <span className="text-slate-300">{contactInfo.phone}</span>
            </li>
            <li className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-blue-400 dark:text-inverse-primary shrink-0 mt-0.5" />
              <span className="text-slate-300 whitespace-pre-line">{contactInfo.address}</span>
            </li>
          </ul>
        </div>

        {/* Call to action & social */}
        <div className="space-y-4">
          <span className="block font-mono text-xs uppercase tracking-widest text-blue-400 dark:text-inverse-primary font-bold mb-2">
            Fale com Especialista
          </span>
          <button
            onClick={openBudgetModal}
            className="w-full bg-secondary hover:bg-secondary-container text-white py-3 px-4 rounded text-xs font-mono uppercase tracking-wider font-semibold transition-all shadow cursor-pointer text-center"
          >
            Solicitar Proposta
          </button>
          <div className="flex items-center gap-3 pt-2">
            <a
              href={`https://instagram.com/${contactInfo.instagram?.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all"
              title="Siga no Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom half: Copyright */}
      <div className="border-t border-white/10 bg-black/30 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans">
          <div>
            © 2026 WSMF Gestão em Saúde Consultoria Ltda. Todos os direitos reservados.
          </div>
          <div className="flex gap-6">
            <button onClick={() => handleNavClick('/contato')} className="hover:text-white text-slate-400 transition-colors cursor-pointer">
              Privacidade
            </button>
            <button onClick={() => handleNavClick('/contato')} className="hover:text-white text-slate-400 transition-colors cursor-pointer">
              Termos de Uso
            </button>
            <button onClick={() => handleNavClick('/contato')} className="hover:text-white text-slate-400 transition-colors cursor-pointer">
              FAQ / Ajuda
            </button>
            <button onClick={() => handleNavClick('/admin')} className="hover:text-white text-secondary transition-colors cursor-pointer font-bold ml-4">
              Painel Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
