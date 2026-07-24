import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Service } from '../types';
import { 
  ShieldAlert, 
  Map, 
  Bug, 
  GraduationCap, 
  Check, 
  Circle, 
  CheckCircle2, 
  Truck,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useModalStore } from '../store/useModalStore';

const DEFAULT_HEADER = {
  badge: 'Soluções Integradas',
  title: 'Nossos Serviços',
  description: 'Oferecemos soluções metodológicas robustas e assessoria completa para secretarias municipais de saúde, viabilizando decisões pautadas em evidências epidemiológicas.',
  cta_title: 'Deseja customizar os serviços para o seu município?',
  cta_description: 'Nossa assessoria técnica analisa o histórico epidemiológico, quantitativo populacional e territorial para dimensionar a proposta ideal.'
};

export default function Services() {
  const openBudgetModal = useModalStore(state => state.openBudgetModal);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [header, setHeader] = useState(DEFAULT_HEADER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('section_name, content')
          .in('section_name', ['services_data', 'services_header']);
          
        if (error) throw error;
        if (data) {
          data.forEach(block => {
            if (block.section_name === 'services_data' && block.content) setServicesData(block.content as Service[]);
            if (block.section_name === 'services_header' && block.content) setHeader({ ...DEFAULT_HEADER, ...block.content });
          });
        }
      } catch (error) {
        console.error('Error fetching services content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);

  // Map string icon names to Lucide icon components
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    ShieldAlert: ShieldAlert,
    Map: Map,
    Bug: Bug,
    GraduationCap: GraduationCap
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full py-12 md:py-16 max-w-7xl mx-auto px-6 space-y-12 min-h-screen"
    >
      {/* Header section */}
      <header className="text-center md:text-left space-y-4">
        <div className="inline-block bg-secondary/10 text-secondary font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
          {header.badge}
        </div>
        <h1 className="font-sans text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
          {header.title}
        </h1>
        <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {header.description}
        </p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-secondary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Service 1: Estratificação de Risco (Span 12 for detail density, or span 8 to match design mockup) */}
          {servicesData.filter(s => s.id === 1).map((service) => {
            const IconComponent = iconMap[service.icon] || ShieldAlert;
            return (
              <motion.article 
                key={service.id}
                variants={itemVariants}
                className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm relative group hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-surface-container rounded-2xl flex items-center justify-center text-secondary shadow-inner">
                      <IconComponent className="w-8 h-8" />
                    </div>
                  </div>
                  <div className="space-y-6 flex-grow">
                    <div>
                      <h2 className="font-sans text-xl md:text-2xl font-extrabold text-primary flex items-center gap-2">
                        <span className="text-secondary">1.</span> {service.title}
                      </h2>
                      <p className="text-on-surface-variant text-sm md:text-base mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                      {service.details?.map((detail, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-start gap-2">
                            <Circle className="w-4 h-4 text-secondary shrink-0 mt-1 fill-secondary/20" />
                            <h3 className="font-sans font-bold text-primary text-sm">
                              {detail.title}
                            </h3>
                          </div>
                          <p className="text-xs text-on-surface-variant leading-relaxed pl-6">
                            {detail.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {/* Service 2: Reconhecimento Geográfico (Span 4 to match mockup) */}
          {servicesData.filter(s => s.id === 2).map((service) => {
            const IconComponent = iconMap[service.icon] || Map;
            return (
              <motion.article 
                key={service.id}
                variants={itemVariants}
                className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-2xl overflow-hidden shadow-sm relative flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary-fixed-dim"></div>
                
                {/* Technical Grid overlay background */}
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                  <svg width="100%" height="100%">
                    <pattern id="grid-service" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect width="20" height="20" fill="none" stroke="#aec7f6" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-service)" />
                  </svg>
                </div>

                <div className="p-8 space-y-6 relative z-10 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="w-14 h-14 bg-primary-container rounded-2xl flex items-center justify-center text-inverse-primary mb-6 shadow-inner border border-inverse-primary/10">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h2 className="font-sans text-xl font-extrabold">
                      <span className="text-inverse-primary">2.</span> {service.title}
                    </h2>
                    <p className="text-primary-fixed-dim text-sm mt-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-primary-container mt-6">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-container rounded-full text-[10px] font-mono uppercase tracking-wider text-inverse-primary border border-inverse-primary/10 shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-inverse-primary fill-inverse-primary/10" />
                      {service.subtitle || "Base Atualizada"}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}

          {/* Service 3: Monitoramento com Ovitrampas (Span 6 to match mockup) */}
          {servicesData.filter(s => s.id === 3).map((service) => {
            const IconComponent = iconMap[service.icon] || Bug;
            return (
              <motion.article 
                key={service.id}
                variants={itemVariants}
                className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm relative group hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center text-secondary shadow-inner">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h2 className="font-sans text-lg md:text-xl font-extrabold text-primary">
                      <span className="text-secondary">3.</span> {service.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {service.details?.map((detail, idx) => (
                    <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/50">
                      <div className="flex gap-3">
                        <Truck className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-sans font-bold text-primary text-sm">
                            {detail.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                            {detail.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}

          {/* Service 4: Capacitação e Treinamento (Span 6 to match mockup) */}
          {servicesData.filter(s => s.id === 4).map((service) => {
            const IconComponent = iconMap[service.icon] || GraduationCap;
            return (
              <motion.article 
                key={service.id}
                variants={itemVariants}
                className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm relative group hover:shadow-md transition-all"
              >
                <div className="absolute top-0 left-0 w-full h-[3px] bg-secondary"></div>
                <div className="p-8 flex flex-col justify-between h-full space-y-6">
                  <div className="space-y-4">
                    <div className="w-14 h-14 bg-surface-container rounded-2xl flex items-center justify-center text-secondary shadow-inner">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <h2 className="font-sans text-lg md:text-xl font-extrabold text-primary">
                      <span className="text-secondary">4.</span> {service.title}
                    </h2>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <span className="block font-mono text-[10px] uppercase tracking-wider text-secondary font-bold">
                      Tópicos abordados:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-on-surface-variant">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                        Instalação de Ovitrampas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                        Monitoramento de Palhetas
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                        Identificação de Criadouros
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-secondary shrink-0" />
                        Coleta & Leitura de Dados
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.article>
            );
          })}

        </div>
      )}

      {/* Call to Action Footer Panel */}
      <motion.div 
        variants={itemVariants}
        className="bg-surface-container border border-outline-variant rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-sans text-lg md:text-xl font-bold text-primary">
            {header.cta_title}
          </h3>
          <p className="font-sans text-sm text-on-surface-variant max-w-xl leading-relaxed">
            {header.cta_description}
          </p>
        </div>
        <button
          onClick={openBudgetModal}
          className="bg-primary hover:bg-secondary text-on-primary hover:text-white px-8 py-3.5 rounded font-mono text-xs uppercase tracking-wider font-bold shadow hover:shadow-md cursor-pointer transition-all shrink-0 flex items-center gap-2"
        >
          Solicitar Proposta Customizada
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}
