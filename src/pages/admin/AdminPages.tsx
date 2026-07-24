import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  FileText, Edit, Loader2, ChevronDown, ChevronUp, Plus, Trash2,
  Eye, EyeOff, Save, X, GripVertical, Settings, ArrowLeft, Check
} from 'lucide-react';
import AdminContentEditorModal from '../../components/admin/AdminContentEditorModal';
import type { Page, ContentBlock } from '../../types';

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded page view
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [pageBlocks, setPageBlocks] = useState<ContentBlock[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

  // Content editor modal
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  // New block
  const [showNewBlockForm, setShowNewBlockForm] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockType, setNewBlockType] = useState('json');
  const [creatingBlock, setCreatingBlock] = useState(false);

  // Page inline edit
  const [editingPageMeta, setEditingPageMeta] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editMetaDesc, setEditMetaDesc] = useState('');
  const [savingMeta, setSavingMeta] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) console.error('Erro ao buscar páginas:', error);
    if (data) setPages(data);
    setLoading(false);
  };

  const fetchBlocks = async (pageId: string) => {
    setLoadingBlocks(true);
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('order_index', { ascending: true });

    if (error) console.error('Erro ao buscar blocos:', error);
    if (data) setPageBlocks(data);
    setLoadingBlocks(false);
  };

  const handleSelectPage = async (page: Page) => {
    setSelectedPage(page);
    setEditingPageMeta(false);
    setShowNewBlockForm(false);
    await fetchBlocks(page.id);
  };

  const handleBackToList = () => {
    setSelectedPage(null);
    setPageBlocks([]);
    setEditingPageMeta(false);
    setShowNewBlockForm(false);
  };

  const handleToggleActive = async (page: Page) => {
    const { error } = await supabase
      .from('pages')
      .update({ is_active: !page.is_active, updated_at: new Date().toISOString() })
      .eq('id', page.id);

    if (!error) {
      fetchPages();
      if (selectedPage?.id === page.id) {
        setSelectedPage({ ...page, is_active: !page.is_active });
      }
    }
  };

  const handleSavePageMeta = async () => {
    if (!selectedPage) return;
    setSavingMeta(true);
    const { error } = await supabase
      .from('pages')
      .update({
        title: editTitle,
        meta_description: editMetaDesc,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedPage.id);

    if (!error) {
      const updatedPage = { ...selectedPage, title: editTitle, meta_description: editMetaDesc };
      setSelectedPage(updatedPage);
      setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
      setEditingPageMeta(false);
    }
    setSavingMeta(false);
  };

  const handleCreateBlock = async () => {
    if (!selectedPage || !newBlockName.trim()) return;
    setCreatingBlock(true);

    const sectionName = newBlockName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    let defaultContent: any = {};
    if (newBlockType === 'json') defaultContent = [];
    if (newBlockType === 'text') defaultContent = { title: '', body: '' };

    const { error } = await supabase
      .from('content_blocks')
      .insert([{
        page_id: selectedPage.id,
        section_name: sectionName,
        content_type: newBlockType,
        content: defaultContent,
        order_index: pageBlocks.length,
      }]);

    if (error) {
      alert('Erro ao criar seção: ' + error.message);
    } else {
      setNewBlockName('');
      setShowNewBlockForm(false);
      await fetchBlocks(selectedPage.id);
    }
    setCreatingBlock(false);
  };

  const handleDeleteBlock = async (block: ContentBlock) => {
    if (!window.confirm(`Excluir a seção "${block.section_name}"? Esta ação não pode ser desfeita.`)) return;

    const { error } = await supabase
      .from('content_blocks')
      .delete()
      .eq('id', block.id);

    if (!error && selectedPage) {
      await fetchBlocks(selectedPage.id);
    }
  };

  const getBlockPreview = (block: ContentBlock): string => {
    const content = block.content;
    if (!content) return 'Conteúdo vazio';

    if (Array.isArray(content)) {
      return `${content.length} item(s) configurado(s)`;
    }

    if (typeof content === 'object') {
      const keys = Object.keys(content);
      if (keys.length === 0) return 'Conteúdo vazio';
      const preview = keys.slice(0, 3).map(k => {
        const val = content[k];
        if (typeof val === 'string') return `${k}: "${val.substring(0, 30)}${val.length > 30 ? '...' : ''}"`;
        return k;
      }).join(', ');
      return preview;
    }

    return String(content).substring(0, 80);
  };

  const getSectionLabel = (name: string): string => {
    const labels: Record<string, string> = {
      'services_data': '📋 Serviços',
      'faqs': '❓ Perguntas Frequentes',
      'sis_endemias_steps': '🔬 Passos SisEndemias',
      'contact_info': '📞 Informações de Contato',
    };
    return labels[name] || `📄 ${name}`;
  };

  // ==========================================
  // RENDER: Page List View
  // ==========================================
  if (!selectedPage) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
              <FileText className="w-6 h-6 text-secondary" />
              Páginas & Conteúdo
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Selecione uma página para gerenciar suas seções e conteúdos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : pages.length > 0 ? pages.map((page) => (
            <button
              key={page.id}
              onClick={() => handleSelectPage(page)}
              className="bg-white border border-outline-variant rounded-xl p-5 text-left hover:shadow-md hover:border-secondary/50 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 ${page.is_active ? 'bg-secondary' : 'bg-red-400'}`} />
              <div className="flex items-start justify-between gap-3 mt-1">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary group-hover:text-secondary transition-colors truncate text-base">
                    {page.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant font-mono mt-1">/{page.slug}</p>
                  {page.meta_description && (
                    <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">{page.meta_description}</p>
                  )}
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  page.is_active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {page.is_active ? 'Ativa' : 'Rascunho'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-outline-variant/50 text-xs text-on-surface-variant">
                <Edit className="w-3.5 h-3.5 text-secondary" />
                <span className="group-hover:text-secondary transition-colors">Clique para gerenciar seções</span>
              </div>
            </button>
          )) : (
            <div className="col-span-full bg-white border border-outline-variant rounded-xl p-12 text-center">
              <FileText className="w-12 h-12 text-outline-variant mx-auto mb-3" />
              <p className="text-on-surface-variant font-medium">Nenhuma página encontrada.</p>
              <p className="text-xs text-on-surface-variant mt-1">Verifique se o banco de dados está conectado.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: Page Detail / Sections Manager
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBackToList}
            className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" />
              {selectedPage.title}
            </h1>
            <p className="text-xs text-on-surface-variant font-mono mt-0.5">/{selectedPage.slug}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleActive(selectedPage)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
              selectedPage.is_active
                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
            }`}
          >
            {selectedPage.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {selectedPage.is_active ? 'Publicada' : 'Rascunho'}
          </button>
          <button
            onClick={() => {
              setEditTitle(selectedPage.title);
              setEditMetaDesc(selectedPage.meta_description || '');
              setEditingPageMeta(!editingPageMeta);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-surface-container text-primary hover:bg-surface-container-low transition-colors border border-outline-variant"
          >
            <Settings className="w-3.5 h-3.5" />
            Configurações
          </button>
        </div>
      </div>

      {/* Page Meta Editor */}
      {editingPageMeta && (
        <div className="bg-white border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-primary flex items-center gap-2">
            <Settings className="w-4 h-4 text-secondary" />
            Configurações da Página
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Título da Página</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1.5">Meta Descrição (SEO)</label>
              <input
                type="text"
                value={editMetaDesc}
                onChange={(e) => setEditMetaDesc(e.target.value)}
                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder="Descrição para mecanismos de busca..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setEditingPageMeta(false)}
              className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSavePageMeta}
              disabled={savingMeta}
              className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow"
            >
              {savingMeta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Content Blocks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
            Seções de Conteúdo ({pageBlocks.length})
          </h2>
          <button
            onClick={() => setShowNewBlockForm(!showNewBlockForm)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-secondary text-white hover:bg-primary transition-colors shadow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Nova Seção
          </button>
        </div>

        {/* New Block Form */}
        {showNewBlockForm && (
          <div className="bg-secondary/5 border-2 border-dashed border-secondary/30 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-primary">Adicionar Nova Seção</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-primary mb-1.5">Nome da Seção</label>
                <input
                  type="text"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="Ex: hero_banner, galeria_fotos, sobre_empresa..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1.5">Tipo</label>
                <select
                  value={newBlockType}
                  onChange={(e) => setNewBlockType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm bg-white focus:border-secondary focus:ring-1 focus:ring-secondary"
                >
                  <option value="json">JSON (Lista/Objeto)</option>
                  <option value="text">Texto Simples</option>
                  <option value="html">HTML</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewBlockForm(false)}
                className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBlock}
                disabled={!newBlockName.trim() || creatingBlock}
                className="bg-secondary hover:bg-primary text-white px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow"
              >
                {creatingBlock ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Criar Seção
              </button>
            </div>
          </div>
        )}

        {/* Blocks */}
        {loadingBlocks ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : pageBlocks.length > 0 ? (
          <div className="space-y-3">
            {pageBlocks.map((block, idx) => (
              <div
                key={block.id}
                className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 px-5 py-4">
                  <div className="text-outline-variant cursor-grab shrink-0">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary text-sm truncate">
                        {getSectionLabel(block.section_name)}
                      </h3>
                      <span className="px-1.5 py-0.5 bg-surface-container rounded text-[9px] font-mono text-on-surface-variant uppercase shrink-0">
                        {block.content_type}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                      {getBlockPreview(block)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBlock(block)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar Conteúdo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(block)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir Seção"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-outline-variant rounded-xl p-10 text-center">
            <FileText className="w-10 h-10 text-outline-variant mx-auto mb-3" />
            <p className="font-bold text-primary">Nenhuma seção de conteúdo</p>
            <p className="text-xs text-on-surface-variant mt-1">
              Clique em "Nova Seção" para adicionar conteúdo a esta página.
            </p>
          </div>
        )}
      </div>

      {/* Content Editor Modal */}
      {editingBlock && selectedPage && (
        <AdminContentEditorModal
          page={selectedPage}
          block={editingBlock}
          onClose={() => {
            setEditingBlock(null);
            if (selectedPage) fetchBlocks(selectedPage.id);
          }}
        />
      )}
    </div>
  );
}
