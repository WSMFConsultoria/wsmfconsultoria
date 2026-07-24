import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  FileText, Image as ImageIcon, MessageSquare, Users, Mail, ClipboardList,
  TrendingUp, Loader2, ArrowRight, Clock, Eye, ChevronRight
} from 'lucide-react';

interface DashboardStats {
  pages: number;
  media: number;
  testimonials: number;
  teamActions: number;
  contacts: number;
  budgets: number;
  pendingBudgets: number;
}

interface RecentItem {
  type: 'contact' | 'budget' | 'testimonial';
  title: string;
  subtitle: string;
  date: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pagesRes, mediaRes, testimonialsRes, actionsRes, contactsRes, budgetsRes, pendingRes] = await Promise.all([
        supabase.from('pages').select('id', { count: 'exact', head: true }),
        supabase.from('media').select('id', { count: 'exact', head: true }),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }),
        supabase.from('team_actions').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('budget_requests').select('id', { count: 'exact', head: true }),
        supabase.from('budget_requests').select('id', { count: 'exact', head: true }).or('status.is.null,status.eq.Pendente'),
      ]);

      setStats({
        pages: pagesRes.count || 0,
        media: mediaRes.count || 0,
        testimonials: testimonialsRes.count || 0,
        teamActions: actionsRes.count || 0,
        contacts: contactsRes.count || 0,
        budgets: budgetsRes.count || 0,
        pendingBudgets: pendingRes.count || 0,
      });

      // Fetch recent items
      const recent: RecentItem[] = [];

      const { data: recentContacts } = await supabase
        .from('contact_messages')
        .select('nome, email, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentContacts) {
        recentContacts.forEach(c => {
          recent.push({
            type: 'contact',
            title: c.nome,
            subtitle: c.email,
            date: c.created_at,
            icon: Mail,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          });
        });
      }

      const { data: recentBudgets } = await supabase
        .from('budget_requests')
        .select('nome, municipio, created_at')
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentBudgets) {
        recentBudgets.forEach(b => {
          recent.push({
            type: 'budget',
            title: b.municipio,
            subtitle: b.nome,
            date: b.created_at,
            icon: ClipboardList,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          });
        });
      }

      // Sort by date desc
      recent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setRecentItems(recent.slice(0, 6));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-secondary" />
      </div>
    );
  }

  const statCards = [
    { label: 'Páginas', value: stats?.pages || 0, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', path: '/admin/pages' },
    { label: 'Mídias', value: stats?.media || 0, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', path: '/admin/media' },
    { label: 'Depoimentos', value: stats?.testimonials || 0, icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', path: '/admin/testimonials' },
    { label: 'Workshops', value: stats?.teamActions || 0, icon: Users, color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-100', path: '/admin/team-actions' },
    { label: 'Mensagens', value: stats?.contacts || 0, icon: Mail, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', path: '/admin/contacts' },
    { label: 'Orçamentos', value: stats?.budgets || 0, icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', path: '/admin/budgets', badge: stats?.pendingBudgets },
  ];

  const quickActions = [
    { label: 'Editar Páginas', desc: 'Gerenciar textos e seções do site', icon: FileText, path: '/admin/pages', color: 'text-blue-600' },
    { label: 'Upload de Mídia', desc: 'Fazer upload de imagens e arquivos', icon: ImageIcon, path: '/admin/media', color: 'text-purple-600' },
    { label: 'Ver Orçamentos', desc: 'Avaliar solicitações pendentes', icon: ClipboardList, path: '/admin/budgets', color: 'text-amber-600' },
    { label: 'Novo Workshop', desc: 'Publicar treinamento ou evento', icon: Users, path: '/admin/team-actions', color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-secondary" />
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant">Visão geral do painel de controle WSMF Consultoria.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors bg-secondary/5 hover:bg-secondary/10 px-4 py-2 rounded-lg"
        >
          <Eye className="w-3.5 h-3.5" />
          Visualizar Site
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <button
              key={idx}
              onClick={() => navigate(stat.path)}
              className={`bg-white border ${stat.border} rounded-xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group text-left relative overflow-hidden`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant font-bold mt-0.5">{stat.label}</p>
              </div>
              {stat.badge !== undefined && stat.badge > 0 && (
                <span className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {stat.badge} pendente{stat.badge > 1 ? 's' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-secondary" />
              Ações Rápidas
            </h2>
          </div>
          <div className="p-3 space-y-1">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container transition-all group cursor-pointer text-left"
                >
                  <div className={`w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center ${action.color} group-hover:bg-secondary group-hover:text-white transition-colors shrink-0`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">{action.label}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline-variant group-hover:text-secondary transition-colors shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant flex justify-between items-center">
            <h2 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-secondary" />
              Atividade Recente
            </h2>
            <span className="text-[10px] font-mono text-on-surface-variant">{recentItems.length} itens</span>
          </div>
          <div className="divide-y divide-outline-variant/50">
            {recentItems.length > 0 ? recentItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="px-5 py-3.5 flex items-center gap-4 hover:bg-surface/50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg} ${item.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-primary truncate">{item.title}</p>
                    <p className="text-xs text-on-surface-variant truncate">{item.subtitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant bg-surface-container px-2 py-1 rounded shrink-0">
                    {formatDate(item.date)}
                  </span>
                </div>
              );
            }) : (
              <div className="p-8 text-center">
                <Clock className="w-10 h-10 text-outline-variant mx-auto mb-3" />
                <p className="text-sm font-bold text-primary">Nenhuma atividade recente</p>
                <p className="text-xs text-on-surface-variant mt-1">Os registros aparecerão aqui automaticamente.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
