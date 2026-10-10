import { InteractivePamphlet } from '@/components/divulgacao/InteractivePamphlet';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Já testou o HUB? | HUB LabDiv',
  description: 'Conheça o Hub de Comunicação Científica do Lab-Div.',
};

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-background-dark flex flex-col items-center justify-center relative overflow-hidden font-open-sans">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-red/20 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 w-full flex flex-col items-center justify-center py-12 min-h-screen overflow-y-auto">
        {/* Header simplificado (Logo) */}
        <div className="mb-8 flex items-center justify-center">
          <div className="relative w-48 h-16">
            <Image 
              src="/icone-HUBLabDiv.svg" 
              alt="Logo HUB LabDiv" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

        {/* Panfleto Interativo */}
        <InteractivePamphlet />
        
      </div>
    </main>
  );
}
