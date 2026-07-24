import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Image as ImageIcon, Upload, Trash2, Link as LinkIcon, Loader2,
  Search, X, Check, FileText, ZoomIn, Download, Copy, Filter
} from 'lucide-react';
import type { MediaItem } from '../../types';

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document'>('all');
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMedia(data);
    setLoading(false);
  };

  const handleUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);

    const total = files.length;
    let completed = 0;

    for (const file of Array.from(files)) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public_media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('public_media')
          .getPublicUrl(filePath);

        // Register in media table
        await supabase.from('media').insert([{
          file_name: file.name,
          file_url: publicUrl,
          file_type: file.type.startsWith('image') ? 'image' : 'document',
          bucket_path: filePath,
        }]);

        completed++;
        setUploadProgress(Math.round((completed / total) * 100));
      } catch (err: any) {
        console.error('Upload error:', err);
        alert(`Erro ao enviar ${file.name}: ${err.message}`);
      }
    }

    setUploading(false);
    setUploadProgress(0);
    fetchMedia();
  };

  const handleDelete = async (item: MediaItem) => {
    if (!window.confirm(`Excluir "${item.file_name}"? Esta ação não pode ser desfeita.`)) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('public_media')
        .remove([item.bucket_path]);

      if (storageError) console.warn('Storage delete error:', storageError);

      // Delete from table
      const { error } = await supabase.from('media').delete().eq('id', item.id);
      if (error) throw error;

      setMedia(media.filter(m => m.id !== item.id));
      if (previewItem?.id === item.id) setPreviewItem(null);
    } catch (err: any) {
      alert('Erro ao excluir: ' + err.message);
    }
  };

  const handleCopyUrl = async (item: MediaItem) => {
    try {
      await navigator.clipboard.writeText(item.file_url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = item.file_url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, []);

  const filteredMedia = media.filter(item => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || item.file_type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  return (
    <div
      className="space-y-6"
      ref={dropZoneRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-secondary" />
            Biblioteca de Mídia
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {media.length} arquivo(s) • Arraste arquivos para fazer upload
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-primary hover:bg-secondary text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow disabled:opacity-70"
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Enviando {uploadProgress}%</>
            ) : (
              <><Upload className="w-4 h-4" /> Fazer Upload</>
            )}
          </button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {uploading && (
        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-secondary/10 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border-2 border-dashed border-secondary text-center">
            <Upload className="w-16 h-16 text-secondary mx-auto mb-4 animate-bounce" />
            <p className="text-lg font-bold text-primary">Solte os arquivos aqui</p>
            <p className="text-sm text-on-surface-variant mt-1">Imagens, PDFs ou documentos</p>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white border border-outline-variant rounded-xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
          />
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex gap-1.5">
          {[
            { value: 'all' as const, label: 'Todos' },
            { value: 'image' as const, label: 'Imagens' },
            { value: 'document' as const, label: 'Documentos' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                filterType === opt.value
                  ? 'bg-secondary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white border border-outline-variant rounded-xl shadow-sm p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => (
              <div key={item.id} className="border border-outline-variant rounded-xl overflow-hidden group hover:shadow-md transition-all hover:border-secondary/50">
                {/* Preview */}
                <div className="aspect-square bg-surface-container flex items-center justify-center relative cursor-pointer" onClick={() => setPreviewItem(item)}>
                  {item.file_type === 'image' ? (
                    <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-outline-variant">
                      <FileText className="w-10 h-10" />
                      <span className="text-[10px] font-mono uppercase">{item.file_name.split('.').pop()}</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                      className="bg-white p-2 rounded-lg text-primary hover:text-secondary transition-colors shadow"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCopyUrl(item); }}
                      className="bg-white p-2 rounded-lg text-primary hover:text-secondary transition-colors shadow"
                    >
                      {copiedId === item.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                      className="bg-white p-2 rounded-lg text-red-600 hover:text-red-800 transition-colors shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-bold text-primary truncate" title={item.file_name}>
                    {item.file_name}
                  </p>
                  <p className="text-[10px] text-on-surface-variant font-mono">
                    {formatDate(item.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-outline-variant rounded-xl">
            <ImageIcon className="w-14 h-14 text-outline-variant mx-auto mb-4" />
            <p className="text-on-surface-variant font-bold text-base">
              {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum arquivo de mídia'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1 max-w-md mx-auto">
              {searchTerm ? 'Tente outro termo de busca.' : 'Arraste arquivos para cá ou clique em "Fazer Upload" para adicionar.'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 bg-secondary hover:bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 mx-auto transition-colors shadow cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                Fazer Upload
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute -top-2 -right-2 bg-white text-primary p-2 rounded-full shadow-lg hover:bg-red-50 hover:text-red-500 z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            {previewItem.file_type === 'image' ? (
              <img
                src={previewItem.file_url}
                alt={previewItem.file_name}
                className="max-h-[75vh] w-auto mx-auto rounded-xl shadow-2xl object-contain bg-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="bg-white rounded-xl p-16 flex flex-col items-center justify-center">
                <FileText className="w-20 h-20 text-outline-variant mb-4" />
                <p className="text-primary font-bold">{previewItem.file_name}</p>
              </div>
            )}

            {/* Info bar */}
            <div className="bg-white rounded-xl mt-3 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-primary text-sm truncate">{previewItem.file_name}</p>
                <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">
                  Enviado em {formatDate(previewItem.created_at)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleCopyUrl(previewItem)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-surface-container text-primary rounded-lg text-xs font-bold hover:bg-surface-container-low transition-colors"
                >
                  {copiedId === previewItem.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === previewItem.id ? 'Copiado!' : 'Copiar URL'}
                </button>
                <a
                  href={previewItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-primary transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Abrir
                </a>
                <button
                  onClick={() => handleDelete(previewItem)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
