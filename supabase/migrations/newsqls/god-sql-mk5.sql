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
DROP TABLE IF EXISTS public.parent_child_links CASCADE;

CREATE TABLE IF NOT EXISTS public.parent_child_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status_consentimento TEXT NOT NULL CHECK (status_consentimento IN ('pendente', 'aprovado', 'revogado')),
    consent_ip_encrypted TEXT,
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
INSERT INTO auth.users (id, email, instance_id, aud, role, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_token, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'audit@hub-labdiv.if.usp.br',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    '',
    now(),
    now(),
    now(),
    '',
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Auditoria Parental (Anônimo)"}',
    false
)
ON CONFLICT (id) DO NOTHING;

-- 2. CRIAÇÃO DO PERFIL FANTASMA (AUDITORIA / PESQUISADOR ANÔNIMO)
-- Este perfil receberá a autoria de conteúdos orfãos e servirá de vínculo para pais anônimos.
INSERT INTO public.profiles (
    id, email, full_name, username, use_nickname, user_category, 
    is_visible, is_public, review_status, role, is_adult
)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'audit@hub-labdiv.if.usp.br',
    'Auditoria Parental (Anônimo)',
    'anonimo',
    true,
    'curioso',
    true,
    true,
    'approved',
    'user',
    true
)
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    is_adult = true;

-- 2. FUNÇÃO DE SOFT DELETE HÍBRIDO (ANONIMIZAÇÃO + PURGE)
-- Atualizada em [2026-03-30] para incluir todas as tabelas novas do HUB.
CREATE OR REPLACE FUNCTION public.soft_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    GHOST_UUID UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- [A] Anonimizar Conteúdo Científico e Administrativo
    UPDATE public.submissions SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.micro_articles SET author_id = GHOST_UUID WHERE author_id = target_user_id;
    UPDATE public.comments SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.reproductions SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.testimonials SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.corrections SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.admin_notifications SET sender_id = GHOST_UUID WHERE sender_id = target_user_id;
    UPDATE public.knowledge_suggestions SET user_id = GHOST_UUID WHERE user_id = target_user_id;
    UPDATE public.arena_suggestions SET researcher_id = GHOST_UUID WHERE researcher_id = target_user_id;
    UPDATE public.researcher_challenges SET creator_id = GHOST_UUID WHERE creator_id = target_user_id;
    UPDATE public.group_messages SET sender_id = GHOST_UUID WHERE sender_id = target_user_id;
    UPDATE public.wiki_articles SET author_id = GHOST_UUID WHERE author_id = target_user_id;

    -- [B] Limpar Interações, Dados Sociais e Pessoais (Delete PII)
    DELETE FROM public.follows WHERE follower_id = target_user_id OR following_id = target_user_id;
    DELETE FROM public.saved_posts WHERE user_id = target_user_id;
    DELETE FROM public.curtidas WHERE user_id = target_user_id;
    DELETE FROM public.notifications WHERE user_id = target_user_id;
    DELETE FROM public.messages WHERE sender_id = target_user_id OR recipient_id = target_user_id;
    DELETE FROM public.entanglement_messages WHERE sender_id = target_user_id OR receiver_id = target_user_id;
    DELETE FROM public.reading_history WHERE user_id = target_user_id;
    DELETE FROM public.user_trail_progress WHERE user_id = target_user_id;
    DELETE FROM public.parent_child_links WHERE parent_id = target_user_id OR child_id = target_user_id;
    DELETE FROM public.user_badges WHERE user_id = target_user_id;
    DELETE FROM public.profile_badges WHERE profile_id = target_user_id;
    DELETE FROM public.parental_consent_tokens WHERE child_id = target_user_id;
    DELETE FROM public.private_notes WHERE user_id = target_user_id;
    DELETE FROM public.kudos WHERE sender_id = target_user_id OR receiver_id = target_user_id;
    DELETE FROM public.reactions WHERE user_id = target_user_id;
    DELETE FROM public.user_completed_trails WHERE user_id = target_user_id;
    DELETE FROM public.entangled_group_members WHERE user_id = target_user_id;
    DELETE FROM public.user_custom_blocks WHERE user_id = target_user_id;
    DELETE FROM public.user_calendar_events WHERE user_id = target_user_id;
    DELETE FROM public.research_adoptions WHERE researcher_id = target_user_id OR student_id = target_user_id;
    DELETE FROM public.adoptions WHERE mentor_id = target_user_id OR freshman_id = target_user_id;
    DELETE FROM public.profiles_xp_history WHERE profile_id = target_user_id;
    DELETE FROM public.map_interactions WHERE user_id = target_user_id;
    DELETE FROM public.telemetry_events WHERE user_id = target_user_id;
    DELETE FROM public.pseudonyms WHERE user_id = target_user_id;

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

    -- [D] Remover Registro de Autenticação (Profiles será deletado em cascade se configurado, senão deleta manualmente)
    DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.soft_delete_user(UUID) TO postgres;
