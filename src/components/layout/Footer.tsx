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
    instagram_url: 'https://instagram.com/wsmfgestaoemsaude',
    whatsapp_url: 'https://wa.me/5575999034004',
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

  const formatInstagramUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanHandle = url.replace('@', '').trim();
    return `https://instagram.com/${cleanHandle}`;
  };

  const formatWhatsappUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const cleanNumber = url.replace(/\D/g, ''); // keep only numbers
    return `https://wa.me/${cleanNumber}`;
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
            {contactInfo.instagram_url && (
              <a
                href={formatInstagramUrl(contactInfo.instagram_url)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                title="Siga no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      {contactInfo.whatsapp_url && (
        <a
          href={formatWhatsappUrl(contactInfo.whatsapp_url)}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[90] bg-[#25D366] text-white p-3.5 md:p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center group"
          title="Fale conosco no WhatsApp"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      )}

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
