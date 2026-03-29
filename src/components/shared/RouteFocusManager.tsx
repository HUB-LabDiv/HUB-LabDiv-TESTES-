"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 🛰️ RouteFocusManager V6.0 (Accessibility First)
 * Gerencia o foco programático durante as navegações SPA do Next.js.
 * Garante que leitores de tela anunciem o novo título (H1) ao mudar de página.
 */
export function RouteFocusManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Timeout de 100ms para garantir que a renderização do DOM do Next.js terminou
    const timeoutId = setTimeout(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        // Tornar o H1 programaticamente focável se ele ainda não for
        if (!h1.hasAttribute("tabindex")) {
          h1.setAttribute("tabindex", "-1");
        }
        h1.focus({ preventScroll: true });
        
        // Log para auditoria de acessibilidade em ambiente de dev
        if (process.env.NODE_ENV === 'development') {
          console.debug(`[A11y] Focus sent to H1: ${h1.innerText}`);
        }
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