GRANT EXECUTE ON FUNCTION public.soft_delete_user(UUID) TO service_role;

-- [2026-03-29] Sprint Segurança: Verificação de CPF & Maioridade
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS guardian_email TEXT DEFAULT NULL;

-- 2. TABELA DE TOKENS PARA CONSENTIMENTO PARENTAL (MAGIC LINKS)
CREATE TABLE IF NOT EXISTS public.parental_consent_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    guardian_email TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'used', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '48 hours') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para parental_consent_tokens
ALTER TABLE public.parental_consent_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Sistema pode gerenciar tokens" ON public.parental_consent_tokens;
CREATE POLICY "Sistema pode gerenciar tokens" ON public.parental_consent_tokens FOR ALL USING (true);

-- =========================================================================================
-- LOGS DE AUDITORIA DE MIGRAÇÕES & RESET DE TOKENS (POST-FLUXO)
-- =========================================================================================

-- Data Fix: Resetar o token de teste para permitir novo teste do portal
UPDATE public.parental_consent_tokens
SET status = 'pending'
WHERE token = 'feac119e-4c8d-4833-ae4d-be28cc8bd2c0';

-- Registro de Versão/Snapshot
INSERT INTO public.telemetry_events (event_type, metadata)
VALUES ('database_migration', '{"version": "god-sql-mk5.1", "description": "Consolidated Parental Schema Fix (IP Audit + Ghost Profile + Token Reset)"}');

-- =========================================================================================
-- [2026-03-29] HOTFIX: handle_new_user trigger SECURITY DEFINER
-- =========================================================================================
-- CAUSA RAIZ: A RLS de profiles exige auth.uid() = id para INSERT,
-- mas o trigger roda NO CONTEXTO DO BANCO (não possui auth.uid()),
-- então a criação de perfil falhava silenciosamente para novos usuários.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id, 
        NEW.email, 
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- Rescue: Criar perfis para quaisquer auth.users órfãos (sem profile)
INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT 
    u.id, 
    u.email, 
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- =========================================================================================
-- [2026-03-29] HOTFIX: FK CASCADE rules for profile deletion
-- =========================================================================================
-- CAUSA RAIZ: Várias FKs apontavam para profiles(id) com ON DELETE NO ACTION,
-- bloqueando wipes e deleções de perfis pelo admin panel.

-- admin_notifications.sender_id → SET NULL (preserva audit history)
ALTER TABLE public.admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_sender_id_fkey;
ALTER TABLE public.admin_notifications ADD CONSTRAINT admin_notifications_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- follows.following_id → CASCADE (deleta follows junto com o perfil)
ALTER TABLE public.follows DROP CONSTRAINT IF EXISTS follows_following_id_fkey;
ALTER TABLE public.follows ADD CONSTRAINT follows_following_id_fkey
  FOREIGN KEY (following_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- messages.sender_id / recipient_id → SET NULL (preserva histórico)
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_recipient_id_fkey
  FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE SET NULL;

-- submissions.user_id → SET NULL (preserva conteúdo científico)
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_user_id_fkey;
ALTER TABLE public.submissions ADD CONSTRAINT submissions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- [2026-03-29] Audit Mode Flag (Fallback Tracking)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_audit_mode BOOLEAN DEFAULT FALSE;

-- =========================================================================================
-- [2026-03-30] HARDENING DELETE CONSTRAINTS
-- =========================================================================================
-- Garante que todas as tabelas secundárias não bloqueiem a deleção do usuário principal.

DO $$
BEGIN
    -- 1. Ensure Ghost User exists (Professional Identity)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000000') THEN
        INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data, aud, role)
        VALUES ('00000000-0000-0000-0000-000000000000', 'sistema@hub-labdiv.if.usp.br', '{"full_name": "Sistema HUB LabDiv"}', '{"provider": "email"}', 'authenticated', 'authenticated');
        
        INSERT INTO public.profiles (id, full_name, role, email)
        VALUES ('00000000-0000-0000-0000-000000000000', 'Sistema HUB LabDiv', 'admin', 'sistema@hub-labdiv.if.usp.br')
        ON CONFLICT (id) DO UPDATE SET full_name = 'Sistema HUB LabDiv', email = 'sistema@hub-labdiv.if.usp.br';
    END IF;
