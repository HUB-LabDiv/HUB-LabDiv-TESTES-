"use client";

import { useEffect, useState } from "react";

/**
 * ♿ VLibrasWidget V2.2 (Brazil Federal Standards)
 * Injeta o plugin de traduções automática em Libras de forma segura no Next.js.
 * Garante que o script seja carregado apenas uma vez e apenas no cliente.
 */
export function VLibrasWidget() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Verificação de ambiente SSR
    if (typeof window === "undefined" || isLoaded) return;

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    
    script.onload = () => {
      // @ts-ignore - VLibras is defined globally by the script
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget("https://vlibras.gov.br/app");
        setIsLoaded(true);
      }
    };

    document.body.appendChild(script);

    return () => {
      // Limpeza opcional (embora o VLibras geralmente persista por sessão)
      const container = document.querySelector('[vw]');
      if (container) container.remove();
    };
  }, [isLoaded]);

  return (
    <div 
      {...{ vw: "true" } as any}
      className="enabled !z-[1000] !pointer-events-auto"
      aria-hidden="true" 
    >
      <div vw-access-button="true" className="active"></div>
      <div vw-plugin-wrapper="true">
        <div className="vw-plugin-top-wrapper"></div>
      </div>
    </div>
  );
}
