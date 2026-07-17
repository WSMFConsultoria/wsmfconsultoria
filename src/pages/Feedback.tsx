import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MessageSquare, Send, CheckCircle2, Loader2, Star } from 'lucide-react';
import type { Testimonial } from '../types';

export default function Feedback() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [approvedFeedbacks, setApprovedFeedbacks] = useState<Testimonial[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  useEffect(() => {
    fetchApprovedFeedbacks();
  }, []);

  const fetchApprovedFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setApprovedFeedbacks(data);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('testimonials').insert([
        { 
          author_name: name,
          author_role: role,
          content: message,
          is_approved: false // Por padrão, precisa ser aprovado pelo admin
        }
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setName('');
      setRole('');
      setMessage('');
      
      // Ocultar mensagem de sucesso após 5 segundos
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setSubmitError(err.message || 'Ocorreu um erro ao enviar seu feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-container/10 text-secondary mb-2">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            Avaliações e Feedback
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
            Sua opinião é fundamental para aprimorarmos continuamente nossos serviços de consultoria e gestão em saúde.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Feedback Form */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Star className="w-6 h-6 text-secondary" />
              Deixe seu depoimento
            </h2>

            {submitSuccess ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Muito Obrigado!</h3>
                <p className="text-green-700">Seu feedback foi enviado com sucesso e em breve será publicado em nossa página.</p>
                <button 
                  onClick={() => setSubmitSuccess(false)}
                  className="mt-6 text-sm font-bold text-green-700 hover:text-green-800 underline cursor-pointer"
                >
                  Enviar outro depoimento
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                    {submitError}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-primary mb-1">
                      Seu Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-background text-primary"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-bold text-primary mb-1">
                      Cargo e Município / Instituição
                    </label>
                    <input
                      type="text"
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-background text-primary"
                      placeholder="Ex: Secretário de Saúde - Itabuna, BA"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-primary mb-1">
                      Seu Depoimento <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all bg-background text-primary resize-y"
                      placeholder="Como tem sido a sua experiência com a WSMF?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name || !message}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar Feedback
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Published Feedbacks */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary border-b border-outline-variant pb-4">
              O que dizem sobre nós
            </h2>

            {loadingFeedbacks ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
              </div>
            ) : approvedFeedbacks.length > 0 ? (
              <div className="grid gap-4">
                {approvedFeedbacks.map((fb) => (
                  <div key={fb.id} className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary font-bold text-xl flex items-center justify-center shrink-0 border border-secondary/20">
                        {fb.avatar_url ? (
                          <img src={fb.avatar_url} alt={fb.author_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          fb.author_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{fb.author_name}</h4>
                        {fb.author_role && (
                          <p className="text-xs text-on-surface-variant font-mono mt-0.5 uppercase tracking-wide">
                            {fb.author_role}
                          </p>
                        )}
                        <p className="text-sm text-on-surface mt-3 italic leading-relaxed">
                          "{fb.content}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-surface-container-lowest rounded-xl border border-outline-variant border-dashed">
                <p className="text-on-surface-variant">
                  Seja o primeiro a deixar um depoimento!
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
