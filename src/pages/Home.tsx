import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { 
  ArrowRight, 
  ShieldCheck, 
  LineChart, 
  Users, 
  FileText, 
  Cpu, 
  CheckCircle, 
  Activity, 
  HeartPulse,
  Loader2
} from 'lucide-react';
import { useModalStore } from '../store/useModalStore';

// Default content as fallback if DB has no data yet
const DEFAULT_HERO = {
  badge: 'WSMF Gestão em Saúde Consultoria Ltda.',
  title_line1: 'PORTFÓLIO',
  title_line2: 'INSTITUCIONAL',
  description: 'Soluções Inteligentes em Vigilância Epidemiológica, Mapeamento de Risco e Controle Eficiente de Endemias.',
  image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAERoNjKBmijw-0AB6VkFoSgYq2D0sLiYqaBTMEjBmSDc9PyNUAXQYrbv2WmOz2LV-VZhHAeAt3dd62fvfp74u-NatiIkA2JPfkiCTc9ESbS3302C4uRrXlHtuVLSmztoD-t81p0PdF9D2T0WanjJbLRqqlKTGFZdMjFvoRFF7Yr2TobZ3oSlUxVWyAWJQvkgmMTAxy3JHAFIvJMvFmIpniI5v55wkpSEKUVSipwr7XaHzRzmWTF7-WG9nx2Setrsutn51TgoWSLuA',
  cta_primary: 'Conheça a Consultoria',
  cta_secondary: 'Fale Conosco',
};

const DEFAULT_ABOUT = {
  title: 'QUEM SOMOS',
  description: 'A WSMF Gestão em Saúde é uma consultoria altamente especializada em oferecer suporte técnico, operacional e tecnológico para secretarias de saúde no combate de endemias. Nosso principal propósito é transformar dados coletados em campo em estratégias integradas de prevenção, capacitando gestores e equipes para uma atuação rápida, precisa e altamente eficiente no controle de vetores e zoonoses.',
  stat1_title: 'Dados em Estratégia',
  stat1_desc: 'Análise epidemiológica avançada aplicada.',
  stat2_title: 'Capacitação',
  stat2_desc: 'Treinamento prático de equipes municipais.',
};

const DEFAULT_TEASERS = {
  section_title: 'Eixos de Atuação',
  section_description: 'Integramos metodologias consolidadas no setor público com tecnologia de ponta para estruturar a vigilância ativa em seu município.',
  teaser1_title: 'Nossos Serviços',
  teaser1_description: 'Oferecemos assessoria estratégica contínua, incluindo diagnóstico epidemiológico municipal, estruturação de planos de contingência técnica, geoprocessamento inteligente e análise detalhada para secretarias de saúde.',
  teaser1_badge: 'Consultoria Técnica',
  teaser1_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtlHskb0S5xzXmjxX8tjrfeZWqvs0311hfv7XDWq9n1bkVIHehrgMjeSXazcDS-DiY-aCbRis9BGwdO618uKwN0x2n0HqqjFrlfqmX3rlsjgrXFx8f-rDsrO2MbFDT7f74coI0W2j2daBH2S1Noj2ijePlbPAVUCgfpYZ8HzxLWk2nLlaiJomOnZHlg8Tb6Uw-d4287g3tc6vV5i0DQ_gwvfIez6d6WbBh0C-VguAUmuBz4fKo1Bsqmdgo9MArIjEl3ISWyvrJ8mQ',
  teaser2_title: 'Tecnologia SisEndemias',
  teaser2_description: 'Implementamos sistemas integrados e ferramentas exclusivas de mapeamento de vetores em campo. Otimizamos a comunicação das equipes de controle de vetores com a central técnica do município de forma inovadora.',
  teaser2_badge: 'Inovação Digital',
  teaser2_image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlM-D59DZoa8nLxk0lO6ppV9nLq11wrZPgP66y5DUSpb4gpbohjkleYlBkFQjD33XIfCRlpYVcES3q1QwWXHwbz4c_9ekiqP7JDk9r5qbwRNcPWnvHi9KZDDvMZh_Y6hWv1lwSzkHsk_ehVqybMpsiKM-EofZWqfydjdA6KZSVO8NWwH-NqHuYBgSL1yj3_FFuFGa2_icdX1BvBu0b_orIUdF1MEOrSTNYhB31NyISV-M5wOSAzOeY-z5f_AQs8dYt1EwhvtwUaGQ',
};