END $$;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.user_badges DROP CONSTRAINT IF EXISTS user_badges_user_id_fkey;
ALTER TABLE public.user_badges ADD CONSTRAINT user_badges_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.profile_badges DROP CONSTRAINT IF EXISTS profile_badges_profile_id_fkey;
ALTER TABLE public.profile_badges ADD CONSTRAINT profile_badges_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.private_notes DROP CONSTRAINT IF EXISTS private_notes_user_id_fkey;
ALTER TABLE public.private_notes ADD CONSTRAINT private_notes_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.kudos DROP CONSTRAINT IF EXISTS kudos_sender_id_fkey;
ALTER TABLE public.kudos ADD CONSTRAINT kudos_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.kudos DROP CONSTRAINT IF EXISTS kudos_receiver_id_fkey;
ALTER TABLE public.kudos ADD CONSTRAINT kudos_receiver_id_fkey
  FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.reactions DROP CONSTRAINT IF EXISTS reactions_user_id_fkey;
ALTER TABLE public.reactions ADD CONSTRAINT reactions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_completed_trails DROP CONSTRAINT IF EXISTS user_completed_trails_user_id_fkey;
ALTER TABLE public.user_completed_trails ADD CONSTRAINT user_completed_trails_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.entangled_group_members DROP CONSTRAINT IF EXISTS entangled_group_members_user_id_fkey;
ALTER TABLE public.entangled_group_members ADD CONSTRAINT entangled_group_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_custom_blocks DROP CONSTRAINT IF EXISTS user_custom_blocks_user_id_fkey;
ALTER TABLE public.user_custom_blocks ADD CONSTRAINT user_custom_blocks_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.user_calendar_events DROP CONSTRAINT IF EXISTS user_calendar_events_user_id_fkey;
ALTER TABLE public.user_calendar_events ADD CONSTRAINT user_calendar_events_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.profiles_xp_history DROP CONSTRAINT IF EXISTS profiles_xp_history_profile_id_fkey;
ALTER TABLE public.profiles_xp_history ADD CONSTRAINT profiles_xp_history_profile_id_fkey
  FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.map_interactions DROP CONSTRAINT IF EXISTS map_interactions_user_id_fkey;
ALTER TABLE public.map_interactions ADD CONSTRAINT map_interactions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.telemetry_events DROP CONSTRAINT IF EXISTS telemetry_events_user_id_fkey;
ALTER TABLE public.telemetry_events ADD CONSTRAINT telemetry_events_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.pseudonyms DROP CONSTRAINT IF EXISTS pseudonyms_user_id_fkey;
ALTER TABLE public.pseudonyms ADD CONSTRAINT pseudonyms_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Hardening remaining constraints from SET NULL to CASCADE (Idempotent version)
-- Learning Trails
ALTER TABLE public.learning_trails DROP CONSTRAINT IF EXISTS learning_trails_author_id_fkey;
ALTER TABLE public.learning_trails DROP CONSTRAINT IF EXISTS learning_trails_creator_id_fkey;
ALTER TABLE public.learning_trails ADD CONSTRAINT learning_trails_creator_id_fkey
  FOREIGN KEY (creator_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Comments
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE public.comments ADD CONSTRAINT comments_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Wiki
ALTER TABLE public.wiki_articles DROP CONSTRAINT IF EXISTS wiki_articles_author_id_fkey;
ALTER TABLE public.wiki_articles ADD CONSTRAINT wiki_articles_author_id_fkey
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Groups
ALTER TABLE public.entangled_groups DROP CONSTRAINT IF EXISTS entangled_groups_created_by_fkey;
ALTER TABLE public.entangled_groups ADD CONSTRAINT entangled_groups_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Notifications
ALTER TABLE public.admin_notifications DROP CONSTRAINT IF EXISTS admin_notifications_sender_id_fkey;
ALTER TABLE public.admin_notifications ADD CONSTRAINT admin_notifications_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Messages
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;
ALTER TABLE public.messages ADD CONSTRAINT messages_recipient_id_fkey
  FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Submissions
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_user_id_fkey;
ALTER TABLE public.submissions ADD CONSTRAINT submissions_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Ensure profile deletion correctly cascades from auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure profile deletion correctly cascades from auth.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
