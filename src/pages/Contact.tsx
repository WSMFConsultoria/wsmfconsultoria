import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, AtSign, Send, CheckCircle2, Map, Loader2 } from 'lucide-react';
import { ContactMessage } from '../types';
import { supabase } from '../lib/supabase';

const DEFAULT_HEADER = {
  title: 'Entre em Contato',
  description: 'A WSMF Gestão em Saúde Consultoria Ltda. está totalmente pronta para ser a parceria estratégica ideal do seu município na consolidação das diretrizes de saúde pública.',
  map_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG5fhH3OWC6n4XE5gbuS8i0uUUo71ROV8znmXorLfsd_57ieUxJgMzNP4Lq0dt1xg1erPpOJWNwkJkozHHVpUyUUNg8pkjSlloUsa-qPjYXBmClpF9-cJsLN3JnEHwpX28XQKCoI9wMZV5jHRhtSQA-mzmd-McC-OPWtH7BfNoEXRSkA8tol4qPT3v9kxEEpDVwPBjL-152JAH-EFkFFQQr-XYhH-xJ7hWYh58WnC4gz5WwPXkIyn25fWL7gTn_NwWIFrbaX35uEQ'
};

export default function Contact() {
  const formatInstagramUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://instagram.com/${url.replace('@', '').trim()}`;
  };

  const formatWhatsappUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://wa.me/${url.replace(/\D/g, '')}`;
  };

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [assunto, setAssunto] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [contactInfo, setContactInfo] = useState<any>(null);
  const [headerInfo, setHeaderInfo] = useState<any>(DEFAULT_HEADER);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('section_name, content')
          .in('section_name', ['contact_info', 'contact_header']);
          
        if (error) throw error;
        if (data) {
          data.forEach(block => {
            if (block.section_name === 'contact_info' && block.content) {
              setContactInfo(block.content);
            }
            if (block.section_name === 'contact_header' && block.content) {
              setHeaderInfo({ ...DEFAULT_HEADER, ...block.content });
            }
          });
        }
      } catch (error) {
        console.error('Error fetching contact content:', error);
      } finally {
        setLoadingInfo(false);
      }
    };
    
    fetchContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !assunto || !mensagem) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const { error } = await supabase.from('contact_messages').insert([
        { 
          nome,
          email,
          assunto,
          mensagem
        }
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      
      // Reset fields
      setNome('');
      setEmail('');
      setAssunto('');
      setMensagem('');

      // Clear success message after 4 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 4000);
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao enviar a mensagem.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-12 flex-grow min-h-screen"
    >
      {/* Page Title Header */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 relative overflow-hidden text-center md:text-left shadow-sm">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDsjXJVMvRbrHt6ksXJWzsxPaY9fws4G4GKkDL_ALwZ-mFNOXAkRBitYaGH838W50tkXuuao84gfnY-FV1nnEw0TWjSrGtSqvhUW5h3Bi2Ml7LAe-_M2Qty8q9hGnYfnqE-utgnaarvTsfwb5iafn4xXyFeAgsa4Q1rysYo9QqfIq5FEpDP8v2sLozdl7N1GSMDuXFhnxReMCIJg_NfdTUQkMEEHOdr-sWBgrJqjaxO0-JlS5Vb3MPFmKnV_tRpM1hUKMbX2wMgTfE')" }}></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{headerInfo.title}</h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
            {headerInfo.description}
          </p>
        </div>
      </section>

      {/* Main Grid: Details on Left, Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info cards */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {loadingInfo || !contactInfo ? (
            <div className="flex justify-center py-10 bg-surface border border-outline-variant rounded-xl h-[300px] items-center">
              <Loader2 className="w-8 h-8 animate-spin text-secondary" />
            </div>
          ) : (
            <>
              {/* Email Card */}
              <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Email</h3>
                    <p className="font-sans text-base md:text-lg font-bold text-primary truncate mt-0.5">{contactInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Telefone</h3>
                    <p className="font-sans text-base md:text-lg font-bold text-primary mt-0.5">{contactInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Endereço</h3>
                    <p className="font-sans text-sm md:text-base text-primary font-semibold mt-0.5 leading-relaxed whitespace-pre-line">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Instagram Card */}
              <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300">
                    <AtSign className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Instagram</h3>
                    <a href={formatInstagramUrl(contactInfo.instagram_url)} target="_blank" rel="noopener noreferrer" className="font-sans text-base md:text-lg font-bold text-primary mt-0.5 hover:underline truncate block">
                      Acessar Perfil
                    </a>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              {contactInfo.whatsapp_url && (
                <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[#25D366]"></div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-colors duration-300">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">WhatsApp</h3>
                      <a href={formatWhatsappUrl(contactInfo.whatsapp_url)} target="_blank" rel="noopener noreferrer" className="font-sans text-base md:text-lg font-bold text-primary mt-0.5 hover:underline truncate block">
                        Falar no WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Form Container */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm relative">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
          <h2 className="font-sans text-xl md:text-2xl font-extrabold text-primary mb-6">Envie uma Mensagem</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold" htmlFor="nome">
                  Nome Completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold" htmlFor="email">
                  E-mail Corporativo
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                  placeholder="seu@municipio.gov.br"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold" htmlFor="assunto">
                Assunto
              </label>
              <input
                id="assunto"
                type="text"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                placeholder="Como podemos ajudar?"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface font-bold" htmlFor="mensagem">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-3 font-sans text-sm text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all resize-none"
                placeholder="Detalhe sua necessidade..."
                rows={5}
                required
              ></textarea>
            </div>

            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200 w-full col-span-full">
                {submitError}
              </div>
            )}

            {/* Submit & Status */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-primary hover:bg-secondary text-on-primary py-3 px-8 rounded font-mono text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow hover:shadow-md disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-2 text-green-700 bg-green-100/80 border border-green-200 px-4 py-2.5 rounded-lg text-xs font-semibold"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700" />
                    <span>Mensagem enviada com sucesso!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>

      {/* Map visual section */}
      <section className="w-full h-80 bg-surface-container border border-outline-variant rounded-2xl relative overflow-hidden shadow-sm group">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant z-10 bg-surface/40 backdrop-blur-sm pointer-events-none text-center">
          <Map className="w-12 h-12 mb-2 text-secondary animate-pulse" />
          <h3 className="font-sans text-lg font-bold text-primary">Visualização do Mapa</h3>
          <p className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">{contactInfo?.coords || 'Santo Estevão - BA'}</p>
        </div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-102 transition-transform duration-700" 
          style={{ backgroundImage: `url('${headerInfo.map_image_url}')` }}
          aria-label="Mapa de Santo Estevão - BA"
          referrerPolicy="no-referrer"
        ></div>
      </section>
    </motion.div>
  );
}
