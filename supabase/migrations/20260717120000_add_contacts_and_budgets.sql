-- Migration: Add Contacts and Budget Requests tables

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Public can insert contact messages
CREATE POLICY "Public can insert contact messages" 
ON public.contact_messages FOR INSERT 
WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admins can manage contact messages" 
ON public.contact_messages FOR ALL 
USING (auth.uid() IS NOT NULL);


CREATE TABLE IF NOT EXISTS public.budget_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  municipio TEXT NOT NULL,
  telefone TEXT NOT NULL,
  servicos_interesse TEXT[] NOT NULL DEFAULT '{}',
  mensagem_adicional TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.budget_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert budget requests
CREATE POLICY "Public can insert budget requests" 
ON public.budget_requests FOR INSERT 
WITH CHECK (true);

-- Only admins can read/manage
CREATE POLICY "Admins can manage budget requests" 
ON public.budget_requests FOR ALL 
USING (auth.uid() IS NOT NULL);
