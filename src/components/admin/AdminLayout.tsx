import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, Users, LogOut, Loader2, Mail, ClipboardList } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/pages', label: 'Páginas & Textos', icon: FileText },
    { path: '/admin/media', label: 'Mídia & Banners', icon: ImageIcon },
    { path: '/admin/testimonials', label: 'Depoimentos', icon: MessageSquare },
    { path: '/admin/team-actions', label: 'Workshops e Treinamentos', icon: Users },
    { path: '/admin/contacts', label: 'Mensagens', icon: Mail },
    { path: '/admin/budgets', label: 'Orçamentos', icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-on-primary flex flex-col shadow-xl z-10 hidden md:flex">
        <div className="p-6 border-b border-inverse-primary/10">
          <h1 className="text-xl font-extrabold uppercase tracking-widest text-white">
            WSMF <span className="text-secondary">Admin</span>
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-secondary text-white shadow-md'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-inverse-primary/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Voltar para o site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar for mobile */}
        <header className="md:hidden bg-primary p-4 flex justify-between items-center text-white shadow-md z-10">
          <h1 className="text-lg font-bold">WSMF Admin</h1>
          <button onClick={handleLogout} className="text-red-400"><LogOut className="w-5 h-5"/></button>
        </header>
        
        <div className="flex-1 overflow-auto p-6 md:p-8 bg-surface-container-lowest">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
