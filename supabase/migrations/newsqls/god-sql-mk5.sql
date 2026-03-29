-- [2026-03-26] Geração de Aluno de Teste: Bento Silva
-- 1. Criar Usuário em Auth
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  'd475583b-e381-424a-93a1-1234567890ab', 
  'bento.teste@usp.br', 
  '{"full_name": "Bento Silva (Teste)", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bento"}'
) ON CONFLICT (id) DO NOTHING;

-- 2. Atualizar Perfil Público com Dados de IC
UPDATE public.profiles SET
  user_category = 'aluno_usp',
  course = 'Bacharelado em Física',
  institute = 'IFUSP',
  seeking_ic = true,
  ic_research_area = 'Física Teórica - Cosmologia',
  ic_preferred_department = 'FMA',
  ic_preferred_lab = 'Grupo de Teoria de Campo',
  ic_letter_of_interest = 'Tenho grande interesse em processamento de dados astronômicos e simulações de N-corpos. Busco minha primeira IC para aplicar conceitos de relatividade geral no estudo de buracos negros primordiais.',
  review_status = 'approved',
  is_visible = true,
  xp = 250,
  level = 5,
  is_usp_member = true
WHERE id = 'd475583b-e381-424a-93a1-1234567890ab';

-- 3. Função de Wipe Seletivo (Manter Emails Selecionados + Trilhas)
CREATE OR REPLACE FUNCTION public.reset_selective(preserved_emails text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- A. Limpar Todo o Conteúdo (Idêntico ao reset_only_content)
  TRUNCATE TABLE public.submissions CASCADE;
  TRUNCATE TABLE public.perguntas CASCADE;
  TRUNCATE TABLE public.comments CASCADE;
  TRUNCATE TABLE public.micro_articles CASCADE;
  TRUNCATE TABLE public.messages CASCADE;
  TRUNCATE TABLE public.entanglement_messages CASCADE;
  TRUNCATE TABLE public.reports CASCADE;
  TRUNCATE TABLE public.feedback_reports CASCADE;
  TRUNCATE TABLE public.notifications CASCADE;
  TRUNCATE TABLE public.quiz_attempts CASCADE;
  TRUNCATE TABLE public.reading_history CASCADE;
  TRUNCATE TABLE public.analytics_plays CASCADE;
  TRUNCATE TABLE public.challenge_submissions CASCADE;

  -- B. Apagar usuários que NÃO estão na lista de preservados.
  DELETE FROM auth.users WHERE array_length(preserved_emails, 1) IS NULL OR email != ALL(preserved_emails);
  
  -- Nota: learning_trails NÃO é truncada, logo as trilhas são mantidas integralmente.
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_selective(text[]) TO postgres;

-- 4. Suporte para Cache de Sincronização do Júpiter
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS jupiter_subjects_cache JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_jupiter_sync TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_adult BOOLEAN DEFAULT NULL,
ADD COLUMN IF NOT EXISTS accepted_terms_version TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cpf_hash TEXT DEFAULT NULL;

-- =========================================================================================
-- HUB LAB-DIV: INFRAESTRUTURA DE SEGURANÇA E DADOS (FASE 1)
-- =========================================================================================

-- 1. ATIVAÇÃO DE EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";

-- =========================================================================================

-- 2. CRIAÇÃO DE TABELAS DE DOMÍNIO DE SEGURANÇA E AUTH
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.parent_child_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status_consentimento TEXT NOT NULL CHECK (status_consentimento IN ('pendente', 'aprovado', 'revogado')),
    consent_ip_encrypted BYTEA,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(parent_id, child_id)
);

CREATE TABLE IF NOT EXISTS public.access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    ip_address_encrypted BYTEA NOT NULL, 
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================================

-- 3. ISOLAMENTO (ROW-LEVEL SECURITY - RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil" ON public.users;
CREATE POLICY "Usuários podem ver o próprio perfil" ON public.users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil" ON public.users;
CREATE POLICY "Usuários podem atualizar o próprio perfil" ON public.users FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Pais podem ver os vínculos com seus filhos" ON public.parent_child_links;
CREATE POLICY "Pais podem ver os vínculos com seus filhos" ON public.parent_child_links FOR SELECT USING (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Pais podem inserir/atualizar vínculos" ON public.parent_child_links;
CREATE POLICY "Pais podem inserir/atualizar vínculos" ON public.parent_child_links FOR ALL USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Sistema loga acessos via roles autenticadas/anon" ON public.access_logs;
CREATE POLICY "Sistema loga acessos via roles autenticadas/anon" ON public.access_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários comuns não podem ler logs" ON public.access_logs;
CREATE POLICY "Usuários comuns não podem ler logs" ON public.access_logs FOR SELECT USING (false);

-- =========================================================================================

-- 4. MANUTENÇÃO: EXPURGO AUTOMÁTICO DE LOGS
-- SELECT cron.schedule('expurgo_logs_diario', '0 3 * * *', $$ DELETE FROM public.access_logs WHERE created_at < NOW() - INTERVAL '6 months' $$);

-- =========================================================================================
-- HUB LAB-DIV: INFRAESTRUTURA DE MODERAÇÃO E CORE ACADÊMICO (FASE 4)
-- =========================================================================================

-- 1. CRIAÇÃO DA TABELA DE DENÚNCIAS (REPORTS)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reported_item_id UUID NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('submission', 'micro_article', 'comment', 'pergunta')),
    category TEXT NOT NULL CHECK (category IN ('spam', 'plagio', 'discurso_odio', 'assedio', 'desinformacao', 'abuso_infantil', 'outro')),
    justification TEXT,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'resolvido', 'descartado')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem criar denúncias" ON public.reports;
