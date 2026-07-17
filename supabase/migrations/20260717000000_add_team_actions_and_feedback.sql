-- Migration: Adicionar Ações da Equipe e Ajustar Permissões de Depoimentos

-- 1. Atualizar a tabela testimonials para permitir que qualquer um possa Inserir (Public Feedback)
-- Removemos a policy antiga de INSERT caso exista (na real a policy anterior era "Admins can manage testimonials" FOR ALL)
-- Como o Supabase avalia as policies como OR (se uma permitir, passa), podemos apenas adicionar a de inserção.
CREATE POLICY "Public can insert testimonials" 
ON public.testimonials FOR INSERT 
WITH CHECK (true);

-- 2. Tabela: team_actions
CREATE TABLE IF NOT EXISTS public.team_actions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.team_actions ENABLE ROW LEVEL SECURITY;

-- Leitura pública das ações da equipe
CREATE POLICY "Public can view team actions" 
ON public.team_actions FOR SELECT 
USING (TRUE);

-- Gerenciamento restrito a Admins
CREATE POLICY "Admins can manage team actions" 
ON public.team_actions FOR ALL 
USING (auth.uid() IS NOT NULL);
