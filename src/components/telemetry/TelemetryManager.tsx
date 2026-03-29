'use client';

import { useTimeOnPage } from '@/hooks/useTimeOnPage';
import { useRageClickTracker } from '@/hooks/useRageClickTracker';
import { useOmniscientMatrix } from '@/hooks/useOmniscientMatrix';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

/**
 * 🛰️ TelemetryManager Component (V8 - ECA/LGPD Compliance)
 * Centralized client-side component to initialize global telemetry sensors.
 * Microsoft Clarity ONLY loads if the user is Logged In + Adult + Gave Consent.
 */
export function TelemetryManager() {
    const { user: authUser } = useAuth();
    const [canLoadClarity, setCanLoadClarity] = useState(false);

    // Initialize Global Sensors (Internal)
    useTimeOnPage();
    useRageClickTracker();
    useOmniscientMatrix();

    useEffect(() => {
        const verifyConsentAndAge = async () => {
            // 1. Visitante Anônimo -> Bloqueia Imediatamente
            if (!authUser) {
                setCanLoadClarity(false);
                return;
            }

            // 2. Cookie de Aceite (Opt-In Absoluto)
            const consent = localStorage.getItem('cookie_consent');
            if (consent !== 'true') {
                setCanLoadClarity(false);
                return;
            }

            // 3. Checagem do ECA (Maioridade)
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_adult')
                .eq('id', authUser.id)
                .single();

            if (profile?.is_adult === true) {
                setCanLoadClarity(true);
            } else {
                setCanLoadClarity(false);
            }
        };

        verifyConsentAndAge();

        // Escuta mundanças em tempo real de consentimento pelo CookieBanner
        const handleConsentChange = () => {
            verifyConsentAndAge();
        };

        window.addEventListener('cookie_consent_changed', handleConsentChange);
        return () => window.removeEventListener('cookie_consent_changed', handleConsentChange);

    }, [authUser]);

    return (
        <>
            {canLoadClarity && process.env.NEXT_PUBLIC_CLARITY_ID && (
                <Script
                    id="microsoft-clarity"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                          (function(c,l,a,r,i,t,y){
                              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
                        `,
                    }}
                />
            )}
        </>
    );
}
