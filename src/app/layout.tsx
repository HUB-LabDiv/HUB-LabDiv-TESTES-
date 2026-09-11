/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import type { Metadata } from "next";
import { Open_Sans, Outfit } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Script from "next/script";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: 'swap',
});

const bukraFallback = Outfit({
  variable: "--font-bukra",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '700', '900'],
});

const materialSymbols = localFont({
  src: '../../node_modules/material-symbols/material-symbols-outlined.woff2',
  variable: '--font-material-symbols',
  display: 'swap',
  weight: '100 700',
  style: 'normal',
});

import { LazyMotion, domAnimation } from "framer-motion";

import { ReadingProgressBar } from "@/components/reading/ReadingProgressBar";
import { ReadingExperienceProvider } from "@/components/reading/ReadingExperienceProvider";
import { SearchProvider } from "@/providers/SearchProvider";
import { ClientPwaManager } from "@/components/pwa/ClientPwaManager";
import { SkipLink } from "@/components/ui/SkipLink";
import { AuthProvider } from "@/providers/AuthProvider";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { createServerSupabase } from "@/lib/supabase/server";
import { TelemetryManager } from "@/components/telemetry/TelemetryManager";
import { CookieBanner } from "@/components/shared/CookieBanner";
import { RouteFocusManager } from "@/components/shared/RouteFocusManager";
import { VLibrasWidget } from "@/components/ui/VLibrasWidget";
import { QueryProvider } from "@/providers/QueryProvider";
import { BetaRegistrationModal } from "@/components/modals/BetaRegistrationModal";
import { OfflineBanner } from "@/components/layout/OfflineBanner";

/**
 * V4.0.0 Layout - Protocol Apocalypse Certified
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://hub-lab-div.vercel.app'),
  title: "Hub de Comunicação Científica do Lab-Div",
  description: "Um projeto para melhorar a comunicação do IFUSP e reunir em um FLUXO interativo o arquivo de material de divulgação do Lab-Div e de toda a comunidade — de dentro e fora do instituto.",
  openGraph: {
    title: "Hub de Comunicação Científica do Lab-Div",
    description: "O hub oficial de comunicação científica da Física USP (IFUSP).",
    images: ['/api/og?title=Hub%20de%20Comunicação%20Científica&category=IFUSP'],
  },
  manifest: "/manifest.json",
  icons: {
    icon: '/icone-HUBLabDiv-circular.svg',
    shortcut: '/icone-HUBLabDiv-circular.svg',
    apple: '/icone-HUBLabDiv-circular.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LabDiv",
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

// import { DivAIAWidget } from "@/components/ia/DivAIAWidget";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value || '';
  const htmlClass = theme === 'dark' ? 'dark' : '';

  const impersonatedId = cookieStore.get('admin_impersonating_id')?.value;
  let impersonatedName = '';

  if (impersonatedId) {
    const supabase = await createServerSupabase();
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, username')
      .eq('id', impersonatedId)
      .single();
    impersonatedName = profile?.full_name || profile?.username || '';
  }

  return (
    <html lang="pt-BR" suppressHydrationWarning className={htmlClass}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://bqszadfunqgtfpaorwvx.supabase.co" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const supportDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${openSans.variable} ${bukraFallback.variable} ${materialSymbols.variable} font-open-sans selection:bg-brand-yellow selection:text-brand-blue bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-200 antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <LazyMotion features={domAnimation}>
          <QueryProvider>
            <AuthProvider>
              <ReadingExperienceProvider>
                <SearchProvider>
                <Toaster position="top-right" toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1E1E1E',
                    color: '#fff',
                    border: '1px solid #334155',
                    borderRadius: '16px',
                  },
                  ariaProps: {
                    role: 'status',
                    'aria-live': 'polite',
                  },
                }} />
                <OfflineBanner />
                <ClientPwaManager />
                <ReadingProgressBar />
                <SkipLink />
                <TelemetryManager />
                {/* Conditional Telemetry is managed internally by TelemetryManager */}


                {impersonatedId && <ImpersonationBanner impersonatedName={impersonatedName} />}

                {children}
                <CookieBanner />
                <RouteFocusManager />
                <VLibrasWidget />
                <BetaRegistrationModal />
                <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js" />
                {/* <DivAIAWidget /> */}
              </SearchProvider>
            </ReadingExperienceProvider>
          </AuthProvider>
          </QueryProvider>
        </LazyMotion>
      </body>
    </html>
  );
}
