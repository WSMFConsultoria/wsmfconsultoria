import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Save, Loader2, Plus, Trash2, Image as ImageIcon, Type, Code, Upload } from 'lucide-react';
import type { Page, ContentBlock } from '../../types';

interface AdminContentEditorModalProps {
  page: Page;
  block: ContentBlock;
  onClose: () => void;
}

export default function AdminContentEditorModal({ page, block, onClose }: AdminContentEditorModalProps) {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Local state for the parsed JSON content
  const [parsedContent, setParsedContent] = useState<any>(null);

  // Raw JSON editor toggle
  const [rawMode, setRawMode] = useState(false);
  const [rawJson, setRawJson] = useState('');

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setParsedContent(block.content);
    setRawJson(JSON.stringify(block.content, null, 2));
  }, [block]);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let contentToSave = parsedContent;

      if (rawMode) {
        try {
          contentToSave = JSON.parse(rawJson);
        } catch {
          setErrorMsg('JSON inválido. Verifique a formatação.');
          setSaving(false);
          return;
        }
      }

      const { error } = await supabase
        .from('content_blocks')
        .update({ content: contentToSave, updated_at: new Date().toISOString() })
        .eq('id', block.id);

      if (error) throw error;
      setSuccessMsg('Alterações salvas com sucesso!');
      setTimeout(() => onClose(), 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setParsedContent({ ...parsedContent, [field]: value });
  };

  const updateArrayItem = (index: number, field: string, value: any) => {
    const newContent = [...parsedContent];
    newContent[index] = { ...newContent[index], [field]: value };
    setParsedContent(newContent);
  };

  const addArrayItem = (emptyItem: any) => {
    setParsedContent([...(parsedContent || []), emptyItem]);
  };

  const removeArrayItem = (index: number) => {
    const newContent = [...parsedContent];
    newContent.splice(index, 1);
    setParsedContent(newContent);
  };

  const moveArrayItem = (index: number, direction: 'up' | 'down') => {
    const newContent = [...parsedContent];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newContent.length) return;
    [newContent[index], newContent[targetIdx]] = [newContent[targetIdx], newContent[index]];
    setParsedContent(newContent);
  };

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('public_media')
        .getPublicUrl(filePath);

      // Also register in media table
      await supabase.from('media').insert([{
        file_name: file.name,
        file_url: publicUrl,
        file_type: file.type.startsWith('image') ? 'image' : 'document',
        bucket_path: filePath,
      }]);

      callback(publicUrl);
    } catch (err: any) {
      setErrorMsg('Erro ao fazer upload: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  // ==========================================
  // VISUAL EDITORS BY SECTION TYPE
  // ==========================================

  const renderEditor = () => {
    if (!parsedContent && parsedContent !== '') return (
      <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
        Conteúdo vazio. Use o editor JSON para adicionar conteúdo.
      </div>
    );

    const sectionName = block.section_name;

    // Contact Info Editor
    if (sectionName === 'contact_info') {
      return (
        <div className="space-y-4">
          {['email', 'phone', 'address', 'instagram', 'coords'].map(field => (
            <div key={field}>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase">{field}</label>
              <input
                type="text"
                value={parsedContent?.[field] || ''}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder={`Insira ${field}...`}
              />
            </div>
          ))}
        </div>
      );
    }

    // FAQ Editor
    if (sectionName === 'faqs') {
      return (
        <div className="space-y-4">
          {Array.isArray(parsedContent) && parsedContent.map((faq: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest relative group">
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button onClick={() => moveArrayItem(index, 'up')} className="p-1 text-primary hover:bg-surface-container rounded" title="Mover para cima">↑</button>
                )}
                {index < parsedContent.length - 1 && (
                  <button onClick={() => moveArrayItem(index, 'down')} className="p-1 text-primary hover:bg-surface-container rounded" title="Mover para baixo">↓</button>
                )}
                <button onClick={() => removeArrayItem(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3 pr-16">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Pergunta</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => updateArrayItem(index, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Resposta</label>
                  <textarea
                    rows={3}
                    value={faq.answer || ''}
                    onChange={(e) => updateArrayItem(index, 'answer', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm resize-y focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem({ question: '', answer: '' })}
            className="w-full py-3 border-2 border-dashed border-outline-variant text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Pergunta
          </button>
        </div>
      );
    }

    // Steps Editor (SisEndemias)
    if (sectionName === 'sis_endemias_steps') {
      return (
        <div className="space-y-4">
          {Array.isArray(parsedContent) && parsedContent.map((step: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest relative group">
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button onClick={() => moveArrayItem(index, 'up')} className="p-1 text-primary hover:bg-surface-container rounded">↑</button>
                )}
                {index < parsedContent.length - 1 && (
                  <button onClick={() => moveArrayItem(index, 'down')} className="p-1 text-primary hover:bg-surface-container rounded">↓</button>
                )}
                <button onClick={() => removeArrayItem(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3 pr-16">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Passo</label>
                    <input
                      type="text"
                      value={step.step || ''}
                      onChange={(e) => updateArrayItem(index, 'step', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Ícone</label>
                    <input
                      type="text"
                      value={step.icon || ''}
                      onChange={(e) => updateArrayItem(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="Ex: Tablet, Database"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Título</label>
                  <input
                    type="text"
                    value={step.title || ''}
                    onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={step.description || ''}
                    onChange={(e) => updateArrayItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm resize-y focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem({ step: `${(parsedContent?.length || 0) + 1}`, icon: 'Circle', title: '', description: '' })}
            className="w-full py-3 border-2 border-dashed border-outline-variant text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Passo
          </button>
        </div>
      );
    }

    // Services Data Editor
    if (sectionName === 'services_data') {
      return (
        <div className="space-y-4">
          {Array.isArray(parsedContent) && parsedContent.map((svc: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest relative group">
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {index > 0 && (
                  <button onClick={() => moveArrayItem(index, 'up')} className="p-1 text-primary hover:bg-surface-container rounded">↑</button>
                )}
                {index < parsedContent.length - 1 && (
                  <button onClick={() => moveArrayItem(index, 'down')} className="p-1 text-primary hover:bg-surface-container rounded">↓</button>
                )}
                <button onClick={() => removeArrayItem(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-3 pr-16">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Título</label>
                    <input
                      type="text"
                      value={svc.title || ''}
                      onChange={(e) => updateArrayItem(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Ícone</label>
                    <input
                      type="text"
                      value={svc.icon || ''}
                      onChange={(e) => updateArrayItem(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="Ex: ShieldAlert, Map"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Subtítulo</label>
                  <input
                    type="text"
                    value={svc.subtitle || ''}
                    onChange={(e) => updateArrayItem(index, 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Descrição</label>
                  <textarea
                    rows={3}
                    value={svc.description || ''}
                    onChange={(e) => updateArrayItem(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm resize-y focus:border-secondary focus:ring-1 focus:ring-secondary"
                  />
                </div>

                {/* Details Sub-Items */}
                <div className="pt-3 border-t border-outline-variant/50">
                  <label className="block text-xs font-bold text-secondary mb-2 uppercase tracking-wider">Detalhes / Sub-itens</label>
                  {(svc.details || []).map((detail: any, dIdx: number) => (
                    <div key={dIdx} className="flex items-start gap-2 mb-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={detail.title || ''}
                          onChange={(e) => {
                            const newDetails = [...(svc.details || [])];
                            newDetails[dIdx] = { ...newDetails[dIdx], title: e.target.value };
                            updateArrayItem(index, 'details', newDetails);
                          }}
                          className="px-3 py-1.5 border border-outline-variant rounded-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="Título do detalhe"
                        />
                        <input
                          type="text"
                          value={detail.description || ''}
                          onChange={(e) => {
                            const newDetails = [...(svc.details || [])];
                            newDetails[dIdx] = { ...newDetails[dIdx], description: e.target.value };
                            updateArrayItem(index, 'details', newDetails);
                          }}
                          className="px-3 py-1.5 border border-outline-variant rounded-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary"
                          placeholder="Descrição"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const newDetails = [...(svc.details || [])];
                          newDetails.splice(dIdx, 1);
                          updateArrayItem(index, 'details', newDetails);
                        }}
                        className="p-1 text-red-400 hover:bg-red-50 rounded shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newDetails = [...(svc.details || []), { title: '', description: '' }];
                      updateArrayItem(index, 'details', newDetails);
                    }}
                    className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3 h-3" />
                    Adicionar detalhe
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addArrayItem({ id: (parsedContent?.length || 0) + 1, title: '', description: '', icon: 'Circle', subtitle: '', details: [] })}
            className="w-full py-3 border-2 border-dashed border-outline-variant text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Serviço
          </button>
        </div>
      );
    }

    // Generic Object Editor
    if (typeof parsedContent === 'object' && !Array.isArray(parsedContent)) {
      return (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg border border-outline-variant/50">
            Editor genérico para campos do objeto. Cada campo é editável individualmente.
          </p>
          {Object.entries(parsedContent).map(([key, value]) => (
            <div key={key}>
              <label className="block text-xs font-bold text-primary mb-1.5 uppercase font-mono">{key}</label>
              {key.toLowerCase().includes('image') || key.toLowerCase().includes('url') ? (
                <div className="space-y-2">
                  {typeof value === 'string' && value && (
                    <div className="w-full h-32 bg-surface-container rounded-lg overflow-hidden border border-outline-variant relative group">
                      <img src={value} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={value as string}
                      onChange={(e) => updateField(key, e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                      placeholder="URL da imagem..."
                    />
                    <label className="flex items-center justify-center bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-lg px-4 cursor-pointer transition-colors text-primary" title="Fazer upload de nova imagem">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, (url) => updateField(key, url));
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : typeof value === 'string' && value.length > 100 ? (
                <textarea
                  rows={3}
                  value={value as string}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm resize-y focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              ) : typeof value === 'string' ? (
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              ) : (
                <textarea
                  rows={3}
                  value={JSON.stringify(value, null, 2)}
                  onChange={(e) => {
                    try {
                      updateField(key, JSON.parse(e.target.value));
                    } catch {
                      // Keep as string if invalid JSON
                    }
                  }}
                  className="w-full px-4 py-2.5 border border-outline-variant rounded-lg text-xs font-mono resize-y focus:border-secondary focus:ring-1 focus:ring-secondary bg-surface-container-lowest"
                />
              )}
            </div>
          ))}
          <button
            onClick={() => {
              const key = prompt('Nome do novo campo:');
              if (key) updateField(key, '');
            }}
            className="text-xs font-bold text-secondary hover:text-primary flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Adicionar campo
          </button>
        </div>
      );
    }

    // Generic Array Editor
    if (Array.isArray(parsedContent)) {
      return (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant bg-surface-container p-3 rounded-lg border border-outline-variant/50">
            Lista com {parsedContent.length} item(s). Cada item pode ser editado individualmente.
          </p>
          {parsedContent.map((item: any, index: number) => (
            <div key={index} className="p-4 border border-outline-variant rounded-xl bg-surface-container-lowest relative group">
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => removeArrayItem(index)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {typeof item === 'object' ? (
                <div className="space-y-2 pr-8">
                  {Object.entries(item).map(([key, val]) => (
                    <div key={key}>
                      <label className="block text-[10px] font-bold text-primary mb-0.5 uppercase font-mono">{key}</label>
                      {key.toLowerCase().includes('image') || key.toLowerCase().includes('url') ? (
                        <div className="space-y-2">
                          {typeof val === 'string' && val && (
                            <div className="w-full h-24 bg-surface-container rounded-md overflow-hidden border border-outline-variant relative">
                              <img src={val} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={typeof val === 'string' ? val : ''}
                              onChange={(e) => updateArrayItem(index, key, e.target.value)}
                              className="flex-1 px-3 py-1.5 border border-outline-variant rounded-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary"
                              placeholder="URL da imagem..."
                            />
                            <label className="flex items-center justify-center bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded-md px-3 cursor-pointer transition-colors text-primary" title="Fazer upload de nova imagem">
                              <Upload className="w-4 h-4" />
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, (url) => updateArrayItem(index, key, url));
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={typeof val === 'string' ? val : JSON.stringify(val)}
                          onChange={(e) => updateArrayItem(index, key, e.target.value)}
                          className="w-full px-3 py-1.5 border border-outline-variant rounded-md text-xs focus:border-secondary focus:ring-1 focus:ring-secondary"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={String(item)}
                  onChange={(e) => {
                    const newContent = [...parsedContent];
                    newContent[index] = e.target.value;
                    setParsedContent(newContent);
                  }}
                  className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm focus:border-secondary focus:ring-1 focus:ring-secondary"
                />
              )}
            </div>
          ))}
          <button
            onClick={() => addArrayItem(typeof parsedContent[0] === 'object' ? {} : '')}
            className="w-full py-3 border-2 border-dashed border-outline-variant text-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:border-secondary hover:bg-secondary/5 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar Item
          </button>
        </div>
      );
    }

    // Fallback: raw text
    return (
      <div className="space-y-3">
        <textarea
          rows={8}
          value={typeof parsedContent === 'string' ? parsedContent : JSON.stringify(parsedContent, null, 2)}
          onChange={(e) => setParsedContent(e.target.value)}
          className="w-full px-4 py-3 border border-outline-variant rounded-lg text-sm font-mono resize-y focus:border-secondary focus:ring-1 focus:ring-secondary bg-surface-container-lowest"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant bg-white z-10 shrink-0 rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-primary truncate">
              Editar: {page.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-surface-container rounded text-[10px] font-mono text-on-surface-variant uppercase">
                {block.section_name}
              </span>
              <span className="text-[10px] text-on-surface-variant">•</span>
              <span className="text-[10px] text-on-surface-variant font-mono">{block.content_type}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            {/* Toggle Raw JSON */}
            <button
              onClick={() => {
                if (!rawMode) {
                  setRawJson(JSON.stringify(parsedContent, null, 2));
                } else {
                  try {
                    setParsedContent(JSON.parse(rawJson));
                  } catch { /* ignore */ }
                }
                setRawMode(!rawMode);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                rawMode ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Code className="w-3 h-3" />
              JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-surface-container/30">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200 mb-4 flex items-center gap-2">
              <X className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200 mb-4 flex items-center gap-2">
              <Save className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {rawMode ? (
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 border border-outline-variant rounded-xl text-xs font-mono resize-y focus:border-secondary focus:ring-1 focus:ring-secondary bg-primary text-green-400 leading-relaxed"
              spellCheck={false}
            />
          ) : (
            renderEditor()
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-outline-variant flex justify-between items-center bg-white rounded-b-2xl shrink-0">
          <div className="text-[10px] text-on-surface-variant font-mono">
            {uploadingImage && (
              <span className="flex items-center gap-1 text-secondary">
                <Loader2 className="w-3 h-3 animate-spin" /> Enviando imagem...
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
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
    </div>
  );
}
