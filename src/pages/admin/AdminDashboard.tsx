import React from 'react';
import { Database, Image as ImageIcon, FileText, Settings } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Páginas Ativas', value: '5', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Arquivos de Mídia', value: '12', icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Tamanho BD', value: '1.2 MB', icon: Database, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-primary">Dashboard</h1>
        <p className="text-on-surface-variant text-sm">Bem-vindo ao painel de controle da WSMF Consultoria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-outline-variant rounded-xl p-6 flex items-center gap-4 shadow-sm hover:shadow transition-shadow">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-extrabold text-primary mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm p-6 space-y-6 mt-8">
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <Settings className="w-5 h-5 text-secondary" />
          Ações Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 border border-outline-variant rounded-lg text-left hover:border-secondary hover:bg-secondary/5 transition-all group cursor-pointer">
            <h3 className="font-bold text-primary group-hover:text-secondary">Editar Página Home</h3>
            <p className="text-xs text-on-surface-variant mt-1">Alterar textos principais da página inicial.</p>
          </button>
          <button className="p-4 border border-outline-variant rounded-lg text-left hover:border-secondary hover:bg-secondary/5 transition-all group cursor-pointer">
            <h3 className="font-bold text-primary group-hover:text-secondary">Adicionar Banner</h3>
            <p className="text-xs text-on-surface-variant mt-1">Fazer upload de nova imagem de destaque.</p>
          </button>
          <button className="p-4 border border-outline-variant rounded-lg text-left hover:border-secondary hover:bg-secondary/5 transition-all group cursor-pointer">
            <h3 className="font-bold text-primary group-hover:text-secondary">Novo Depoimento</h3>
            <p className="text-xs text-on-surface-variant mt-1">Cadastrar feedback de um novo cliente.</p>
          </button>
          <button className="p-4 border border-outline-variant rounded-lg text-left hover:border-secondary hover:bg-secondary/5 transition-all group cursor-pointer">
            <h3 className="font-bold text-primary group-hover:text-secondary">Configurações Gerais</h3>
            <p className="text-xs text-on-surface-variant mt-1">Ajustar e-mail e telefone de contato.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
