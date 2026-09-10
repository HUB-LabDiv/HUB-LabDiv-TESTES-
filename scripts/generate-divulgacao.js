/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const QRCode = require('qrcode');

const CURRENT_ARTIFACTS_DIR = '/home/stangorlini/.gemini/antigravity-ide/brain/ef105eb8-8947-49df-a0ed-0e1f33d248ed';
const PREV_ARTIFACTS_DIR = '/home/stangorlini/.gemini/antigravity-ide/brain/428e32c7-567d-45d8-b7ad-ab5fde490f1e';
const ARTIFACTS_DIR = '/home/stangorlini/.gemini/antigravity-ide/brain/fd161ea1-fa7d-4972-bcde-115e845d6002';
const OLD_ARTIFACTS_DIR = '/home/stangorlini/.gemini/antigravity-ide/brain/845ad2ca-78f5-436f-8f31-e658577a520f';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUT_DIR = path.join(PUBLIC_DIR, 'divulgacao');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// 1. Read source assets
const bgIfSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'bg-if.svg'), 'utf-8');
const iconHubSvg = fs.readFileSync(path.join(PUBLIC_DIR, 'icone-HUBLabDiv.svg'), 'utf-8');
const cleanedIconHub = iconHubSvg.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!--[\s\S]*?-->/g, '').trim();

// High-contrast vibrant version of bg-if.svg for dark mode
const bgIfDarkSvg = bgIfSvg
  .replace(/fill="#0F4780"/g, 'fill="#38BDF8"')
  .replace(/stroke="#0F4780"/g, 'stroke="#38BDF8"')
  .replace(/fill="#F14343"/g, 'fill="#FF5C5C"')
  .replace(/stroke="#F14343"/g, 'stroke="#FF5C5C"')
  .replace(/fill="#FFCC00"/g, 'fill="#FFD21E"')
  .replace(/stroke="#FFCC00"/g, 'stroke="#FFD21E"')
  .replace(/font-size="14"/g, 'font-size="22"')
  .replace(/font-size="16"/g, 'font-size="25"')
  .replace(/font-size="18"/g, 'font-size="28"')
  .replace(/font-size="20"/g, 'font-size="31"')
  .replace(/font-size="22"/g, 'font-size="34"')
  .replace(/font-size="24"/g, 'font-size="38"')
  .replace(/font-family="Georgia, serif"/g, 'font-family="Georgia, serif" font-weight="bold"')
  .replace(/ r="1"/g, ' r="3"')
  .replace(/ r="1\.5"/g, ' r="4"')
  .replace(/ r="2"/g, ' r="4.8"')
  .replace(/rx="18" ry="6"/g, 'rx="28" ry="10"')
  .replace(/rx="14" ry="5"/g, 'rx="24" ry="9"')
  .replace(/rx="12" ry="4"/g, 'rx="22" ry="8"')
  .replace(/stroke-width="0\.6"/g, 'stroke-width="2.5"');

const bgIfDarkBase64 = Buffer.from(bgIfDarkSvg).toString('base64');

// Axis icons matching mobile navigation bar
const iconComunidadeSvg = `<svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
  <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Z"/>
</svg>`;

const iconCgifSvg = `<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v4" />
  <path d="M12 18v4" />
  <path d="M2 12h4" />
  <path d="M18 12h4" />
  <path d="M4.93 4.93l2.83 2.83" />
  <path d="M16.24 16.24l2.83 2.83" />
  <path d="M4.93 19.07l2.83-2.83" />
  <path d="M16.24 7.76l2.83-2.83" />
  <circle cx="12" cy="12" r="9.5" stroke-dasharray="2 2" stroke-width="1.5" />
  <circle cx="12" cy="12" r="4.2" stroke-width="1.6" />
  <path d="M12 9.5v5M9.5 12h5" stroke-width="2" />
  <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
</svg>`;

const iconFerramentasSvg = `<svg width="26" height="26" viewBox="0 -960 960 960" fill="currentColor">
  <path d="M756-120 537-339l84-84 219 219-84 84Zm-552 0-84-84 276-276-68-68-28 28-51-51v82l-28 28-121-121 28-28h82l-50-50 142-142q20-20 43-29t47-9q24 0 47 9t43 29l-92 92 50 50-28 28 68 68 90-90q-4-11-6.5-23t-2.5-24q0-59 40.5-99.5T701-841q15 0 28.5 3t27.5 9l-99 99 72 72 99-99q7 14 9.5 27.5T841-701q0 59-40.5 99.5T701-561q-12 0-24-2t-23-7L204-120Z"/>
</svg>`;