CREATE POLICY "Usuários podem criar denúncias" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Usuários comuns não podem ler denúncias" ON public.reports;
CREATE POLICY "Usuários comuns não podem ler denúncias" ON public.reports FOR SELECT USING (false);

-- 2. ADIÇÃO DE STATUS DE MODERAÇÃO NAS TABELAS DE CONTEÚDO
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'active';
ALTER TABLE public.micro_articles ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'active';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'active';
ALTER TABLE public.perguntas ADD COLUMN IF NOT EXISTS moderation_status TEXT DEFAULT 'active';

-- =========================================================================================
-- HUB LAB-DIV: LGPD, RETENÇÃO E DESLIGAMENTO (FASE 5)
-- =========================================================================================

-- 1. CRIAÇÃO DO REGISTRO DE AUTENTICAÇÃO FANTASMA (Para satisfazer FKs)
-- Inserindo em auth.users e public.users (caso o perfil aponte para um ou outro)
INSERT INTO auth.users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'anonimo@labdiv.com.br')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, password_hash)
VALUES ('00000000-0000-0000-0000-000000000000', 'anonimo@labdiv.com.br', 'N/A')
ON CONFLICT (id) DO NOTHING;

-- 2. CRIAÇÃO DO PERFIL FANTASMA (PESQUISADOR ANÔNIMO)
-- Este perfil receberá a autoria de conteúdos de usuários que excluírem suas contas.
INSERT INTO public.profiles (
    id, email, full_name, username, use_nickname, user_category, 
    is_visible, is_public, review_status, role, is_labdiv
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'anonimo@labdiv.com.br',
    'Pesquisador Anônimo',
    'anonimo',
    true,
    'curioso',
    true,
    true,
    'approved',
    'user',
    false
)
ON CONFLICT (id) DO NOTHING;

-- 2. FUNÇÃO DE SOFT DELETE HÍBRIDO (ANONIMIZAÇÃO + PURGE)
CREATE OR REPLACE FUNCTION public.soft_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    GHOST_UUID UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- [A] Anonimizar Conteúdo Científico
    UPDATE public.submissions SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.micro_articles SET author_id = GHOST_UUID WHERE author_id = target_user_id;
    UPDATE public.comments SET user_id = GHOST_UUID WHERE user_id = target_user_id;

    -- [B] Limpar Interações e Dados Sociais (PII)
    DELETE FROM public.follows WHERE follower_id = target_user_id OR following_id = target_user_id;
    DELETE FROM public.saved_posts WHERE user_id = target_user_id;
    DELETE FROM public.curtidas WHERE user_id = target_user_id;
    DELETE FROM public.notifications WHERE user_id = target_user_id;
    DELETE FROM public.messages WHERE sender_id = target_user_id OR recipient_id = target_user_id;
    DELETE FROM public.entanglement_messages WHERE sender_id = target_user_id OR receiver_id = target_user_id;
    DELETE FROM public.reading_history WHERE user_id = target_user_id;
    DELETE FROM public.user_trail_progress WHERE user_id = target_user_id;
    DELETE FROM public.parent_child_links WHERE parent_id = target_user_id OR child_id = target_user_id;

    -- [C] Wipe no Perfil Público
    UPDATE public.profiles SET
        full_name = '[Usuário Excluído]',
        username = 'excluido_' || substr(target_user_id::text, 1, 8),
        email = NULL,
        avatar_url = NULL,
        bio = NULL,
        bio_draft = NULL,
        whatsapp = NULL,
        lattes_url = NULL,
        linkedin_url = NULL,
        github_url = NULL,
        cpf_hash = NULL,
        is_visible = false,
        is_public = false,
        jupiter_subjects_cache = '[]'::jsonb
    WHERE id = target_user_id;

    -- [D] Remover Registro de Autenticação
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_user(UUID) TO postgres;
GRANT EXECUTE ON FUNCTION public.soft_delete_user(UUID) TO service_role;
