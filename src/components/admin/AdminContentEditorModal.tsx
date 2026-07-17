import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface AdminContentEditorModalProps {
  page: any;
  onClose: () => void;
}

export default function AdminContentEditorModal({ page, onClose }: AdminContentEditorModalProps) {
  const [contentBlock, setContentBlock] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Local state for the parsed JSON content
  const [parsedContent, setParsedContent] = useState<any>(null);

  useEffect(() => {
    fetchContentBlock();
  }, [page]);

  const fetchContentBlock = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('page_id', page.id)
      .single();

    if (error) {
      console.error('Error fetching block:', error);
      setErrorMsg('Não foi possível carregar os textos desta página.');
    } else if (data) {
      setContentBlock(data);
      setParsedContent(data.content);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!contentBlock) return;
    setSaving(true);
    setErrorMsg('');

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ content: parsedContent, updated_at: new Date().toISOString() })
        .eq('id', contentBlock.id);

      if (error) throw error;
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const updateArrayItem = (index: number, field: string, value: any) => {
    const newContent = [...parsedContent];
    newContent[index] = { ...newContent[index], [field]: value };
    setParsedContent(newContent);
  };

  const addArrayItem = (emptyItem: any) => {
    setParsedContent([...parsedContent, emptyItem]);
  };

  const removeArrayItem = (index: number) => {
    const newContent = [...parsedContent];
    newContent.splice(index, 1);
    setParsedContent(newContent);
  };

  const renderEditor = () => {
    if (!contentBlock || !parsedContent) return null;
    const { section_name } = contentBlock;

    if (section_name === 'contact_info') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-primary mb-1">E-mail</label>
            <input
              type="text"
              value={parsedContent.email || ''}
              onChange={(e) => setParsedContent({ ...parsedContent, email: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-1">Telefone</label>
            <input
              type="text"
              value={parsedContent.phone || ''}
              onChange={(e) => setParsedContent({ ...parsedContent, phone: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-1">Endereço</label>
            <input
              type="text"
              value={parsedContent.address || ''}
              onChange={(e) => setParsedContent({ ...parsedContent, address: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-primary mb-1">Instagram</label>
            <input
              type="text"
              value={parsedContent.instagram || ''}
              onChange={(e) => setParsedContent({ ...parsedContent, instagram: e.target.value })}
              className="w-full px-4 py-2 border border-outline-variant rounded-lg"
            />
          </div>
        </div>
      );
    }

    if (section_name === 'faqs') {
      return (
        <div className="space-y-6">
          {Array.isArray(parsedContent) && parsedContent.map((faq: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-lg bg-surface-container-lowest relative">
              <button 
                onClick={() => removeArrayItem(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-3 mt-2">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Pergunta</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => updateArrayItem(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Resposta</label>
                  <textarea
                    rows={3}
                    value={faq.answer || ''}
                    onChange={(e) => updateArrayItem(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => addArrayItem({ question: 'Nova Pergunta?', answer: 'Resposta aqui.' })}
            className="w-full py-2 border-2 border-dashed border-outline-variant text-secondary rounded-lg font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar FAQ
          </button>
        </div>
      );
    }

    if (section_name === 'sis_endemias_steps') {
      return (
        <div className="space-y-6">
          {Array.isArray(parsedContent) && parsedContent.map((step: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-lg bg-surface-container-lowest relative">
              <button 
                onClick={() => removeArrayItem(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                title="Excluir Passo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-3 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Passo (ex: 1, 2)</label>
                    <input
                      type="text"
                      value={step.step || ''}
                      onChange={(e) => updateArrayItem(index, 'step', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Ícone (Nome)</label>
                    <input
                      type="text"
                      value={step.icon || ''}
                      onChange={(e) => updateArrayItem(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Título</label>
                  <input
                    type="text"
                    value={step.title || ''}
                    onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={step.description || ''}
                    onChange={(e) => updateArrayItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm resize-y"
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={() => addArrayItem({ step: `${parsedContent.length + 1}`, icon: 'Circle', title: 'Novo Passo', description: 'Descrição do novo passo.' })}
            className="w-full py-2 border-2 border-dashed border-outline-variant text-secondary rounded-lg font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Passo
          </button>
        </div>
      );
    }

    if (section_name === 'services_data') {
      return (
        <div className="space-y-6">
          {Array.isArray(parsedContent) && parsedContent.map((svc: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-lg bg-surface-container-lowest relative">
              <button 
                onClick={() => removeArrayItem(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-50 rounded"
                title="Excluir Serviço"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-3 mt-2">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Título</label>
                  <input
                    type="text"
                    value={svc.title || ''}
                    onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={svc.description || ''}
                    onChange={(e) => updateArrayItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm resize-y"
                  />
                </div>
                {svc.subtitle && (
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Subtítulo</label>
                    <input
                      type="text"
                      value={svc.subtitle || ''}
                      onChange={(e) => updateArrayItem(index, 'subtitle', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-md text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <button 
            onClick={() => addArrayItem({ title: 'Novo Serviço', description: 'Descrição detalhada do novo serviço.', subtitle: '' })}
            className="w-full py-2 border-2 border-dashed border-outline-variant text-secondary rounded-lg font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Serviço
          </button>
        </div>
      );
    }

    return (
      <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
        Formato de conteúdo não reconhecido para edição visual.
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant bg-white z-10 shrink-0 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-primary">
              Editar Textos: {page.title}
            </h2>
            {contentBlock && (
              <p className="text-xs font-mono text-on-surface-variant uppercase mt-1">Bloco: {contentBlock.section_name}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-surface-container">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : errorMsg ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
              {errorMsg}
            </div>
          ) : !contentBlock ? (
            <div className="text-center text-on-surface-variant py-8">
              Nenhum bloco de texto dinâmico associado a esta página.
            </div>
          ) : (
            renderEditor()
          )}
        </div>

        <div className="p-4 border-t border-outline-variant flex justify-end gap-3 bg-white rounded-b-xl shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !contentBlock}
            className="bg-primary hover:bg-secondary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
            ) : (
              <><Save className="w-4 h-4" /> Salvar Alterações</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
