import React from 'react';

interface TermsOfUseProps {
  onAccept?: () => void;
  acceptedVersion?: string;
}

export function TermsOfUse({ onAccept, acceptedVersion }: TermsOfUseProps) {
  return (
    <div className="flex flex-col h-full max-h-[60vh] overflow-hidden bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm font-open-sans">
      <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#121212]">
        <h3 className="text-lg font-bold text-[#0F4780] dark:text-blue-400 uppercase tracking-tight">
          Termos de Uso e LGPD (HUB Lab-Div)
        </h3>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 italic">Versão: v2.0</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        <section>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
            1. Consentimento e Privacidade (LGPD, ECA & Marco Civil)
          </h4>
          <p>
            O acesso a ferramentas de pesquisa por menores de idade requer, impreterivelmente, a validação de um responsável legal. O processamento de dados do HUB Lab-Div obedece estritamente à <strong>Lei Geral de Proteção de Dados (LGPD)</strong>, ao <strong>Estatuto da Criança e do Adolescente (ECA)</strong> e ao <strong>Marco Civil da Internet</strong>.
            Nenhum dado pessoal de acesso/autenticação, como CPF, é armazenado em texto claro, passando por irreversíveis processos de hashing em memória.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
            2. Licenciamento de Conteúdo (CC BY 4.0)
          </h4>
          <div className="bg-blue-50 dark:bg-[#0F4780]/10 border-l-4 border-[#0F4780] p-4 rounded-r-md">
            <p className="font-medium text-[#0F4780] dark:text-blue-300">
              ATENÇÃO: Todo Conteúdo Gerado pelo Usuário (UGC) neste HUB é regido pela Licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0).
            </p>
          </div>
          <p className="mt-3">
            Ao submeter perguntas, resoluções, wikis, quizzes ou qualquer outra interação pública, o usuário concorda que estes materiais poderão ser usados por terceiros, aprimorados, readaptados e indexados para benefício da ciência, mediante atribuição ao autor.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
            3. Direito de Retenção e Deleção de Conta
          </h4>
          <p>
            Caso você solicite a exclusão de sua conta, reservamo-nos o direito de retenção autoral e científica. Seu perfil pessoal, foto, e-mail e dados identificáveis serão definitivamente deletados. 
            Contudo, conteúdos públicos previamente submetidos serão mantidos na plataforma no formato de <strong>Anonimizados ("Usuário Excluído")</strong>, para preservar o histórico colaborativo da rede científica.
          </p>
          <p className="mt-2 font-medium text-blue-600 dark:text-blue-400">
            O usuário tem o direito de solicitar a portabilidade de seus dados a qualquer momento através da ferramenta de exportação estruturada disponível nas configurações.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
            4. Código de Conduta
          </h4>
          <p>
            Qualquer uso da plataforma para assédio, spam, quebra de propriedade intelectual alheia não regida perante a respectiva licença, ou exploração inadequada acarretará no banimento e encaminhamento de logs criptografados (por retenção semestral do Marco Civil) para medidas cabíveis.
          </p>
        </section>

        <section>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-base mb-2">
            5. Finalidade Institucional e Comunicação Científica
          </h4>
          <p>
            O HUB Lab-Div atua como um laboratório de comunicação científica interativa, aproximando a sociedade do cotidiano acadêmico do IFUSP. O conteúdo reflete o processo dinâmico de pesquisa e aprendizado de alunos e pesquisadores; portanto, a plataforma não garante a acurácia absoluta ou caráter definitivo das postagens. O valor reside na transparência institucional e no debate acadêmico em tempo real, servindo como uma ferramenta de aproximação entre a Universidade e o público geral, promovendo o entendimento de como a ciência é organizada e produzida.
          </p>
        </section>
      </div>

      {onAccept && (
        <div className="p-4 bg-gray-50 dark:bg-[#121212] border-t border-gray-100 dark:border-gray-800 flex justify-end">
          <button 
            onClick={onAccept}
            disabled={acceptedVersion === 'v2.0'}
            className="px-6 py-2 bg-[#0F4780] hover:bg-[#0c3966] text-white rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {acceptedVersion === 'v2.0' ? 'Termos Já Aceitos' : 'Li, Entendi e Aceito (v2.0)'}
          </button>
        </div>
      )}
    </div>
  );
}
