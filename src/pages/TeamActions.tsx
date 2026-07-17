import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, Loader2, Image as ImageIcon } from 'lucide-react';
import type { TeamAction } from '../types';

export default function TeamActions() {
  const [actions, setActions] = useState<TeamAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const { data, error } = await supabase
        .from('team_actions')
        .select('*')
        .order('action_date', { ascending: false });
        
      if (error) throw error;
      if (data) setActions(data);
    } catch (err: any) {
      console.error('Error fetching team actions:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/10 text-secondary mb-2">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            Workshops e Treinamentos
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
            Acompanhe o trabalho em campo, capacitações e as atividades diárias da equipe WSMF junto aos municípios parceiros.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          </div>
        ) : actions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm hover:shadow-md transition-all group flex flex-col"
              >
                {/* Image Section */}
                <div className="h-56 bg-surface-container relative overflow-hidden flex items-center justify-center">
                  {action.image_url ? (
                    <img 
                      src={action.image_url} 
                      alt={action.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="text-outline-variant flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <span className="text-sm font-medium">Sem imagem</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-full font-mono text-xs font-bold text-primary flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    {formatDate(action.action_date)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-primary mb-3 line-clamp-2">
                    {action.title}
                  </h3>
                  {action.description && (
                    <p className="text-sm text-on-surface-variant leading-relaxed flex-1 whitespace-pre-wrap">
                      {action.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-surface-container rounded-2xl border border-outline-variant border-dashed max-w-2xl mx-auto">
            <Users className="w-12 h-12 text-outline-variant mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Nenhuma ação registrada ainda</h3>
            <p className="text-on-surface-variant">As atividades da nossa equipe em campo aparecerão aqui em breve.</p>
          </div>
        )}
      </div>
    </div>
  );
}
