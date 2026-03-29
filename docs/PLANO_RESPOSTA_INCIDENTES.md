# Plano de Resposta a Incidentes (LGPD & Marco Civil)
**Status:** ATIVO
**Revisão:** V1.0 - Infraestrutura de Segurança Fase 1

---

## 1. Escopo e Propósito
Este plano define as políticas e os processos adotados pelo **HUB Lab-Div** frente ao tratamento de logs de auditoria e resposta em casos de violação de dados, em adequação à **Lei Geral de Proteção de Dados Pessoais (LGPD - L13709)** e ao **Marco Civil da Internet (L12965)**.

Nosso principal foco é construir um modelo de armazenamento de acessos (Privacy-by-Design), garantindo a retenção por apenas o período legalmente justificado e o ofuscamento dos dados do tráfego web do usuário.

---

## 2. Política de Log de Auditoria
A nova infraestrutura faz a aquisição das tentativas de acesso através de Server Actions e salva em nossa base relacional (`public.access_logs`) protegida sob forte isolamento a Nível de Registro (RLS). Apenas contas administrativas poderão visualizar os acessos via painel do Supabase.

### 2.1 Criptografia de Endereço IP
- Por determinação legal e visando reduzir as ameaças em caso de sequestro da base, os identificadores sensíveis como Endereços de IP (IPv4 e IPv6) **não são gravados em texto legível**.
- Utiliza-se a suíte `pgcrypto` para garantir cifragem baseada em chaves, embutida antes mesmo do commit transacional da base no PostgreSQL (função simétrica `pgp_sym_encrypt`).

### 2.2 Controle de Retenção e Descarte (6 Meses)
A Lei nº 12.965 obriga administradores de sistemas a reterem registros de acesso sob sigilo apenas pelo período restrito e compatível de **6 (seis) meses**.

- Para automatizar esse descarte, habilitamos a extensão **`pg_cron`**.
- O trabalho (Job) nomeado `expurgo_logs_diario` roda independentemente na nuvem todas as madrugadas (às 03:00 UTC).
- **Tarefa CRON:** Excluirá nativamente e definitivamente da tabela (`access_logs`) todas as linhas cujo a coluna `created_at` seja menor que `agora() - 6 meses (INTERVAL '6 months')`.

---

## 3. Classificação de Dados Sensíveis
Com nosso aprimoramento contínuo sobre **Parent Child Linking**:

- O módulo de **Consentimento Mútuo** (vínculo pai/responsável -> filho/menor) usa o `auth.uid()` para permitir restrição atômica ("pais só podem ver/auditar o próprio vínculo e o filho associado").

---

## 4. Procedimento em Caso de Incidente (Data Breach)
Se a infraestrutura identificar acessos esparsos (ex. Credential Stuffing) nos logs ou relatar que dados contidos nas tabelas `users` foram acessados indevidamente. O protocolo imediato deverá conter:

1. **Notificação da Retaguarda:** Alerta ao mantenedor pela interrupção temporária (Kill Switch) bloqueando tráfego no Edge via Vercel Protection se preciso.
2. **Avaliação Fática e Log Triage:** Os responsáveis extrairão os metadados do `access_logs` usando a chave da aplicação (Supabase `PGP_KEY`) e investigarão via IPs de quais países ocorreu a origem.
3. **Anulação Autenticada:** Se identificadas violações ou tokens vazados de *Responsáveis/Menores*, invalidaremos todos os JWTs ativos (`UPDATE auth.users SET raw_user_meta_data...`) e as sessões via refresh do Next.js Proxy/Middleware irão se corromper obrigando login seguro.
4. **Relato (Notificação):** Nosso Termo informa que os usuários afetados devem ser notificados pelo hub em tempo hábil num prazo de 72 horas em relação ao incidente caso existam reflexos na conta do perfil atrelado.

---
_Nota do Mantenedor: Garantir que a `PGP_KEY` seja armazenada nas Variáveis de Ambiente e não comitada no branch de release ou git config._
