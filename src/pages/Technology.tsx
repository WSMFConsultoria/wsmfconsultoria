import React from 'react';
import { motion } from 'motion/react';
import { sisEndemiasSteps } from '../data';
import { 
  Tablet, 
  Database, 
  Wifi, 
  RefreshCw, 
  CheckCircle2
} from 'lucide-react';

export default function Technology() {
  const iconMap: { [key: string]: React.ComponentType<any> } = {
    Tablet: Tablet,
    Database: Database,
    Wifi: Wifi
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
      className="w-full py-12 md:py-16 max-w-7xl mx-auto px-6 space-y-16"
    >
      {/* Intro Hero Section */}
      <section className="bg-primary text-on-primary rounded-3xl overflow-hidden shadow-xl relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-secondary-container/10 border border-white/10 text-secondary-fixed-dim px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider">
              Tecnologia Proprietária
            </div>
            <h1 className="font-sans text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
              SISTEMA SISENDEMIAS
            </h1>
            <p className="font-sans text-base md:text-lg text-slate-200 leading-relaxed">
              Uma solução tecnológica exclusiva para modernizar o trabalho de campo e agilizar a gestão administrativa, otimizando as atividades dos Agentes de Combate às Endemias (ACE).
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Wifi className="w-6 h-6 text-secondary-fixed-dim shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">Coleta Híbrida</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">Funcionamento prático e seguro em modo online e offline.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <RefreshCw className="w-6 h-6 text-secondary-fixed-dim shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">Sincronização Ativa</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">Dados atualizados automaticamente com o banco central.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <Database className="w-6 h-6 text-secondary-fixed-dim shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">Integração MS</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">Agilidade no envio de informações ao Ministério da Saúde.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-secondary-fixed-dim shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-sm">Alta Confiabilidade</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">Mais eficiência nas ações de vigilância e controle de endemias.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-primary-container flex items-center justify-center">
              <img 
                className="w-full h-full object-cover opacity-60 mix-blend-luminosity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlM-D59DZoa8nLxk0lO6ppV9nLq11wrZPgP66y5DUSpb4gpbohjkleYlBkFQjD33XIfCRlpYVcES3q1QwWXHwbz4c_9ekiqP7JDk9r5qbwRNcPWnvHi9KZDDvMZh_Y6hWv1lwSzkHsk_ehVqybMpsiKM-EofZWqfydjdA6KZSVO8NWwH-NqHuYBgSL1yj3_FFuFGa2_icdX1BvBu0b_orIUdF1MEOrSTNYhB31NyISV-M5wOSAzOeY-z5f_AQs8dYt1EwhvtwUaGQ"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <RefreshCw className={`w-14 h-14 text-secondary-fixed-dim animate-pulse`} />
                <h3 className="font-sans text-lg font-bold text-on-primary uppercase tracking-wide">Sincronização Segura de Dados</h3>
                <p className="font-mono text-xs text-primary-fixed-dim uppercase tracking-widest leading-relaxed">
                  Informações Protegidas,<br />Decisões Eficientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona section */}
      <section className="space-y-12">
        <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-primary flex items-center gap-4">
          <span className="w-10 h-1 bg-secondary rounded-full"></span>
          COMO FUNCIONA:
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sisEndemiasSteps.map((step, idx) => {
            const IconComponent = iconMap[step.icon] || Tablet;
            return (
              <motion.div 
                key={step.step}
                variants={itemVariants}
                className="bg-surface-container-lowest border border-outline-variant p-8 rounded-2xl shadow-sm relative group hover:shadow-md transition-shadow border-t-2 border-t-secondary"
              >
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-colors duration-300 shadow-inner">
                  <IconComponent className="w-7 h-7" />
                </div>
                <h3 className="font-sans text-lg font-bold text-primary mb-2">
                  {step.step}. {step.title}
                </h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Banner Exclusivo Section */}
      <section className="w-full mt-16 rounded-3xl overflow-hidden shadow-2xl border border-outline-variant">
        <img 
          src="/banner-sisendemias.jpg" 
          alt="Tecnologia Exclusiva Sistema SisEndemias" 
          className="w-full h-auto object-cover"
        />
      </section>
    </motion.div>
  );
}
