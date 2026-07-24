-- Migration: Adicionar blocos de conteúdo editáveis para TODAS as páginas
-- Permite que o admin edite textos, fotos e seções de cada página

DO $$
DECLARE
  v_page_home UUID;
  v_page_servicos UUID;
  v_page_tecnologia UUID;
  v_page_sobre UUID;
  v_page_contato UUID;
BEGIN
  SELECT id INTO v_page_home FROM public.pages WHERE slug = 'home';
  SELECT id INTO v_page_servicos FROM public.pages WHERE slug = 'servicos';
  SELECT id INTO v_page_tecnologia FROM public.pages WHERE slug = 'tecnologia';
  SELECT id INTO v_page_sobre FROM public.pages WHERE slug = 'sobre';
  SELECT id INTO v_page_contato FROM public.pages WHERE slug = 'contato';

  -- =============================================
  -- HOME PAGE
  -- =============================================

  -- Hero Section
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_home, 'home_hero', 'json', '{
    "badge": "WSMF Gestão em Saúde Consultoria Ltda.",
    "title_line1": "PORTFÓLIO",
    "title_line2": "INSTITUCIONAL",
    "description": "Soluções Inteligentes em Vigilância Epidemiológica, Mapeamento de Risco e Controle Eficiente de Endemias.",
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAERoNjKBmijw-0AB6VkFoSgYq2D0sLiYqaBTMEjBmSDc9PyNUAXQYrbv2WmOz2LV-VZhHAeAt3dd62fvfp74u-NatiIkA2JPfkiCTc9ESbS3302C4uRrXlHtuVLSmztoD-t81p0PdF9D2T0WanjJbLRqqlKTGFZdMjFvoRFF7Yr2TobZ3oSlUxVWyAWJQvkgmMTAxy3JHAFIvJMvFmIpniI5v55wkpSEKUVSipwr7XaHzRzmWTF7-WG9nx2Setrsutn51TgoWSLuA",
    "cta_primary": "Conheça a Consultoria",
    "cta_secondary": "Fale Conosco"
  }', 0)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- About Section (Quem Somos on home)
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_home, 'home_about', 'json', '{
    "title": "QUEM SOMOS",
    "description": "A WSMF Gestão em Saúde é uma consultoria altamente especializada em oferecer suporte técnico, operacional e tecnológico para secretarias de saúde no combate de endemias. Nosso principal propósito é transformar dados coletados em campo em estratégias integradas de prevenção, capacitando gestores e equipes para uma atuação rápida, precisa e altamente eficiente no controle de vetores e zoonoses.",
    "stat1_title": "Dados em Estratégia",
    "stat1_desc": "Análise epidemiológica avançada aplicada.",
    "stat2_title": "Capacitação",
    "stat2_desc": "Treinamento prático de equipes municipais."
  }', 1)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- Teasers Section
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_home, 'home_teasers', 'json', '{
    "section_title": "Eixos de Atuação",
    "section_description": "Integramos metodologias consolidadas no setor público com tecnologia de ponta para estruturar a vigilância ativa em seu município.",
    "teaser1_title": "Nossos Serviços",
    "teaser1_description": "Oferecemos assessoria estratégica contínua, incluindo diagnóstico epidemiológico municipal, estruturação de planos de contingência técnica, geoprocessamento inteligente e análise detalhada para secretarias de saúde.",
    "teaser1_badge": "Consultoria Técnica",
    "teaser1_image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBtlHskb0S5xzXmjxX8tjrfeZWqvs0311hfv7XDWq9n1bkVIHehrgMjeSXazcDS-DiY-aCbRis9BGwdO618uKwN0x2n0HqqjFrlfqmX3rlsjgrXFx8f-rDsrO2MbFDT7f74coI0W2j2daBH2S1Noj2ijePlbPAVUCgfpYZ8HzxLWk2nLlaiJomOnZHlg8Tb6Uw-d4287g3tc6vV5i0DQ_gwvfIez6d6WbBh0C-VguAUmuBz4fKo1Bsqmdgo9MArIjEl3ISWyvrJ8mQ",
    "teaser2_title": "Tecnologia SisEndemias",
    "teaser2_description": "Implementamos sistemas integrados e ferramentas exclusivas de mapeamento de vetores em campo. Otimizamos a comunicação das equipes de controle de vetores com a central técnica do município de forma inovadora.",
    "teaser2_badge": "Inovação Digital",
    "teaser2_image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBlM-D59DZoa8nLxk0lO6ppV9nLq11wrZPgP66y5DUSpb4gpbohjkleYlBkFQjD33XIfCRlpYVcES3q1QwWXHwbz4c_9ekiqP7JDk9r5qbwRNcPWnvHi9KZDDvMZh_Y6hWv1lwSzkHsk_ehVqybMpsiKM-EofZWqfydjdA6KZSVO8NWwH-NqHuYBgSL1yj3_FFuFGa2_icdX1BvBu0b_orIUdF1MEOrSTNYhB31NyISV-M5wOSAzOeY-z5f_AQs8dYt1EwhvtwUaGQ"
  }', 2)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- =============================================
  -- ABOUT PAGE
  -- =============================================
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_sobre, 'about_intro', 'json', '{
    "badge": "Nossa Trajetória",
    "title": "Sobre a WSMF Consultoria",
    "description_1": "Nascida com a missão de redefinir o controle de endemias municipais, a WSMF Gestão em Saúde é uma consultoria especializada que combina profundo conhecimento técnico-sanitário com engenharia de software de alta usabilidade.",
    "description_2": "Apoiamos secretarias municipais de saúde com diagnóstico detalhado, assessoria de planejamento técnico e suporte em campo. Acreditamos que a tecnologia e a capacitação continuada das equipes de agentes são as maiores armas para blindar as cidades contra surtos de Dengue, Zika, Chikungunya e outras zoonoses.",
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBtlHskb0S5xzXmjxX8tjrfeZWqvs0311hfv7XDWq9n1bkVIHehrgMjeSXazcDS-DiY-aCbRis9BGwdO618uKwN0x2n0HqqjFrlfqmX3rlsjgrXFx8f-rDsrO2MbFDT7f74coI0W2j2daBH2S1Noj2ijePlbPAVUCgfpYZ8HzxLWk2nLlaiJomOnZHlg8Tb6Uw-d4287g3tc6vV5i0DQ_gwvfIez6d6WbBh0C-VguAUmuBz4fKo1Bsqmdgo9MArIjEl3ISWyvrJ8mQ"
  }', 0)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_sobre, 'about_values', 'json', '[
    { "icon": "ShieldCheck", "title": "Compromisso Ético", "description": "Atuação transparente com prefeituras municipais, prezando pela conformidade e as boas práticas de saúde pública." },
    { "icon": "Target", "title": "Foco", "description": "Nossa metodologia é orientada para a redução real dos índices de infestação vetorial e prevenção de surtos." },
    { "icon": "Heart", "title": "Valorização Humana", "description": "Capacitamos e humanizamos o trabalho dos Agentes de Combate a Endemias (ACE), os heróis do cotidiano da saúde." },
    { "icon": "Award", "title": "Inovação Responsável", "description": "Integramos tecnologia móvel de forma intuitiva, respeitando a realidade operacional e a inclusão das equipes." }
  ]', 1)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- =============================================
  -- TECHNOLOGY PAGE
  -- =============================================
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_tecnologia, 'tech_hero', 'json', '{
    "badge": "Tecnologia Proprietária",
    "title": "SISTEMA SISENDEMIAS",
    "description": "Uma solução tecnológica exclusiva para modernizar o trabalho de campo e agilizar a gestão administrativa, otimizando as atividades dos Agentes de Combate às Endemias (ACE).",
    "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBlM-D59DZoa8nLxk0lO6ppV9nLq11wrZPgP66y5DUSpb4gpbohjkleYlBkFQjD33XIfCRlpYVcES3q1QwWXHwbz4c_9ekiqP7JDk9r5qbwRNcPWnvHi9KZDDvMZh_Y6hWv1lwSzkHsk_ehVqybMpsiKM-EofZWqfydjdA6KZSVO8NWwH-NqHuYBgSL1yj3_FFuFGa2_icdX1BvBu0b_orIUdF1MEOrSTNYhB31NyISV-M5wOSAzOeY-z5f_AQs8dYt1EwhvtwUaGQ",
    "feature1_title": "Coleta Híbrida",
    "feature1_desc": "Funcionamento prático e seguro em modo online e offline.",
    "feature2_title": "Sincronização Ativa",
    "feature2_desc": "Dados atualizados automaticamente com o banco central.",
    "feature3_title": "Integração MS",
    "feature3_desc": "Agilidade no envio de informações ao Ministério da Saúde.",
    "feature4_title": "Alta Confiabilidade",
    "feature4_desc": "Mais eficiência nas ações de vigilância e controle de endemias.",
    "banner_image_url": "/banner-sisendemias.jpeg"
  }', 0)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- =============================================
  -- CONTACT PAGE
  -- =============================================
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_contato, 'contact_header', 'json', '{
    "title": "Entre em Contato",
    "description": "A WSMF Gestão em Saúde Consultoria Ltda. está totalmente pronta para ser a parceria estratégica ideal do seu município na consolidação das diretrizes de saúde pública.",
    "map_image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBG5fhH3OWC6n4XE5gbuS8i0uUUo71ROV8znmXorLfsd_57ieUxJgMzNP4Lq0dt1xg1erPpOJWNwkJkozHHVpUyUUNg8pkjSlloUsa-qPjYXBmClpF9-cJsLN3JnEHwpX28XQKCoI9wMZV5jHRhtSQA-mzmd-McC-OPWtH7BfNoEXRSkA8tol4qPT3v9kxEEpDVwPBjL-152JAH-EFkFFQQr-XYhH-xJ7hWYh58WnC4gz5WwPXkIyn25fWL7gTn_NwWIFrbaX35uEQ"
  }', 0)
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- =============================================
  -- SERVICES PAGE
  -- =============================================
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content, order_index)
  VALUES (v_page_servicos, 'services_header', 'json', '{
    "badge": "Soluções Integradas",
    "title": "Nossos Serviços",
    "description": "Oferecemos soluções metodológicas robustas e assessoria completa para secretarias municipais de saúde, viabilizando decisões pautadas em evidências epidemiológicas.",
    "cta_title": "Deseja customizar os serviços para o seu município?",
    "cta_description": "Nossa assessoria técnica analisa o histórico epidemiológico, quantitativo populacional e territorial para dimensionar a proposta ideal."
  }', 0)
  ON CONFLICT (page_id, section_name) DO NOTHING;

END $$;
