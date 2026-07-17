import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Search, Loader2, Calendar } from 'lucide-react';

interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  created_at: string;
}

export default function AdminContacts() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err: any) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg => 
    msg.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.assunto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <Mail className="w-6 h-6 text-secondary" />
            Mensagens de Contato
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Gerencie as mensagens recebidas através do formulário de contato do site.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-outline-variant bg-surface">
          <div className="relative max-w-md">
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou assunto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded-lg bg-background focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 bg-surface-container">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : filteredMessages.length > 0 ? (
            <div className="grid gap-4">
              {filteredMessages.map((msg) => (
                <div key={msg.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <div>
                      <h3 className="font-bold text-primary">{msg.nome}</h3>
                      <a href={`mailto:${msg.email}`} className="text-sm text-secondary hover:underline font-mono">
                        {msg.email}
                      </a>
                    </div>
                    <div className="text-xs text-on-surface-variant flex items-center gap-1 shrink-0 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(msg.created_at)}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-outline-variant relative">
                    <p className="text-sm font-bold text-on-surface mb-1">
                      Assunto: {msg.assunto}
                    </p>
                    <p className="text-sm text-on-surface-variant whitespace-pre-wrap bg-surface-container p-3 rounded border border-outline-variant/30">
                      {msg.mensagem}
                    </p>
                    
                    <button 
                      onClick={async () => {
                        if (window.confirm('Excluir esta mensagem permanentemente?')) {
                          const { error } = await supabase.from('contact_messages').delete().eq('id', msg.id);
                          if (!error) fetchMessages();
                        }
                      }}
                      className="absolute bottom-0 right-0 p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Excluir Mensagem"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <Mail className="w-12 h-12 text-outline-variant" />
              <div>
                <p className="font-bold text-primary">Nenhuma mensagem encontrada</p>
                <p className="text-sm text-on-surface-variant">As mensagens recebidas aparecerão aqui.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
