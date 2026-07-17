import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ClipboardList } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const openBudgetModal = useModalStore((state) => state.openBudgetModal);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/servicos', label: 'Serviços' },
    { path: '/tecnologia', label: 'Tecnologia' },
    { path: '/contato', label: 'Contato' },
    { path: '/acoes-equipe', label: 'Workshops e Treinamentos' },
    { path: '/feedback', label: 'Avaliações' },
    { path: '/sobre', label: 'Sobre Nós' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-surface dark:bg-primary-container w-full top-0 sticky z-50 border-b border-primary/10 dark:border-primary-fixed shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div 
          className="font-sans text-2xl md:text-3xl font-extrabold text-primary dark:text-inverse-primary tracking-tighter cursor-pointer select-none hover:opacity-90 transition-opacity"
          onClick={() => handleNavClick('/')}
          id="header-logo"
        >
          WSMF Consultoria
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-1 items-center" id="desktop-nav">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                id={`nav-item-${item.path.replace('/', '') || 'home'}`}
                onClick={() => handleNavClick(item.path)}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-md transition-all duration-200 ${
                  isActive
                    ? 'text-secondary dark:text-inverse-primary font-bold border-b-2 border-secondary dark:border-inverse-primary rounded-b-none'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white hover:bg-surface-container-low dark:hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Call to Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={openBudgetModal}
            id="btn-solicitar-orcamento-desktop"
            className="flex items-center gap-2 bg-primary dark:bg-secondary text-white hover:bg-secondary dark:hover:bg-secondary-container transition-all duration-200 px-5 py-2.5 rounded text-xs font-mono uppercase tracking-wider font-medium shadow-sm hover:shadow-md cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            Solicitar Orçamento
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="btn-mobile-menu"
          className="md:hidden p-2 text-primary dark:text-inverse-primary focus:outline-none"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Drawer */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-[85%] max-w-sm bg-surface dark:bg-primary-container shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        id="mobile-nav"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 dark:border-white/10 shrink-0">
          <div className="font-sans text-xl font-extrabold text-primary dark:text-inverse-primary tracking-tighter">
            WSMF
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-primary dark:text-inverse-primary focus:outline-none rounded-full hover:bg-primary/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left font-mono text-sm uppercase tracking-wider py-4 px-4 rounded-xl transition-all ${
                  isActive
                    ? 'text-white bg-secondary dark:bg-secondary-container font-bold shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-surface-container-low dark:hover:bg-white/10 hover:text-primary dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-6 border-t border-primary/10 dark:border-white/10 shrink-0 bg-surface-container-low/30 dark:bg-primary-container/80">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openBudgetModal();
            }}
            className="flex items-center justify-center gap-2 w-full bg-primary dark:bg-secondary text-white hover:bg-secondary transition-colors py-4 rounded-xl text-sm font-mono uppercase tracking-wider font-bold shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <ClipboardList className="w-5 h-5" />
            Solicitar Orçamento
          </button>
        </div>
      </div>
    </header>
  );
}
