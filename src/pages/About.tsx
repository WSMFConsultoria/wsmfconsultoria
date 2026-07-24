import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Target, Heart, Award, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const DEFAULT_INTRO = {
  badge: 'Nossa Trajetória',
  title: 'Sobre a WSMF Consultoria',
  description_1: 'Nascida com a missão de redefinir o controle de endemias municipais, a WSMF Gestão em Saúde é uma consultoria especializada que combina profundo conhecimento técnico-sanitário com engenharia de software de alta usabilidade.',
  description_2: 'Apoiamos secretarias municipais de saúde com diagnóstico detalhado, assessoria de planejamento técnico e suporte em campo. Acreditamos que a tecnologia e a capacitação continuada das equipes de agentes são as maiores armas para blindar as cidades contra surtos de Dengue, Zika, Chikungunya e outras zoonoses.',
  image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtlHskb0S5xzXmjxX8tjrfeZWqvs0311hfv7XDWq9n1bkVIHehrgMjeSXazcDS-DiY-aCbRis9BGwdO618uKwN0x2n0HqqjFrlfqmX3rlsjgrXFx8f-rDsrO2MbFDT7f74coI0W2j2daBH2S1Noj2ijePlbPAVUCgfpYZ8HzxLWk2nLlaiJomOnZHlg8Tb6Uw-d4287g3tc6vV5i0DQ_gwvfIez6d6WbBh0C-VguAUmuBz4fKo1Bsqmdgo9MArIjEl3ISWyvrJ8mQ',
};

const DEFAULT_VALUES = [
  { icon: 'ShieldCheck', title: 'Compromisso Ético', description: 'Atuação transparente com prefeituras municipais, prezando pela conformidade e as boas práticas de saúde pública.' },
  { icon: 'Target', title: 'Foco', description: 'Nossa metodologia é orientada para a redução real dos índices de infestação vetorial e prevenção de surtos.' },
  { icon: 'Heart', title: 'Valorização Humana', description: 'Capacitamos e humanizamos o trabalho dos Agentes de Combate a Endemias (ACE), os heróis do cotidiano da saúde.' },
  { icon: 'Award', title: 'Inovação Responsável', description: 'Integramos tecnologia móvel de forma intuitiva, respeitando a realidade operacional e a inclusão das equipes.' },
];

const iconMap: Record<string, React.ComponentType<any>> = {
  ShieldCheck, Target, Heart, Award,
};

export default function About() {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<{question: string, answer: string}[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [intro, setIntro] = useState(DEFAULT_INTRO);
  const [values, setValues] = useState(DEFAULT_VALUES);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await supabase
          .from('content_blocks')
          .select('section_name, content')
          .in('section_name', ['faqs', 'about_intro', 'about_values']);

        if (data) {
          data.forEach(block => {
            if (block.section_name === 'faqs' && block.content) setFaqs(block.content);
            if (block.section_name === 'about_intro' && block.content) setIntro({ ...DEFAULT_INTRO, ...block.content });
            if (block.section_name === 'about_values' && Array.isArray(block.content)) setValues(block.content);
          });
        }
      } catch (error) {
        console.error('Error fetching about content:', error);
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchContent();
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
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
      className="w-full max-w-7xl mx-auto px-6 py-12 md:py-16 space-y-16"
    >
      {/* Introduction block */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-block bg-secondary/10 text-secondary font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
            {intro.badge}
          </div>
          <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
            {intro.title}
          </h1>
          <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
            {intro.description_1}
          </p>
          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
            {intro.description_2}
          </p>
        </div>

        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-outline-variant aspect-[4/3] bg-surface-container-low">
          <img 
            className="w-full h-full object-cover" 
            alt="Reunião de consultoria e planejamento estratégico" 
            src={intro.image_url}
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* Core Values values list */}
      <section className="space-y-10">
        <h2 className="font-sans text-2xl font-extrabold text-primary flex items-center gap-4">
          <span className="w-10 h-1 bg-secondary rounded-full"></span>
          Nossos Valores
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const IconComponent = iconMap[val.icon] || ShieldCheck;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:shadow-sm transition-shadow relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary shadow-inner">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-bold text-primary text-base">
                    {val.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="space-y-8 bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-10 shadow-sm">
        <div className="text-center md:text-left space-y-2">
          <h2 className="font-sans text-2xl font-extrabold text-primary">Perguntas Frequentes (FAQ)</h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Esclareça suas principais dúvidas sobre o escopo de atuação e as soluções da WSMF Consultoria.
          </p>
        </div>

        {loadingFaqs ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto pt-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left font-sans font-bold text-primary text-sm md:text-base hover:bg-surface-container-low/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-secondary shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-on-surface-variant shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-surface-container-lowest"
                      >
                        <div className="p-5 pt-0 text-sm text-on-surface-variant leading-relaxed border-t border-primary/5 font-sans">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </motion.div>
  );
}
