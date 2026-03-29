import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

// ============================================================================
// HUB LAB-DIV — API DE DENÚNCIAS COM MODERAÇÃO PROPORCIONAL
// 
// Lógica:
//   1. Categorias gravíssimas (abuso_infantil, discurso_odio, assedio)
//      → Suspensão IMEDIATA do conteúdo (moderation_status = 'suspended')
//   2. Categorias comuns (spam, desinformacao, plagio, outro)
//      → Registro. Se >= 5 reporters únicos no mesmo item → 'flagged_for_review'
// ============================================================================

const reportSchema = z.object({
    reported_item_id: z.string().uuid('ID do item inválido.'),
    item_type: z.enum(['submission', 'micro_article', 'comment', 'pergunta'], {
        message: 'Tipo de item inválido.',
    }),
    category: z.enum([
        'spam', 'plagio', 'discurso_odio', 'assedio',
        'desinformacao', 'abuso_infantil', 'outro'
    ], {
        message: 'Categoria de denúncia inválida.',
    }),
    justification: z.string().min(10, 'Justificativa deve ter ao menos 10 caracteres.').max(2000),
});

// Mapeamento item_type -> tabela real no Supabase
const ITEM_TYPE_TABLE_MAP: Record<string, string> = {
    submission: 'submissions',
    micro_article: 'micro_articles',
    comment: 'comments',
    pergunta: 'perguntas',
};

// Categorias que disparam suspensão imediata
const SEVERE_CATEGORIES = new Set(['abuso_infantil', 'discurso_odio', 'assedio']);

// Threshold de reports únicos para flagear conteúdo
const VOLUME_THRESHOLD = 5;

export async function POST(request: NextRequest) {
    try {
        const supabase = await createServerSupabase();

        // 1. Autenticação obrigatória
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Autenticação necessária para enviar denúncias.' },
                { status: 401 }
            );
        }

        // 2. Validação do payload com Zod
        const body = await request.json();
        const parsed = reportSchema.safeParse(body);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0]?.message || 'Dados inválidos.';
            return NextResponse.json({ error: firstError }, { status: 400 });
        }

        const { reported_item_id, item_type, category, justification } = parsed.data;

        // 3. Verificar se o usuário já reportou este item (evitar duplicatas)
        const { data: existingReport } = await supabase
            .from('reports')
            .select('id')
            .eq('reporter_id', user.id)
            .eq('reported_item_id', reported_item_id)
            .maybeSingle();

        if (existingReport) {
            return NextResponse.json(
                { error: 'Você já denunciou este conteúdo.' },
                { status: 409 }
            );
        }

        // 4. Inserir a denúncia
        const { error: insertError } = await supabase
            .from('reports')
            .insert({
                reporter_id: user.id,
                reported_item_id,
                item_type,
                category,
                justification,
                status: 'pendente',
            });

        if (insertError) {
            console.error('[REPORTS API] Insert error:', insertError);
            return NextResponse.json(
                { error: 'Erro ao registrar denúncia.' },
                { status: 500 }
            );
        }

        // 5. LÓGICA DE MODERAÇÃO PROPORCIONAL
        const tableName = ITEM_TYPE_TABLE_MAP[item_type];
        let action = 'registered';

        if (SEVERE_CATEGORIES.has(category)) {
            // ─── TRIGGER PESADO: Suspensão imediata ───
            const { error: updateError } = await supabase
                .from(tableName)
                .update({ moderation_status: 'suspended' })
                .eq('id', reported_item_id);

            if (updateError) {
                console.error(`[REPORTS API] Failed to suspend ${tableName}:`, updateError);
                // A denúncia já foi registrada, não retornar erro ao usuário
            } else {
                action = 'suspended';
            }
        } else {
            // ─── VOLUME TRIGGER (Anti-Brigading) ───
            // Contar reporters ÚNICOS para este item
            const { count, error: countError } = await supabase
                .from('reports')
                .select('reporter_id', { count: 'exact', head: false })
                .eq('reported_item_id', reported_item_id);

            if (!countError && count !== null && count >= VOLUME_THRESHOLD) {
                const { error: flagError } = await supabase
                    .from(tableName)
                    .update({ moderation_status: 'flagged_for_review' })
                    .eq('id', reported_item_id)
                    .eq('moderation_status', 'active'); // Só marca se ainda estiver ativo

                if (!flagError) {
                    action = 'flagged';
                }
            }
        }

        return NextResponse.json({
            success: true,
            action,
            message: action === 'suspended'
                ? 'Conteúdo suspenso para análise imediata.'
                : action === 'flagged'
                    ? 'Conteúdo sinalizado para revisão da equipe.'
                    : 'Denúncia registrada com sucesso.',
        });

    } catch (error: any) {
        console.error('[REPORTS API] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor.' },
            { status: 500 }
        );
    }
}
