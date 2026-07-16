import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Image as ImageIcon, Upload, Trash2, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function AdminMedia() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    if (data) setMedia(data);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-secondary" />
            Biblioteca de Mídia
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">Gerencie imagens, banners e documentos para download.</p>
        </div>
        <button className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer shadow">
          <Upload className="w-4 h-4" />
          Fazer Upload
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-sm p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : media.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {media.map((item) => (
              <div key={item.id} className="border border-outline-variant rounded-lg overflow-hidden group">
                <div className="aspect-square bg-surface-container flex items-center justify-center relative">
                  <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="bg-white p-2 rounded text-primary hover:text-secondary"><LinkIcon className="w-4 h-4" /></button>
                    <button className="bg-white p-2 rounded text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-2 text-xs truncate" title={item.file_name}>
                  {item.file_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-lg">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-on-surface-variant font-medium">Nenhum arquivo de mídia encontrado.</p>
            <p className="text-xs text-slate-400 mt-1">Faça upload do primeiro arquivo para popular sua galeria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
