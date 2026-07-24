import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, Users,
  LogOut, Loader2, Mail, ClipboardList, Menu, X, ChevronRight, Bell,
  ExternalLink
} from 'lucide-react';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/pages', label: 'Páginas & Conteúdo', icon: FileText },
  { path: '/admin/media', label: 'Biblioteca de Mídia', icon: ImageIcon },
  { path: '/admin/testimonials', label: 'Depoimentos', icon: MessageSquare },
  { path: '/admin/team-actions', label: 'Workshops', icon: Users },
  { path: '/admin/contacts', label: 'Mensagens', icon: Mail },
  { path: '/admin/budgets', label: 'Orçamentos', icon: ClipboardList },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      } else {
        setUserEmail(session.user?.email || 'admin');
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Fetch notification count (new contacts + pending budgets)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [contactsRes, budgetsRes] = await Promise.all([
          supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
          supabase.from('budget_requests').select('id', { count: 'exact', head: true }).or('status.is.null,status.eq.Pendente'),
        ]);
        const total = (contactsRes.count || 0) + (budgetsRes.count || 0);
        setNotificationCount(total);
      } catch { /* silent */ }
    };
    fetchNotifications();
  }, [location.pathname]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          <p className="text-sm text-on-surface-variant font-mono uppercase tracking-widest">Carregando painel...</p>
        </div>
      </div>
    );
  }

  // Get current page label for breadcrumb
  const currentPage = menuItems.find(item =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path) && item.path !== '/admin'
  ) || menuItems[0];

  const isActive = (item: typeof menuItems[0]) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path) && item.path !== '/admin';
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold uppercase tracking-wider text-white">
              WSMF <span className="text-secondary">Admin</span>
            </h1>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Painel de Controle</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-white text-xs font-bold uppercase">
            {userEmail.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userEmail}</p>
            <p className="text-[10px] text-white/40 font-mono">Administrador</p>
          </div>
          {notificationCount > 0 && (
            <div className="relative">
              <Bell className="w-4 h-4 text-white/50" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-[8px] text-white font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-white/30 font-bold">Menu Principal</p>
        {menuItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white/50 hover:bg-white/8 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Ver Site Público
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sair
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-container-lowest flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-primary text-on-primary flex-col shadow-2xl z-20 hidden md:flex fixed inset-y-0 left-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="absolute inset-y-0 left-0 w-72 bg-primary text-on-primary flex flex-col shadow-2xl"
            style={{ animation: 'slideInLeft 0.3s ease-out' }}
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64">
        {/* Topbar */}
        <header className="bg-white border-b border-outline-variant px-4 md:px-8 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-container text-primary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-on-surface-variant font-medium hidden sm:inline">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-outline-variant hidden sm:inline" />
              <span className="font-bold text-primary flex items-center gap-1.5">
                {React.createElement(currentPage.icon, { className: 'w-4 h-4 text-secondary' })}
                {currentPage.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell - mobile */}
            {notificationCount > 0 && (
              <button
                onClick={() => navigate('/admin/contacts')}
                className="relative p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[9px] text-white font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              </button>
            )}

            {/* User avatar - mobile */}
            <div className="md:hidden w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold uppercase">
              {userEmail.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-surface-container-lowest">
          <Outlet />
        </div>
      </main>

      {/* CSS Animation for mobile drawer */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
