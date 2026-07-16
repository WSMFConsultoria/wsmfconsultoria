import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Plus, CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-secondary" />
            Depoimentos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Gerencie as avaliações dos clientes visíveis na página inicial.</p>
        </div>
        <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow">
          <Plus className="w-4 h-4" />
          Novo Depoimento
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : testimonials.length > 0 ? (
          <div className="divide-y divide-outline-variant">
            {testimonials.map((testim) => (
              <div key={testim.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start hover:bg-surface transition-colors">
                <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex-shrink-0 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                  {testim.avatar_url ? <img src={testim.avatar_url} alt={testim.author_name} className="w-full h-full object-cover" /> : testim.author_name.charAt(0)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary">{testim.author_name}</h3>
                    <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{testim.author_role}</span>
                    {testim.is_approved ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded ml-auto">
                        <CheckCircle className="w-3 h-3" /> Aprovado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded ml-auto">
                        <XCircle className="w-3 h-3" /> Oculto
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant italic">"{testim.content}"</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Aprovar/Ocultar">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-on-surface-variant font-medium">Nenhum depoimento cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
