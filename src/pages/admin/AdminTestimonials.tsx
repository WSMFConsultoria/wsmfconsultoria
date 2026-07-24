import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare, Plus, CheckCircle, XCircle, Trash2, Loader2, X,
  Search, Edit, Image as ImageIcon, Save, Star, Filter
} from 'lucide-react';
import type { Testimonial } from '../../types';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [authorRole, setAuthorRole] = useState('');
  const [content, setContent] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
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
        alert('Erro ao excluir depoimento.');
      } else {
        fetchTestimonials();
      }
      setProcessingId(null);
    }
  };

  // Modal handlers
  const openNewModal = () => {
    setEditingId(null);
    setAuthorName('');
    setAuthorRole('');
    setContent('');
    setIsApproved(true);
    setAvatarFile(null);
    setCurrentAvatarUrl('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingId(t.id);
    setAuthorName(t.author_name);
    setAuthorRole(t.author_role || '');
    setContent(t.content);
    setIsApproved(t.is_approved);
    setAvatarFile(null);
    setCurrentAvatarUrl(t.avatar_url || '');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const uploadAvatar = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from('public_media')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('public_media')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setErrorMsg('Nome e conteúdo são obrigatórios.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      let avatarUrl = currentAvatarUrl;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const testimonialData = {
        author_name: authorName.trim(),
        author_role: authorRole.trim() || null,
        content: content.trim(),
        is_approved: isApproved,
        avatar_url: avatarUrl || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchTestimonials();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar depoimento.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    const matchesSearch = t.author_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'approved' && t.is_approved) ||
      (filterStatus === 'pending' && !t.is_approved);
    return matchesSearch && matchesFilter;
  });

  const approvedCount = testimonials.filter(t => t.is_approved).length;
  const pendingCount = testimonials.filter(t => !t.is_approved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-secondary" />
            Depoimentos
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {approvedCount} aprovado(s) • {pendingCount} pendente(s)
          </p>
        </div>
        <button
          onClick={openNewModal}
          className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          Novo Depoimento
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome ou conteúdo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
          />
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: 'all' as const, label: 'Todos', count: testimonials.length },
            { value: 'approved' as const, label: 'Aprovados', count: approvedCount },
            { value: 'pending' as const, label: 'Pendentes', count: pendingCount },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                filterStatus === opt.value
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {opt.label} ({opt.count})
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <div className="divide-y divide-outline-variant/50">
            {filteredTestimonials.map((testim) => (
              <div key={testim.id} className="p-5 flex flex-col md:flex-row gap-4 items-start hover:bg-surface/30 transition-colors group">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant flex-shrink-0 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                  {testim.avatar_url ? (
                    <img src={testim.avatar_url} alt={testim.author_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    testim.author_name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-primary">{testim.author_name}</h3>
                    {testim.author_role && (
                      <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded font-mono">{testim.author_role}</span>
                    )}
                    {testim.is_approved ? (
                      <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 ml-auto">
                        <CheckCircle className="w-3 h-3" /> Aprovado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 ml-auto">
                        <Loader2 className="w-3 h-3" /> Pendente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant italic leading-relaxed">"{testim.content}"</p>
                  <p className="text-[10px] text-on-surface-variant font-mono">
                    {new Date(testim.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1.5 items-center shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(testim)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleApproval(testim.id, testim.is_approved)}
                    disabled={processingId === testim.id}
                    className={`p-2 rounded-lg transition-colors ${
                      testim.is_approved
                        ? 'text-amber-600 hover:bg-amber-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={testim.is_approved ? 'Ocultar' : 'Aprovar'}
                  >
                    {processingId === testim.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : testim.is_approved ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(testim.id)}
                    disabled={processingId === testim.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageSquare className="w-12 h-12 text-outline-variant mb-3" />
            <p className="text-on-surface-variant font-bold">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum depoimento cadastrado'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              {searchTerm ? 'Tente outro termo de busca.' : 'Clique em "Novo Depoimento" para adicionar.'}
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-outline-variant sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-lg font-bold text-primary">
                {editingId ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
              )}

              {/* Avatar Upload */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-secondary transition-colors"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  {avatarFile ? (
                    <img src={URL.createObjectURL(avatarFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : currentAvatarUrl ? (
                    <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-outline-variant" />
                  )}
                </div>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    {currentAvatarUrl || avatarFile ? 'Alterar foto' : 'Adicionar foto'}
                  </button>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">JPG, PNG ou WebP (opcional)</p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setAvatarFile(e.target.files[0])}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Nome do Autor *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-sm"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Cargo / Função</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all text-sm"
                  placeholder="Ex: Secretária de Saúde, Prefeito(a)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Depoimento *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-y text-sm"
                  placeholder="O que essa pessoa disse sobre a WSMF..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsApproved(!isApproved)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isApproved
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {isApproved ? <CheckCircle className="w-4 h-4" /> : <Loader2 className="w-4 h-4" />}
                  {isApproved ? 'Aprovado (visível no site)' : 'Pendente (oculto)'}
                </button>
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
                    <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {editingId ? 'Salvar Alterações' : 'Cadastrar'}</>
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
