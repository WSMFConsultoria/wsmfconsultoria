# WSMF Consultoria - Sistema Web e Painel Administrativo

Este é o repositório oficial da plataforma web da **WSMF Gestão em Saúde Consultoria Ltda**.

## Estrutura do Projeto

O sistema é construído utilizando tecnologias modernas de frontend e backend:
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, Zustand, Framer Motion e Lucide React.
- **Backend/Banco de Dados**: Supabase (PostgreSQL, Storage e Autenticação).

## Painel Administrativo

O projeto possui um painel administrativo oculto no caminho `/admin`. A partir do painel, os administradores podem gerenciar todo o conteúdo dinâmico do site (Páginas, Mídias, Depoimentos, etc.).

## Rodando o Projeto Localmente

1. Certifique-se de que o arquivo `.env` (com as chaves do Supabase) está na raiz do projeto.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

*(c) 2026 WSMF Gestão em Saúde Consultoria Ltda. Todos os direitos reservados.*