const commonHead = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    @page {
      size: A4 portrait;
      margin: 0;
    }
    html, body {
      width: 1240px;
      height: 1754px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    .font-bukra {
      font-family: 'Outfit', 'Segoe UI', -apple-system, sans-serif;
      letter-spacing: -0.5px;
    }
    .poster-container {
      position: relative;
      width: 1240px;
      height: 1754px;
      padding: 26px 42px 18px 42px;
      overflow: hidden;
    }
  </style>
`;

function buildPosterHtml({ qrWebSvg, qrPlaySvg }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <title>HUB LabDiv - Cartaz Oficial A4 Dark Mode</title>
  ${commonHead}
  <style>
    body {
      background-color: #0f131d;
      color: #FFFFFF;
    }
    .poster-container {
      background-color: #12141d;
      background-image: 
        radial-gradient(circle at 14% 45%, rgba(56, 189, 248, 0.28) 0%, transparent 46%),
        radial-gradient(circle at 86% 45%, rgba(255, 204, 0, 0.26) 0%, transparent 46%),
        radial-gradient(circle at 50% 86%, rgba(241, 67, 67, 0.28) 0%, transparent 48%);
    }
    .bg-math-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 1240px;
      height: 1754px;
      background-image: url('data:image/svg+xml;base64,${bgIfDarkBase64}');
      background-repeat: repeat;
      background-size: 780px 780px;
      opacity: 0.95;
      pointer-events: none;
      z-index: 1;
    }
    .content-layer {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* LOGO SECTION / HEADER CARD */
    .header-logo-group {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(180deg, rgba(20, 26, 40, 0.88) 0%, rgba(12, 16, 26, 0.94) 100%);
      border: 1.5px solid rgba(255, 255, 255, 0.16);
      border-radius: 26px;
      padding: 14px 28px;
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
      margin-top: 0;
    }
    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo-icon {
      width: 106px;
      height: 106px;
      flex-shrink: 0;
      filter: drop-shadow(0 0 24px rgba(15, 71, 128, 0.6));
    }
    .logo-text-title {
      font-size: 68px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -1.5px;
    }
    .logo-text-title .hub {
      color: #FFFFFF;
    }
    .logo-text-title .labdiv {
      background: linear-gradient(90deg, #0F4780 0%, #F14343 50%, #FFCC00 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .logo-subtitle {
      font-size: 20px;
      color: #E2E8F0;
      font-weight: 700;
      letter-spacing: 0.2px;
      margin-top: 5px;
      line-height: 1.3;
    }

    /* HERO BANNER */
    .hero-banner {
      margin-top: 12px;
      text-align: center;
      background: linear-gradient(180deg, rgba(16, 22, 36, 0.88) 0%, rgba(10, 14, 24, 0.94) 100%);
      border: 1.5px solid rgba(255, 255, 255, 0.16);
      border-radius: 28px;
      padding: 18px 30px;
      backdrop-filter: blur(16px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
    }
    .hero-headline {
      font-size: 65px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .hero-headline span.highlight {
      color: #38BDF8;
      text-shadow: 0 0 30px rgba(56, 189, 248, 0.6);
    }
    .hero-subtext {
      font-size: 22.5px;
      color: #E2E8F0;
      font-weight: 600;
      max-width: 1110px;
      margin: 0 auto;
      line-height: 1.45;
    }
    .hero-pills {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-top: 14px;
    }
    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 26px;
      border-radius: 9999px;
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .pill-yellow {
      background: rgba(255, 204, 0, 0.18);
      color: #FFCC00;
      border: 1.5px solid rgba(255, 204, 0, 0.5);
    }
    .pill-blue {
      background: rgba(15, 71, 128, 0.3);
      color: #60A5FA;
      border: 1.5px solid rgba(15, 71, 128, 0.6);
    }
    .pill-red {
      background: rgba(241, 67, 67, 0.18);
      color: #F87171;
      border: 1.5px solid rgba(241, 67, 67, 0.5);
    }

    /* 3 EIXOS SECTION - CARDS AMPLOS COM TEXTO GRANDE */
    .axes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-top: 14px;
    }
    .axis-card {
      background: rgba(16, 20, 30, 0.85);
      border-radius: 26px;
      padding: 22px 20px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      backdrop-filter: blur(16px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55);
      position: relative;
      overflow: hidden;
    }
    .axis-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
    }
    .axis-social, .axis-comunidade {
      border: 2px solid rgba(56, 189, 248, 0.45);
    }
    .axis-social::before, .axis-comunidade::before {
      background: #38BDF8;
      box-shadow: 0 0 16px #38BDF8;
    }
    .axis-informativo, .axis-cgif {
      border: 2px solid rgba(241, 67, 67, 0.45);
    }
    .axis-informativo::before, .axis-cgif::before {
      background: #F14343;
      box-shadow: 0 0 16px #F14343;
    }
    .axis-ferramentas {
      border: 2px solid rgba(255, 204, 0, 0.4);
    }
    .axis-ferramentas::before {
      background: #FFCC00;
      box-shadow: 0 0 16px #FFCC00;
    }
    .axis-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .axis-number {
      font-size: 16px;
      font-weight: 900;
      padding: 6px 14px;
      border-radius: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .axis-social .axis-number, .axis-comunidade .axis-number {
      background: rgba(15, 71, 128, 0.45);
      color: #38BDF8;
    }
    .axis-informativo .axis-number, .axis-cgif .axis-number {
      background: rgba(241, 67, 67, 0.22);
      color: #F87171;
    }
    .axis-ferramentas .axis-number {
      background: rgba(255, 204, 0, 0.22);
      color: #FFCC00;
    }
    .axis-icon-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 11px;
    }
    .axis-social .axis-icon-badge, .axis-comunidade .axis-icon-badge {
      background: rgba(56, 189, 248, 0.16);
      color: #38BDF8;
      border: 1px solid rgba(56, 189, 248, 0.35);
    }
    .axis-informativo .axis-icon-badge, .axis-cgif .axis-icon-badge {
      background: rgba(241, 67, 67, 0.16);
      color: #F87171;
      border: 1px solid rgba(241, 67, 67, 0.35);
    }
    .axis-ferramentas .axis-icon-badge {
      background: rgba(255, 204, 0, 0.16);
      color: #FFCC00;
      border: 1px solid rgba(255, 204, 0, 0.35);
    }
    .axis-title {
      font-size: 38px;
      font-weight: 900;
      color: #FFFFFF;
      margin-bottom: 14px;
      letter-spacing: -0.5px;
    }
    .axis-social .axis-tagline, .axis-social .axis-desc, .axis-comunidade .axis-tagline, .axis-comunidade .axis-desc { color: #7DD3FC; }
    .axis-informativo .axis-tagline, .axis-informativo .axis-desc, .axis-cgif .axis-tagline, .axis-cgif .axis-desc { color: #FCA5A5; }
    .axis-ferramentas .axis-tagline, .axis-ferramentas .axis-desc { color: #FCD34D; }

    .axis-features {
      list-style: none;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      gap: 10px;
    }
    .axis-feature-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 19px;
      line-height: 1.44;
      color: #E2E8F0;
    }
    .axis-feature-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 8px;
      flex-shrink: 0;
    }
    .axis-social .axis-feature-dot, .axis-comunidade .axis-feature-dot { background: #38BDF8; box-shadow: 0 0 8px #38BDF8; }
    .axis-informativo .axis-feature-dot, .axis-cgif .axis-feature-dot { background: #F14343; box-shadow: 0 0 8px #F14343; }
    .axis-ferramentas .axis-feature-dot { background: #FFCC00; box-shadow: 0 0 8px #FFCC00; }
    .axis-feature-item strong {
      color: #FFFFFF;
      font-weight: 800;
      font-size: 19.5px;
    }

    /* QR CODE SECTION AMPLIADA */
    .qr-section {
      margin-top: 12px;
      background: linear-gradient(135deg, rgba(22, 26, 38, 0.94) 0%, rgba(14, 17, 26, 0.98) 100%);
      border: 2px solid rgba(255, 255, 255, 0.16);
      border-radius: 28px;
      padding: 18px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(18px);
    }
    .qr-cta-text {
      max-width: 545px;
    }
    .qr-cta-badge {
      font-size: 17px;
      font-weight: 900;
      color: #FFCC00;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qr-cta-badge::before {
      content: '';
      display: inline-block;
      width: 11px;
      height: 11px;
      background: #FFCC00;
      border-radius: 50%;
      box-shadow: 0 0 10px #FFCC00;
    }
    .qr-cta-title {
      font-size: 46px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.12;
      text-transform: uppercase;
      letter-spacing: -0.5px;
    }
    .qr-cta-desc {
      font-size: 20px;
      color: #CBD5E1;
      margin-top: 8px;
      line-height: 1.42;
    }
    .qr-institutos-callout {
      margin-top: 10px;
      background: rgba(56, 189, 248, 0.1);
      border: 1.5px solid rgba(56, 189, 248, 0.35);
      border-radius: 14px;
      padding: 10px 14px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .qr-institutos-callout .callout-sparkle {
      color: #38BDF8;
      font-size: 18px;
      line-height: 1.2;
    }
    .qr-institutos-callout .callout-body {
      font-size: 16.5px;
      line-height: 1.4;
      color: #E2E8F0;
    }
    .qr-institutos-callout .callout-body strong {
      color: #38BDF8;
      font-weight: 800;
      letter-spacing: 0.2px;
    }
    .qr-cta-perks {
      margin-top: 10px;
      font-size: 17px;
      font-weight: 700;
      color: #94A3B8;
      display: flex;
      gap: 16px;
    }
    .qr-cards-wrap {
      display: flex;
      gap: 22px;
    }
    .qr-card-item {
      background: linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #0F4780 0%, #38BDF8 32%, #F14343 68%, #FFCC00 100%) border-box;
      border: 3.5px solid transparent;
      border-radius: 24px;
      padding: 16px 14px 18px 14px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 18px 38px rgba(0, 0, 0, 0.55), 0 0 24px rgba(56, 189, 248, 0.28);
      width: 226px;
      text-align: center;
    }
    .qr-svg-holder {
      width: 190px;
      height: 190px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FFFFFF;
    }
    .qr-svg-holder svg {
      width: 100%;
      height: 100%;
      display: block;
    }
    .qr-center-badge {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50px;
      height: 50px;
      background: linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(135deg, #0F4780 0%, #F14343 50%, #FFCC00 100%) border-box;
      border: 2px solid transparent;
      border-radius: 12px;
      box-shadow: 0 0 0 2px #FFFFFF, 0 3px 12px rgba(0, 0, 0, 0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
      z-index: 10;
    }
    .qr-center-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-card-label {
      margin-top: 12px;
      font-size: 17.5px;
      font-weight: 900;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 6px;
      white-space: nowrap;
    }
    .qr-card-sub {
      font-size: 14.5px;
      font-weight: 700;
      color: #475569;
      margin-top: 3px;
      white-space: nowrap;
    }

    /* FOOTER */
    .footer-bar {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      background: linear-gradient(180deg, rgba(16, 22, 36, 0.94) 0%, rgba(10, 14, 24, 0.98) 100%);
      border: 1.5px solid rgba(255, 255, 255, 0.16);
      border-radius: 20px;
      padding: 14px 26px;
      backdrop-filter: blur(18px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.5);
    }
    .footer-top-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      white-space: nowrap;
    }
    .footer-software-livre {
      color: #FFCC00;
      font-weight: 800;
      font-size: 16.5px;
      letter-spacing: 0.6px;
    }
    .footer-github {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #CBD5E1;
      font-weight: 700;
      font-size: 16.5px;
    }
    .footer-github .github-label {
      color: #94A3B8;
      font-weight: 700;
      font-size: 15.5px;
      letter-spacing: 0.5px;
    }
    .footer-github .github-url {
      color: #38BDF8;
      font-weight: 800;
      font-size: 16.5px;
      text-decoration: none;
    }
    .footer-bottom-line {
      font-size: 16px;
      color: #CBD5E1;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="bg-math-pattern"></div>
    <div class="content-layer">
      <!-- Top header bar -->
      <div>
        <div class="header-logo-group">
          <div class="logo-wrapper">
            <div class="logo-icon">
              ${cleanedIconHub}
            </div>
            <div>
              <div class="logo-text-title font-bukra">
                <span class="hub">HUB</span> <span class="labdiv">LabDiv</span>
              </div>
              <div class="logo-subtitle">O HUB de comunicação científica do Laboratório de expressão e divulgação do IFUSP</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hero Callout -->
      <div class="hero-banner">
        <h1 class="hero-headline font-bukra">
          O <span class="highlight">HUB</span> do Universitário
        </h1>
        <p class="hero-subtext">
          Uma plataforma digital que reune diversas funções para facilitar a vida do universitário (discente ou docente) ajudando-os a se informar, planejar, acompanhar o curso e se conectar com outros do instituto e de fora dele, se tratando não de uma mera extensão da &ldquo;ciência&rdquo; feita na academia e sim um processo comunicativo.
        </p>
      </div>

      <!-- Os 3 Eixos -->
      <div class="axes-grid">
        <!-- Eixo 1: Social -->
        <div class="axis-card axis-social">
          <div class="axis-header font-bukra">
            <div class="axis-number">Eixo 1</div>
            <div class="axis-icon-badge">${iconComunidadeSvg}</div>
          </div>
          <h3 class="axis-title font-bukra">Social</h3>
          <ul class="axis-features">
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Fluxo:</strong> Feed pedagógico estimulando o pensar crítico sobre a ciência e seus efeitos na sociedade, sem métricas de vaidade.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Logs & Arte:</strong> Desabafos cotidianos e expressões artísticas que contextualizam os bastidores da pesquisa e humanizam quem faz a ciência.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Central de Interações:</strong> Emaranhamento Quântico (mensagens criptografadas) e canal &ldquo;Pergunte a um Cientista&rdquo; para mentoria direta.</div>
            </li>
          </ul>
        </div>

        <!-- Eixo 2: Informativo -->
        <div class="axis-card axis-informativo">
          <div class="axis-header font-bukra">
            <div class="axis-number">Eixo 2</div>
            <div class="axis-icon-badge">${iconCgifSvg}</div>
          </div>
          <h3 class="axis-title font-bukra">Informativo</h3>
          <ul class="axis-features">
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Wiki Central:</strong> As informações presentes em manuais do curso, PPPs, editais, Júpiter e portais reunidas e organizadas para você não se perder mais.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>O Instituto:</strong> História, departamentos, mapa interativo, coletivos, iniciativas e divulgadores do instituto reunidos em um só lugar.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Interativo:</strong> Testes de perfil, quizzes, canal de dúvidas (SAC) e mural de oportunidades de estágios, bolsas, eventos e cursos.</div>
            </li>
          </ul>
        </div>

        <!-- Eixo 3: Ferramentas -->
        <div class="axis-card axis-ferramentas">
          <div class="axis-header font-bukra">
            <div class="axis-number">Eixo 3</div>
            <div class="axis-icon-badge">${iconFerramentasSvg}</div>
          </div>
          <h3 class="axis-title font-bukra">Ferramentas</h3>
          <ul class="axis-features">
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Grade & Trilhas:</strong> Ambiente para acompanhar e planejar o andamento do curso ou/e do semestre com sincronização via Júpiter, controle de faltas, evolução no curso e pré-requisitos.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Match Acadêmico:</strong> Adoção de calouros por veteranos, conexão para Iniciação Científica (IC) e grupos de estudo por matéria.</div>
            </li>
            <li class="axis-feature-item">
              <span class="axis-feature-dot"></span>
              <div><strong>Central de Anotações:</strong> Compartilhamento colaborativo de cadernos e anotações entre turmas e disciplinas.</div>
            </li>
          </ul>
        </div>
      </div>

      <!-- QR Codes Section -->
      <div class="qr-section">
        <div class="qr-cta-text">
          <div class="qr-cta-badge font-bukra">Acesso Imediato & Gratuito</div>
          <h2 class="qr-cta-title font-bukra">Experimente o HUB Agora</h2>
          <p class="qr-cta-desc">
            Teste essas e muitas outras funções agora: basta apontar a câmera do celular para os QR Codes ao lado para acessar pelo navegador ou instalar o aplicativo oficial (versão para IOS e PC ainda em desenvolvimento).
          </p>
          <div class="qr-institutos-callout">
            <span class="callout-sparkle">✦</span>
            <div class="callout-body">
              <strong>Funções personalizadas para outros institutos além do IFUSP estão em desenvolvimento.</strong> Até lá, qualquer um pode baixar e testar a plataforma (muitas funções não são focadas em um instituto).
            </div>
          </div>
          <div class="qr-cta-perks font-bukra">
            <span>✓ Sincronização em Nuvem</span>
            <span>✓ Modo Offline PWA</span>
            <span>✓ 100% Gratuito</span>
          </div>
        </div>

        <div class="qr-cards-wrap">
          <!-- QR Web -->
          <div class="qr-card-item">
            <div class="qr-svg-holder">
              ${qrWebSvg}
              <div class="qr-center-badge">
                <div class="qr-center-icon">
                  ${cleanedIconHub}
                </div>
              </div>
            </div>
            <div class="qr-card-label font-bukra">🌐 Acesse no Site</div>
            <div class="qr-card-sub">hub-lab-div.vercel.app</div>
          </div>

          <!-- QR PlayStore -->
          <div class="qr-card-item">
            <div class="qr-svg-holder">
              ${qrPlaySvg}
              <div class="qr-center-badge">
                <div class="qr-center-icon">
                  ${cleanedIconHub}
                </div>
              </div>
            </div>
            <div class="qr-card-label font-bukra">▶ Google Play</div>
            <div class="qr-card-sub">App Oficial Android</div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-bar">
        <div class="footer-top-line font-bukra">
          <div class="footer-software-livre">
            SOFTWARE LIVRE (LICENÇA AGPLv3) &bull; CÓDIGO ABERTO
          </div>
          <div class="footer-github">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#CBD5E1" style="flex-shrink: 0;">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span class="github-label">Repositório Público:</span>
            <span class="github-url">https://github.com/HUB-LabDiv/HUB-LabDiv</span>
          </div>
        </div>
        <div class="footer-bottom-line">
          Laboratório de Divulgação Científica (LabDiv) &bull; Instituto de Física da Universidade de São Paulo (IFUSP)
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  console.log('Generating high-tolerance QR codes with level H...');
  const qrWebSvg = await QRCode.toString('https://hub-lab-div.vercel.app', {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1
  });

  const qrPlaySvg = await QRCode.toString('https://play.google.com/store/apps/details?id=br.usp.ifusp.hublabdiv', {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1
  });

  const posterHtml = buildPosterHtml({ qrWebSvg, qrPlaySvg });

  const htmlPath = path.join(OUT_DIR, 'poster-1-dark-mode.html');
  fs.writeFileSync(htmlPath, posterHtml, 'utf-8');
  console.log(`Saved HTML: ${htmlPath}`);

  console.log('Launching headless chromium via puppeteer-core...');
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1240,
      height: 1754,
      deviceScaleFactor: 2 // 2480 x 3508 px (300 DPI A4)
    },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1240,
    height: 1754,
    deviceScaleFactor: 2
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  await page.evaluateHandle('document.fonts.ready');
  await new Promise(r => setTimeout(r, 600));

  // 1. Take PNG screenshot at 300 DPI
  const pngPath = path.join(OUT_DIR, 'poster-1-dark-mode.png');
  await page.screenshot({
    path: pngPath,
    type: 'png',
    clip: { x: 0, y: 0, width: 1240, height: 1754 }
  });
  console.log(`Rendered PNG: ${pngPath}`);

  for (const dir of [CURRENT_ARTIFACTS_DIR, PREV_ARTIFACTS_DIR, ARTIFACTS_DIR, OLD_ARTIFACTS_DIR]) {
    if (fs.existsSync(dir)) {
      fs.copyFileSync(pngPath, path.join(dir, 'poster-1-dark-mode.png'));
    }
  }

  // 2. Generate vector PDF
  const pdfPath = path.join(OUT_DIR, 'poster-1-dark-mode.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });
  console.log(`Rendered PDF: ${pdfPath}`);

  for (const dir of [CURRENT_ARTIFACTS_DIR, PREV_ARTIFACTS_DIR, ARTIFACTS_DIR, OLD_ARTIFACTS_DIR]) {
    if (fs.existsSync(dir)) {
      fs.copyFileSync(pdfPath, path.join(dir, 'poster-1-dark-mode.pdf'));
    }
  }

  await page.close();
  await browser.close();
  console.log('Poster generated successfully with 300 DPI quality and branded QR codes with central HUB symbol!');
}

main().catch(err => {
  console.error('Generation error:', err);
  process.exit(1);
});
