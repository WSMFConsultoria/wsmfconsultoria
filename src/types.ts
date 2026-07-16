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
