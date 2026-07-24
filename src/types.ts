/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


export interface ContactMessage {
  id: string;
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
  data: string;
}

export interface BudgetRequest {
  id: string;
  nome: string;
  email: string;
  municipio: string;
  telefone: string;
  servicosInteresse: string[];
  mensagemAdicional: string;
  data: string;
}

export interface Service {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  details?: {
    title: string;
    description: string;
  }[];
}

export interface FeatureStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_role?: string;
  content: string;
  avatar_url?: string;
  is_approved: boolean;
  created_at: string;
}

export interface TeamAction {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  action_date: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// Admin CMS Types
// ==========================================

export interface Page {
  id: string;
  slug: string;
  title: string;
  meta_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentBlock {
  id: string;
  page_id: string;
  section_name: string;
  content_type: string;
  content: any;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  bucket_path: string;
  uploaded_by?: string;
  created_at: string;
}
