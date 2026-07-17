-- Insert initial pages
INSERT INTO public.pages (slug, title, meta_description, is_active)
VALUES
  ('home', 'Página Inicial', 'A WSMF Consultoria é especializada em gestão de saúde pública e endemias.', TRUE),
  ('servicos', 'Nossos Serviços', 'Conheça as frentes de trabalho da WSMF.', TRUE),
  ('tecnologia', 'Tecnologia SisEndemias', 'O SisEndemias revoluciona o trabalho em campo.', TRUE),
  ('sobre', 'Sobre Nós', 'Saiba mais sobre a nossa história e missão.', TRUE),
  ('contato', 'Contato / Informações Gerais', 'Entre em contato com a WSMF.', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- We need to fetch page UUIDs for the content blocks.
-- We will use a DO block to insert content_blocks correctly.

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

  -- SERVICES_DATA
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content)
  VALUES (v_page_servicos, 'services_data', 'json', '[
    {
      "id": 1,
      "title": "ESTRATIFICAÇÃO DE RISCO",
      "description": "Realizamos a análise profunda dos indicadores de saúde dos municípios contratados para identificar áreas de vulnerabilidade.",
      "icon": "ShieldAlert",
      "details": [
        { "title": "Identificação de Localidades", "description": "Mapeamento detalhado de bairros e regiões com alto risco endêmico." },
        { "title": "Relatórios Estratégicos", "description": "Elaboração de documentos técnicos com diagnósticos precisos, facilitando a tomada de decisão da gestão municipal." }
      ]
    },
    {
      "id": 2,
      "title": "RECONHECIMENTO GEOGRÁFICO (RG)",
      "description": "Atualização e organização da base territorial urbana e rural, essencial para o planejamento das visitas domiciliares e ciclos de tratamento.",
      "icon": "Map",
      "subtitle": "Base Atualizada"
    },
    {
      "id": 3,
      "title": "MONITORAMENTO COM OVITRAMPAS",
      "description": "Implementação de armadilhas de oviposição (ovitrampas) para detecção precoce da presença do Aedes aegypti.",
      "icon": "Bug",
      "details": [
        { "title": "Logística Completa", "description": "Oferecemos todo o material necessário para a execução das atividades em campo." }
      ]
    },
    {
      "id": 4,
      "title": "CAPACITAÇÃO E TREINAMENTO",
      "description": "Treinamento técnico para Agentes de Combate a Endemias (ACE), capacitando as equipes municipais.",
      "icon": "GraduationCap",
      "details": [
        { "title": "Frentes de Capacitação", "description": "Instalação e monitoramento de ovitrampas, identificação de focos e criadouros, coleta e registro de dados, e planejamento estratégico de campo." }
      ]
    }
  ]')
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- SIS_ENDEMIAS_STEPS
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content)
  VALUES (v_page_tecnologia, 'sis_endemias_steps', 'json', '[
    {
      "step": "1",
      "title": "Coleta via tablet",
      "description": "Registro de informações diretamente em campo pelas equipes, eliminando papel, planilhas avulsas e retrabalho de digitação.",
      "icon": "Tablet"
    },
    {
      "step": "2",
      "title": "Registro completo",
      "description": "Armazenamento organizado, estruturado e altamente seguro dos dados epidemiológicos coletados, em conformidade com as diretrizes de saúde.",
      "icon": "Database"
    },
    {
      "step": "3",
      "title": "Uso online/offline",
      "description": "Funcionamento contínuo em campo com ou sem conexão de internet. Os dados são sincronizados automaticamente assim que houver rede disponível.",
      "icon": "Wifi"
    }
  ]')
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- FAQS
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content)
  VALUES (v_page_sobre, 'faqs', 'json', '[
    {
      "question": "O que é o SisEndemias?",
      "answer": "O SisEndemias é uma solução tecnológica proprietária desenvolvida pela WSMF para modernizar o trabalho de campo e a gestão administrativa de endemias. Ele permite a coleta de dados via tablet e o monitoramento em tempo real."
    },
    {
      "question": "A WSMF atende a quais tipos de municípios?",
      "answer": "Atendemos municípios de pequeno, médio e grande porte, customizando o suporte técnico e operacional de acordo com os índices de infestação e as necessidades específicas de cada localidade."
    },
    {
      "question": "Como funciona a implantação das ovitrampas?",
      "answer": "Fornecemos toda a logística e materiais, além de capacitar os Agentes de Combate a Endemias (ACE) para a instalação física, leitura de palhetas, contagem de ovos e alimentação dos dados no sistema."
    },
    {
      "question": "Como solicitar uma proposta ou orçamento?",
      "answer": "Você pode clicar no botão ''Solicitar Orçamento'' no cabeçalho ou preencher o formulário na página de Contato. Nossa equipe técnica analisará o perfil do seu município e entrará em contato rapidamente."
    }
  ]')
  ON CONFLICT (page_id, section_name) DO NOTHING;

  -- CONTACT_INFO
  INSERT INTO public.content_blocks (page_id, section_name, content_type, content)
  VALUES (v_page_contato, 'contact_info', 'json', '{
    "email": "wsmfconsultoria@gmail.com",
    "phone": "75 99903-4004",
    "address": "Santo Estevão - BA, Bairro Alagoinhas, nº 140 - CEP 44190-000",
    "instagram": "@wsmfgestaoemsaude",
    "coords": "Santo Estevão - BA"
  }')
  ON CONFLICT (page_id, section_name) DO NOTHING;

END $$;
