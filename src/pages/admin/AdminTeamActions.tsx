import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Plus, Pencil, Trash2, Loader2, Image as ImageIcon, X } from 'lucide-react';
import type { TeamAction } from '../../types';

export default function AdminTeamActions() {
  const [actions, setActions] = useState<TeamAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_actions')
      .select('*')
      .order('action_date', { ascending: false });
      
    if (error) console.error('Error fetching actions:', error);
    if (data) setActions(data);
    setTimeout(() => setLoading(false), 500);
  };

  const openNewModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setActionDate(new Date().toISOString().split('T')[0]);
    setImageFile(null);
    setCurrentImageUrl('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (action: TeamAction) => {
    setEditingId(action.id);
    setTitle(action.title);
    setDescription(action.description || '');
    setActionDate(action.action_date);
    setImageFile(null);
    setCurrentImageUrl(action.image_url || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `team_actions/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('public_media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('public_media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setErrorMsg('O título é obrigatório.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      let finalImageUrl = currentImageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const actionData = {
        title,
        description,
        action_date: actionDate,
        image_url: finalImageUrl,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('team_actions')
          .update(actionData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('team_actions')
          .insert([actionData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchActions();
    } catch (err: any) {
      console.error('Error saving action:', err);
      setErrorMsg(err.message || 'Erro ao salvar a ação.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta ação? Esta operação não pode ser desfeita.')) {
      setLoading(true);
      const { error } = await supabase.from('team_actions').delete().eq('id', id);
      if (error) {
        console.error('Error deleting action:', error);
        alert('Erro ao excluir: ' + error.message);
      } else {
        fetchActions();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-secondary" />
            Workshops e Treinamentos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gerencie as publicações sobre os workshops e treinamentos ministrados.
          </p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          Novo Registro
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : actions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-container text-on-surface-variant font-mono text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl">Imagem</th>
                  <th className="px-6 py-4">Título & Descrição</th>
                  <th className="px-6 py-4">Data da Ação</th>
                  <th className="px-6 py-4 text-right rounded-tr-xl">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {actions.map((action) => (
                  <tr key={action.id} className="hover:bg-surface transition-colors group">
                    <td className="px-6 py-4">
                      {action.image_url ? (
                        <img 
                          src={action.image_url} 
                          alt={action.title} 
                          className="w-16 h-16 object-cover rounded-lg border border-outline-variant shadow-sm" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-surface-container rounded-lg border border-outline-variant flex flex-col items-center justify-center text-outline-variant">
                          <ImageIcon className="w-6 h-6" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-md">
                      <div className="font-bold text-primary mb-1">{action.title}</div>
                      <div className="text-on-surface-variant text-xs line-clamp-2">
                        {action.description || 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-surface-container px-2.5 py-1 rounded-full font-mono text-xs text-primary font-medium border border-outline-variant/50">
                        {formatDate(action.action_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(action)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(action.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors" 
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-outline-variant mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">Nenhum treinamento cadastrado.</p>
            <p className="text-sm text-on-surface-variant mt-1">Clique em "Novo Registro" para adicionar o primeiro.</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-primary">
                {editingId ? 'Editar Workshop / Treinamento' : 'Novo Workshop / Treinamento'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Título do Treinamento *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="Ex: Treinamento com agentes em Mutuípe"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Data da Ação *</label>
                <input
                  type="date"
                  required
                  value={actionDate}
                  onChange={(e) => setActionDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Descrição</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y"
                  placeholder="Detalhes sobre o treinamento, quem participou, resultados..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-1">Imagem da Ação</label>
                
                {currentImageUrl && !imageFile && (
                  <div className="mb-3 relative w-40 h-32 rounded-lg overflow-hidden border border-outline-variant">
                    <img src={currentImageUrl} alt="Atual" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setCurrentImageUrl('')}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                      title="Remover Imagem Atual"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex-1 border-2 border-dashed border-outline-variant hover:border-secondary transition-colors rounded-lg px-4 py-6 cursor-pointer flex flex-col items-center justify-center bg-surface-container-lowest">
                    <ImageIcon className="w-8 h-8 text-secondary mb-2" />
                    <span className="text-sm font-medium text-primary">
                      {imageFile ? imageFile.name : 'Clique para selecionar uma imagem'}
                    </span>
                    <span className="text-xs text-on-surface-variant mt-1">JPG, PNG ou WebP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Salvando...
                    </>
                  ) : (
                    'Salvar Registro'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
