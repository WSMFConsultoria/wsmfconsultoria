import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, Edit, Loader2 } from 'lucide-react';
import AdminContentEditorModal from '../../components/admin/AdminContentEditorModal';

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<any>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('pages').select('*').order('created_at', { ascending: true });
    
    if (error) {
      console.error('Erro ao buscar páginas:', error);
    } else if (data) {
      setPages(data);
    }
    
    // Fake delay if no data (for demonstration before real DB is connected)
    if (!data || data.length === 0) {
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <FileText className="w-6 h-6 text-secondary" />
            Páginas & Textos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Gerencie os textos e conteúdos das seções já existentes no site.</p>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-primary font-bold border-b border-outline-variant">
              <tr>
                <th className="p-4">Título da Página</th>
                <th className="p-4">Slug (URL)</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {pages.length > 0 ? pages.map((page) => (
                <tr key={page.id} className="hover:bg-surface transition-colors">
                  <td className="p-4 font-bold text-on-surface">{page.title}</td>
                  <td className="p-4 text-on-surface-variant">/{page.slug}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${page.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {page.is_active ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingPage(page)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                      title="Editar Textos"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    Nenhuma página encontrada. Conecte o banco de dados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editingPage && (
        <AdminContentEditorModal 
          page={editingPage} 
          onClose={() => setEditingPage(null)} 
        />
      )}
    </div>
  );
}
