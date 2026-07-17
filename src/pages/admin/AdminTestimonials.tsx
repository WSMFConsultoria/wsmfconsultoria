import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MessageSquare, Plus, CheckCircle, XCircle, Trash2, Loader2, X } from 'lucide-react';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setLoading(false);
  };

  const handleToggleApproval = async (id: string, currentStatus: boolean) => {
    setProcessingId(id);
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar depoimento:', error);
      alert('Erro ao atualizar depoimento.');
    } else {
      fetchTestimonials();
    }
    setProcessingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este depoimento?')) {
      setProcessingId(id);
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) {
        console.error('Erro ao excluir depoimento:', error);
        alert('Erro ao excluir depoimento.');
      } else {
        fetchTestimonials();
      }
      setProcessingId(null);
    }
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
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="divide-y divide-outline-variant">
              {testimonials.map((testim) => (
                <div key={testim.id} className="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start hover:bg-surface transition-colors">
                  <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex-shrink-0 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                    {testim.avatar_url ? <img src={testim.avatar_url} alt={testim.author_name} className="w-full h-full object-cover" /> : testim.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary">{testim.author_name}</h3>
                      {testim.author_role && (
                        <span className="text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">{testim.author_role}</span>
                      )}
                      {testim.is_approved ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded ml-auto">
                          <CheckCircle className="w-3 h-3" /> Aprovado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded ml-auto">
                          <Loader2 className="w-3 h-3" /> Pendente / Oculto
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-on-surface-variant italic leading-relaxed">"{testim.content}"</p>
                  </div>
                  <div className="flex gap-2 items-center mt-4 md:mt-0">
                    <button 
                      onClick={() => handleToggleApproval(testim.id, testim.is_approved)}
                      disabled={processingId === testim.id}
                      className={`p-2 rounded transition-colors flex items-center gap-1 text-sm ${testim.is_approved ? 'text-amber-600 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                      title={testim.is_approved ? 'Ocultar' : 'Aprovar'}
                    >
                      {processingId === testim.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : testim.is_approved ? (
                        <><X className="w-4 h-4" /> Ocultar</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Aprovar</>
                      )}
                    </button>
                    <button 
                      onClick={() => handleDelete(testim.id)}
                      disabled={processingId === testim.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageSquare className="w-12 h-12 text-outline-variant mb-3" />
              <p className="text-on-surface-variant font-medium">Nenhum depoimento recebido.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
