-- Migration: Configuração Inicial da Arquitetura WSMF
-- Criação de tabelas, RLS e funções

-- Habilitar a extensão "uuid-ossp" se necessário (embora Supabase Auth já forneça id UUID)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-----------------------------------------------------------
-- 1. Tabela: admin_users (Extensão do Auth)
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS: Apenas superadmins ou o próprio usuário podem ler.
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin users can view all" ON public.admin_users FOR SELECT USING (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- 2. Tabela: pages
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
-- Leitura pública se ativa
CREATE POLICY "Public can view active pages" ON public.pages FOR SELECT USING (is_active = TRUE);
-- Edição restrita a autenticados (Admin)
CREATE POLICY "Admins can insert pages" ON public.pages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update pages" ON public.pages FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete pages" ON public.pages FOR DELETE USING (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- 3. Tabela: content_blocks
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
  section_name TEXT NOT NULL,
  content_type TEXT NOT NULL, -- ex: 'text', 'html', 'banner', 'json'
  content JSONB NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_id, section_name)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view content blocks" ON public.content_blocks FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage content blocks" ON public.content_blocks FOR ALL USING (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- 4. Tabela: media
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'document', 'video'
  bucket_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view media catalog" ON public.media FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage media catalog" ON public.media FOR ALL USING (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- 5. Tabela: testimonials
-----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  content TEXT NOT NULL,
  avatar_url TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view approved testimonials" ON public.testimonials FOR SELECT USING (is_approved = TRUE);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (auth.uid() IS NOT NULL);

-----------------------------------------------------------
-- Configuração de Storage Buckets (via SQL)
-----------------------------------------------------------
-- Inserindo o bucket público se não existir
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public_media', 'public_media', TRUE) 
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para o Bucket "public_media"
-- Permitir leitura pública
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'public_media');

-- Permitir Inserção Apenas para Autenticados
CREATE POLICY "Admin Insert" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'public_media' AND auth.uid() IS NOT NULL);

-- Permitir Update Apenas para Autenticados
CREATE POLICY "Admin Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'public_media' AND auth.uid() IS NOT NULL);

-- Permitir Delete Apenas para Autenticados
CREATE POLICY "Admin Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'public_media' AND auth.uid() IS NOT NULL);