export default function Home() {
  const navigate = useNavigate();
  const openBudgetModal = useModalStore((state) => state.openBudgetModal);
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [teasers, setTeasers] = useState(DEFAULT_TEASERS);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await supabase
          .from('content_blocks')
          .select('section_name, content')
          .in('section_name', ['home_hero', 'home_about', 'home_teasers']);

        if (data) {
          data.forEach(block => {
            if (block.section_name === 'home_hero' && block.content) setHero({ ...DEFAULT_HERO, ...block.content });
            if (block.section_name === 'home_about' && block.content) setAbout({ ...DEFAULT_ABOUT, ...block.content });
            if (block.section_name === 'home_teasers' && block.content) setTeasers({ ...DEFAULT_TEASERS, ...block.content });
          });
        }
      } catch (err) {
        console.error('Error fetching home content:', err);
      }
    };
    fetchContent();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full"
    >
      {/* Hero Section */}
      <section className="hero-pattern relative overflow-hidden text-on-primary">
        {/* Background Map Grid Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#aec7f6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect fill="url(#grid)" width="100%" height="100%" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="inline-block bg-primary-container text-inverse-primary font-mono text-[10px] md:text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-inverse-primary/10 mb-2">
              {hero.badge}
            </div>
            
            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {hero.title_line1} <br />
              <span className="text-secondary-fixed-dim">{hero.title_line2}</span>
            </h1>

            <p className="font-sans text-lg md:text-xl text-primary-fixed-dim max-w-lg leading-relaxed">
              {hero.description}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/servicos')}
                className="bg-secondary hover:bg-secondary-container text-on-secondary font-mono text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded transition-all duration-200 shadow hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                {hero.cta_primary}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/contato')}
                className="border border-outline-variant hover:border-white text-on-primary font-mono text-xs uppercase tracking-wider font-semibold px-6 py-3.5 rounded hover:bg-white/5 transition-all cursor-pointer"
              >
                {hero.cta_secondary}
              </button>
            </div>
          </motion.div>

          {/* Hero Image Block */}
          <motion.div 
            variants={itemVariants}
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border border-inverse-primary/10 bg-primary-container"
          >
            <img 
              alt="Agente de Combate às Endemias em campo utilizando tablet" 
              className="object-cover w-full h-full object-center hover:scale-105 transition-transform duration-700" 
              src={hero.image_url}
              referrerPolicy="no-referrer"
            />
            {/* Tech Overlay lines */}
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="30" r="1.5" fill="#aec7f6" className="animate-pulse" />
                <circle cx="70" cy="20" r="1.5" fill="#aec7f6" className="animate-pulse" />
                <circle cx="85" cy="60" r="1.5" fill="#aec7f6" className="animate-pulse" />
                <circle cx="45" cy="80" r="1.5" fill="#aec7f6" className="animate-pulse" />
                <path d="M 20 30 L 70 20 L 85 60 L 45 80 Z" fill="none" stroke="#aec7f6" strokeDasharray="2,2" strokeWidth="0.5" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Waves effect on footer of hero */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-1">
          <svg className="relative block w-full h-12 md:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.31,192.39,109.84Z" fill="#f9f9ff"></path>
          </svg>
        </div>
      </section>

      {/* Quem Somos Bento Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main About block */}
            <motion.div 
              variants={itemVariants}
              className="lg:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant p-8 md:p-12 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
              <div className="flex items-start gap-6">
                <div className="hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-surface-container text-primary shrink-0">
                  <ShieldCheck className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-primary mb-4">
                    {about.title}
                  </h2>
                  <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
                    {about.description}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Side Stats/Pillars */}
            <div className="lg:col-span-4 grid grid-rows-2 gap-6">
              <motion.div 
                variants={itemVariants}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex items-center gap-4 hover:border-secondary transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <LineChart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-primary">{about.stat1_title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant mt-0.5">{about.stat1_desc}</p>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex items-center gap-4 hover:border-secondary transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container/10 text-secondary flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-bold text-primary">{about.stat2_title}</h3>
                  <p className="font-sans text-sm text-on-surface-variant mt-0.5">{about.stat2_desc}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Tech Teasers */}
      <section className="py-24 bg-surface-container-low border-y border-outline-variant/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-sans text-3xl font-extrabold text-primary tracking-tight">{teasers.section_title}</h2>
            <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              {teasers.section_description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Services Teaser */}
            <motion.div 
              variants={itemVariants}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-52 bg-primary relative overflow-hidden">
                <img 
                  className="object-cover w-full h-full opacity-85 group-hover:scale-105 transition-transform duration-500" 
                  alt="Planejamento estratégico de saúde" 
                  src={teasers.teaser1_image_url}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 backdrop-blur-sm px-3.5 py-1.5 rounded font-mono text-xs text-primary flex items-center gap-2 font-semibold shadow border border-outline-variant/30">
                  <FileText className="w-4 h-4 text-secondary" /> {teasers.teaser1_badge}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-sans text-xl font-bold text-primary mb-3">{teasers.teaser1_title}</h3>
                <p className="font-sans text-sm text-on-surface-variant mb-6 flex-1 leading-relaxed">
                  {teasers.teaser1_description}
                </p>
                <button 
                  onClick={() => navigate('/servicos')}
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary-container font-mono text-xs uppercase tracking-wider font-bold transition-all mt-auto group/btn cursor-pointer"
                >
                  Ver todos os serviços 
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Tech Teaser */}
            <motion.div 
              variants={itemVariants}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="h-52 bg-primary-container relative overflow-hidden">
                <img 
                  className="object-cover w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-500" 
                  alt="Dashboard tecnológico SisEndemias" 
                  src={teasers.teaser2_image_url}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-4 left-4 bg-surface-container-lowest/95 backdrop-blur-sm px-3.5 py-1.5 rounded font-mono text-xs text-primary flex items-center gap-2 font-semibold shadow border border-outline-variant/30">
                  <Cpu className="w-4 h-4 text-secondary" /> {teasers.teaser2_badge}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="font-sans text-xl font-bold text-primary mb-3">{teasers.teaser2_title}</h3>
                <p className="font-sans text-sm text-on-surface-variant mb-6 flex-1 leading-relaxed">
                  {teasers.teaser2_description}
                </p>
                <button 
                  onClick={() => navigate('/tecnologia')}
                  className="inline-flex items-center gap-2 text-secondary hover:text-secondary-container font-mono text-xs uppercase tracking-wider font-bold transition-all mt-auto group/btn cursor-pointer"
                >
                  Conhecer solução exclusiva 
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Status Indicators / Credibility Bar */}
      <section className="bg-surface-container border-y border-outline-variant py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-sans text-lg font-bold text-primary">Prevenção</div>
              <div className="font-mono text-xs text-on-surface-variant tracking-wide">Foco Proativo</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-sans text-lg font-bold text-primary">Precisão</div>
              <div className="font-mono text-xs text-on-surface-variant tracking-wide">Dados Confiáveis</div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <div className="font-sans text-lg font-bold text-primary">Controle</div>
              <div className="font-mono text-xs text-on-surface-variant tracking-wide">Vigilância Ativa</div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
