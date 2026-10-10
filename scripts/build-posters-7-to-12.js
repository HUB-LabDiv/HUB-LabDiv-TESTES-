/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const QRCode = require('qrcode');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const POSTERS_ROOT = path.join(PROJECT_ROOT, 'public/divulgacao/posters');
const ARTIFACTS_DIR = '/home/stangorlini/.gemini/antigravity-ide/brain/8eedeacd-9d14-43b8-bbae-27449bc2b2fb';

async function main() {
  console.log('🎨 Iniciando geração das 6 Propostas de Design Únicas (Posters 7 a 12)...');
  console.log('🎯 Modelo: 1) Logo HUB em Destaque Máximo -> 2) Chamada/Título em Segundo Plano -> 3) Eixos & QR Code em Terceiro');

  // 1. Preparar assets base embutidos (100% self-contained)
  const bgIfSvg = fs.readFileSync(path.join(PROJECT_ROOT, 'public/bg-if.svg'), 'utf8');
  const bgIfContrastSvg = bgIfSvg
    .replace(/fill="#FFCC00"/g, 'fill="#D97706"')
    .replace(/stroke="#FFCC00"/g, 'stroke="#D97706"')
    .replace(/font-size="14"/g, 'font-size="19"')
    .replace(/font-size="16"/g, 'font-size="22"')
    .replace(/font-size="18"/g, 'font-size="25"')
    .replace(/font-size="20"/g, 'font-size="28"')
    .replace(/font-size="22"/g, 'font-size="31"')
    .replace(/font-size="24"/g, 'font-size="34"')
    .replace(/font-family="Georgia, serif"/g, 'font-family="Georgia, serif" font-weight="600"')
    .replace(/stroke-width="0\.6"/g, 'stroke-width="1.3"')
    .replace(/ r="1"/g, ' r="2"')
    .replace(/ r="1\.5"/g, ' r="2.8"')
    .replace(/ r="2"/g, ' r="3.5"');
  const bgIfBase64 = Buffer.from(bgIfContrastSvg).toString('base64');

  const hubIconSvg = fs.readFileSync(path.join(PROJECT_ROOT, 'public/icone-HUBLabDiv.svg'), 'utf8')
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();

  // QR Code base
  const qrSvg = await QRCode.toString('https://hub.labdiv.com.br/divulgacao', {
    type: 'svg',
    errorCorrectionLevel: 'H',
    margin: 1
  });

  // Badge central do QR em base64
  let qrBadgeBase64 = '';
  const qrBadgePath = path.join(PROJECT_ROOT, 'public/icone-HUBLabDiv-white.png');
  if (fs.existsSync(qrBadgePath)) {
    qrBadgeBase64 = fs.readFileSync(qrBadgePath).toString('base64');
  }

  // Bloco institucional padronizado oficial (AGPLv3 & Conformidade Legal)
  function renderInstitutionalBox() {
    return `
      <div class="bottom-inst-box">
        <div>
          <div class="inst-badge-line font-bukra">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
            <span>SEGURANÇA &amp; CONFORMIDADE LEGAL</span>
          </div>
          <p class="inst-desc-text font-open-sans">
            O <strong>HUB LabDiv</strong> respeita as <strong>leis, normas e decisões judiciais do Brasil</strong>, além de ter todo o seu <strong>código aberto</strong> e um e-mail para <strong>suporte, sugestões e ideias da comunidade</strong>.
          </p>
        </div>

        <div class="inst-actions-row font-bukra">
          <div class="inst-action-card">
            <div class="inst-action-icon git-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </div>
            <div class="inst-action-details font-bukra">
              <span class="inst-action-tag tag-git">Código Aberto • AGPLv3</span>
              <span class="inst-action-val">github.com/HUB-LabDiv</span>
            </div>
          </div>

          <div class="inst-action-card">
            <div class="inst-action-icon email-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="3"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </div>
            <div class="inst-action-details font-bukra">
              <span class="inst-action-tag tag-email">Suporte &amp; Ideias</span>
              <span class="inst-action-val">hublabdiv@gmail.com</span>
            </div>
          </div>
        </div>

        <div class="inst-legal-copy font-bukra">
          <span>Licença AGPLv3 &bull; LabDiv &bull; Instituto de Física da Universidade de São Paulo (IFUSP)</span>
        </div>
      </div>
    `;
  }

  function renderQrBox(color = '#0F4780') {
    return `
      <div class="bottom-qr-col">
        <div class="qr-code-box" style="border-color: ${color}40;">
          ${qrSvg}
          <div class="qr-center-badge-img">
            <img src="data:image/png;base64,${qrBadgeBase64}" alt="HUB Logo" />
          </div>
        </div>
        <a class="qr-clean-link font-bukra" style="color: ${color};" href="https://hub.labdiv.com.br/divulgacao">hub.labdiv.com.br/divulgacao</a>
      </div>
    `;
  }

  // Definições de Estilo CSS Compartilhado
  const baseHead = (title) => `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="../../fonts/fonts.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    @font-face {
      font-family: '29LT Bukra';
      src: local('29LT Bukra Semi Wide Bold'), local('29LT Bukra Bold'), local('29LTBukra-Bold'),
           url('../../fonts/Outfit-Black.ttf') format('truetype');
      font-weight: 700 900;
      font-display: swap;
    }
    .font-bukra { font-family: '29LT Bukra', 'Outfit', sans-serif; }
    .font-open-sans { font-family: 'Open Sans', sans-serif; }

    body {
      background-color: #FFFFFF;
      color: #0F172A;
      width: 1240px;
      height: 1754px;
      overflow: hidden;
      margin: 0;
      padding: 0;
    }
    .poster-container {
      width: 1240px;
      height: 1754px;
      position: relative;
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .bg-math-pattern {
      position: absolute;
      top: 0; left: 0;
      width: 1240px; height: 1754px;
      background-image: url('data:image/svg+xml;base64,${bgIfBase64}');
      background-repeat: repeat;
      background-size: 1100px 1100px;
      opacity: 0.52;
      pointer-events: none;
      z-index: 1;
    }
    .brand-gradient-line-top {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 6px;
      background: linear-gradient(90deg, #0F4780 0%, #0284C7 35%, #F14343 70%, #FFCC00 100%);
      z-index: 50;
    }

    /* Rodapé institucional padrão */
    .bottom-third-plane {
      position: absolute;
      bottom: 45px; left: 45px; right: 45px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      z-index: 30;
    }
    .bottom-qr-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .qr-code-box {
      width: 270px; height: 270px;
      background: #FFFFFF;
      padding: 12px;
      border-radius: 26px;
      border: 2.5px solid rgba(15, 71, 128, 0.20);
      box-shadow: 0 18px 40px -4px rgba(15, 71, 128, 0.16), 0 4px 14px rgba(0, 0, 0, 0.06);
      position: relative;
      display: flex; align-items: center; justify-content: center;
    }
    .qr-code-box svg { width: 100%; height: 100%; display: block; }
    .qr-center-badge-img {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 72px; height: 72px;
      display: flex; align-items: center; justify-content: center;
      background: #0F4780;
      border-radius: 18px;
      padding: 6px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .qr-center-badge-img img { width: 100%; height: 100%; object-fit: contain; }
    .qr-clean-link {
      font-size: 20px; font-weight: 800; color: #0F4780;
      text-decoration: underline; text-underline-offset: 5px;
    }

    .bottom-inst-box {
      flex: 1; height: 270px;
      background: #F8FAFC;
      border-radius: 26px;
      border: 2px solid #E2E8F0;
      padding: 22px 26px 18px 26px;
      display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: 0 10px 28px rgba(0, 0, 0, 0.05);
    }
    .inst-badge-line {
      display: flex; align-items: center; gap: 9px;
      color: #0F4780; font-size: 15.5px; font-weight: 800;
      margin-bottom: 6px;
    }
    .inst-desc-text {
      font-size: 15.5px; line-height: 1.44; color: #334155;
    }
    .inst-actions-row { display: flex; align-items: center; gap: 12px; }
    .inst-action-card {
      flex: 1; background: #FFFFFF; border: 1.5px solid #CBD5E1;
      padding: 8px 12px; border-radius: 12px;
      display: flex; align-items: center; gap: 10px;
    }
    .inst-action-icon {
      width: 34px; height: 34px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .inst-action-icon.git-icon { background: #EEF4FA; color: #0F4780; }
    .inst-action-icon.email-icon { background: #FEF2F2; color: #F14343; }
    .inst-action-details { display: flex; flex-direction: column; gap: 2px; }
    .inst-action-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; }
    .inst-action-tag.tag-git { color: #0F4780; }
    .inst-action-tag.tag-email { color: #F14343; }
    .inst-action-val { font-size: 13px; font-weight: 700; color: #0F172A; white-space: nowrap; }
    .inst-legal-copy {
      font-size: 12.5px; color: #64748B; font-weight: 600;
      border-top: 1.5px solid #E2E8F0; padding-top: 8px; text-align: center;
    }
  </style>
  `;

  // =========================================================================
  // PROPOSTA 7: "The Orbital Gravity Core" (Sistema Orbital Dinâmico com Núcleo Hero)
  // =========================================================================
  const htmlPoster7 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 7: Orbital Core')}
  <style>
    /* 1. TOPO: CHAMADA / TÍTULO EM SEGUNDO PLANO */
    .p7-header {
      position: relative; z-index: 25;
      text-align: center; padding-top: 95px; padding-left: 40px; padding-right: 40px;
    }
    .p7-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #EEF4FA; border: 1.5px solid rgba(15, 71, 128, 0.22);
      border-radius: 9999px; padding: 6px 20px; margin-bottom: 16px;
      color: #0F4780; font-size: 13px; font-weight: 800; text-transform: uppercase;
    }
    .p7-title {
      font-size: 82px; font-weight: 900; line-height: 1.12; color: #0F172A;
      letter-spacing: -1.5px; margin-bottom: 12px;
    }
    .p7-title span { color: #0F4780; }
    .p7-subtitle {
      font-size: 23px; font-weight: 600; color: #475569; max-width: 980px; margin: 0 auto;
    }

    /* 2. CENTRO: O ÍCONE HERO É O DESTAQUE MÁXIMO ABSOLUTO */
    .p7-orbital-zone {
      position: absolute; top: 410px; left: 0; width: 1240px; height: 800px; z-index: 20;
    }
    .p7-hero-podium {
      position: absolute; top: 70px; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; z-index: 30;
    }
    .p7-hero-shield {
      width: 330px; height: 330px; background: #FFFFFF;
      border-radius: 75px; border: 4px solid rgba(15, 71, 128, 0.18);
      box-shadow: 0 35px 75px -10px rgba(15, 71, 128, 0.32), 0 10px 25px rgba(0,0,0,0.08);
      display: flex; align-items: center; justify-content: center; padding: 25px;
    }
    .p7-hero-shield svg { width: 245px; height: 245px; }
    .p7-hero-name {
      margin-top: 16px; font-size: 38px; font-weight: 900; color: #0F172A;
    }
    .p7-hero-name span {
      background: linear-gradient(90deg, #0F4780 0%, #F14343 50%, #D97706 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    /* 3. TERCEIRO PLANO: OS 3 EIXOS ORBITANDO O NÚCLEO */
    .p7-card {
      position: absolute; background: #FFFFFF; border-radius: 22px;
      padding: 18px 22px; box-sizing: border-box; z-index: 15;
    }
    .p7-card-social {
      top: 130px; left: 50px; width: 320px;
      border: 2.5px solid rgba(15, 71, 128, 0.25); border-top: 6px solid #0F4780;
      box-shadow: 0 18px 36px rgba(15, 71, 128, 0.12);
    }
    .p7-card-info {
      top: 130px; right: 50px; width: 320px;
      border: 2.5px solid rgba(241, 67, 67, 0.25); border-top: 6px solid #F14343;
      box-shadow: 0 18px 36px rgba(241, 67, 67, 0.12);
    }
    .p7-card-tools {
      bottom: 45px; left: 50%; transform: translateX(-50%); width: 560px;
      border: 2.5px solid rgba(255, 204, 0, 0.45); border-top: 6px solid #FFCC00;
      box-shadow: 0 18px 36px rgba(217, 119, 6, 0.15);
    }
    .p7-card-title { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
    .p7-card-desc { font-size: 15px; font-weight: 600; color: #334155; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- SEGUNDO PLANO: CHAMADA / TÍTULO -->
    <header class="p7-header">
      <div class="p7-badge font-bukra">IFUSP &bull; Laboratório de Expressão e Divulgação da Ciência</div>
      <h1 class="p7-title font-bukra">Conecte-se ao HUB<br><span>da graduação do IFUSP</span></h1>
      <p class="p7-subtitle font-open-sans">A plataforma de comunicação científica e apoio acadêmico que une os estudantes de física.</p>
    </header>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): ÍCONE DO HUB -->
    <div class="p7-orbital-zone">
      <svg style="position: absolute; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 1240 800">
        <circle cx="620" cy="235" r="240" fill="none" stroke="#0F4780" stroke-width="1.8" stroke-dasharray="6 6" opacity="0.35" />
        <circle cx="620" cy="235" r="350" fill="none" stroke="#F14343" stroke-width="1.4" stroke-dasharray="5 7" opacity="0.25" />
        <path d="M 450 235 L 370 215" stroke="#0F4780" stroke-width="2.5" stroke-dasharray="4 4" opacity="0.6" />
        <path d="M 790 235 L 870 215" stroke="#F14343" stroke-width="2.5" stroke-dasharray="4 4" opacity="0.6" />
        <path d="M 620 400 L 620 540" stroke="#D97706" stroke-width="2.5" stroke-dasharray="4 4" opacity="0.6" />
      </svg>

      <div class="p7-hero-podium">
        <div class="p7-hero-shield">
          ${hubIconSvg}
        </div>
        <div class="p7-hero-name font-bukra">HUB <span>LabDiv</span></div>
      </div>

      <!-- TERCEIRO PLANO: OS 3 EIXOS -->
      <div class="p7-card p7-card-social">
        <h3 class="p7-card-title font-bukra" style="color: #0F4780;">Eixo Social</h3>
        <p class="p7-card-desc font-open-sans">Rede pedagógica para conectar estudantes, grupos de estudo e docentes do IFUSP.</p>
      </div>

      <div class="p7-card p7-card-info">
        <h3 class="p7-card-title font-bukra" style="color: #F14343;">Eixo Informativo</h3>
        <p class="p7-card-desc font-open-sans">Enciclopédia acadêmica interativa, histórico da ciência e acervo oficial das matérias.</p>
      </div>

      <div class="p7-card p7-card-tools">
        <h3 class="p7-card-title font-bukra" style="color: #854D0E;">Eixo Ferramentas</h3>
        <p class="p7-card-desc font-open-sans">Simuladores numéricos, calculadoras interativas e utilitários acadêmicos para a rotina universitária.</p>
      </div>
    </div>

    <!-- TERCEIRO PLANO: QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#0F4780')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // =========================================================================
  // PROPOSTA 8: "The Monumental Pillar & Tri-Column Grid" (Monólito Hero Superior & Colunas Verticais)
  // =========================================================================
  const htmlPoster8 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 8: Monumental Pillar')}
  <style>
    /* 1. PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB MONUMENTAL NO TOPO */
    .p8-hero-zone {
      position: relative; z-index: 30;
      display: flex; flex-direction: column; align-items: center;
      padding-top: 85px;
    }
    .p8-hero-box {
      width: 360px; height: 360px; background: #FFFFFF;
      border-radius: 80px; border: 4px solid rgba(15, 71, 128, 0.22);
      box-shadow: 0 40px 85px -12px rgba(15, 71, 128, 0.35), 0 12px 30px rgba(0,0,0,0.09);
      display: flex; align-items: center; justify-content: center; padding: 28px;
    }
    .p8-hero-box svg { width: 280px; height: 280px; }

    /* 2. PLANO 2 (SEGUNDO PLANO): CHAMADA / TÍTULO LOGO ABAIXO DO ÍCONE */
    .p8-headline-zone {
      position: relative; z-index: 25; text-align: center; margin-top: 28px;
      padding-left: 40px; padding-right: 40px;
    }
    .p8-title {
      font-size: 78px; font-weight: 900; line-height: 1.10; color: #0F172A; letter-spacing: -1.6px;
    }
    .p8-title-grad {
      background: linear-gradient(90deg, #0F4780 0%, #0284C7 50%, #F14343 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .p8-subtitle {
      font-size: 23px; font-weight: 600; color: #475569; margin-top: 10px; max-width: 1000px; margin-left: auto; margin-right: auto;
    }

    /* 3. PLANO 3 (TERCEIRO PLANO): 3 COLUNAS VERTICAIS LADO A LADO */
    .p8-tri-grid {
      position: relative; z-index: 20;
      display: flex; justify-content: space-between; gap: 24px;
      margin: 36px 45px 0 45px;
    }
    .p8-col-card {
      flex: 1; background: #FFFFFF; border-radius: 24px; padding: 22px 20px;
      box-shadow: 0 16px 36px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 8px;
    }
    .p8-col-card.social { border: 2px solid rgba(15, 71, 128, 0.25); border-top: 6px solid #0F4780; }
    .p8-col-card.info { border: 2px solid rgba(241, 67, 67, 0.25); border-top: 6px solid #F14343; }
    .p8-col-card.tools { border: 2px solid rgba(255, 204, 0, 0.45); border-top: 6px solid #FFCC00; }
    .p8-col-title { font-size: 24px; font-weight: 900; }
    .p8-col-desc { font-size: 15px; font-weight: 600; color: #334155; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB -->
    <div class="p8-hero-zone">
      <div class="p8-hero-box">
        ${hubIconSvg}
      </div>
    </div>

    <!-- PLANO 2 (SEGUNDO PLANO): CHAMADA / TÍTULO -->
    <div class="p8-headline-zone">
      <h1 class="p8-title font-bukra">
        A Plataforma Oficial<br><span class="p8-title-grad">da Graduação do IFUSP</span>
      </h1>
      <p class="p8-subtitle font-open-sans">
        O ambiente completo de apoio acadêmico, ciência aberta e colaboração universitária.
      </p>
    </div>

    <!-- PLANO 3 (TERCEIRO PLANO): OS 3 EIXOS EM GRID MODULAR -->
    <div class="p8-tri-grid">
      <div class="p8-col-card social">
        <h3 class="p8-col-title font-bukra" style="color: #0F4780;">1. Social</h3>
        <p class="p8-col-desc font-open-sans">Conexão direta entre estudantes, grupos de estudos e docentes da física.</p>
      </div>
      <div class="p8-col-card info">
        <h3 class="p8-col-title font-bukra" style="color: #F14343;">2. Informativo</h3>
        <p class="p8-col-desc font-open-sans">Histórico da ciência, enciclopédia acadêmica e banco de materiais didáticos.</p>
      </div>
      <div class="p8-col-card tools">
        <h3 class="p8-col-title font-bukra" style="color: #854D0E;">3. Ferramentas</h3>
        <p class="p8-col-desc font-open-sans">Simuladores numéricos, calculadoras de física e utilitários para acelerar o curso.</p>
      </div>
    </div>

    <!-- PLANO 3 (TERCEIRO PLANO): QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#0F4780')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // =========================================================================
  // PROPOSTA 9: "The Scientific Prism / Triangular Symmetry" (Prisma Óptico & Feixes Geométricos)
  // =========================================================================
  const htmlPoster9 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 9: Scientific Prism')}
  <style>
    /* 1. SEGUNDO PLANO: CHAMADA / TÍTULO */
    .p9-header {
      position: relative; z-index: 25; text-align: center;
      padding-top: 95px; padding-left: 45px; padding-right: 45px;
    }
    .p9-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #FEF2F2; border: 1.5px solid rgba(241, 67, 67, 0.28);
      border-radius: 9999px; padding: 6px 22px; color: #F14343;
      font-size: 13px; font-weight: 800; text-transform: uppercase; margin-bottom: 14px;
    }
    .p9-title {
      font-size: 80px; font-weight: 900; line-height: 1.10; color: #0F172A; letter-spacing: -1.6px;
    }
    .p9-title span { color: #F14343; }
    .p9-subtitle {
      font-size: 23px; font-weight: 600; color: #475569; max-width: 1000px; margin: 10px auto 0 auto;
    }

    /* 2. PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB CENTRALIZADA NO EPICENTRO */
    .p9-prism-zone {
      position: absolute; top: 430px; left: 0; width: 1240px; height: 770px; z-index: 20;
    }
    .p9-hero-prism {
      position: absolute; top: 90px; left: 50%; transform: translateX(-50%);
      width: 325px; height: 325px; background: #FFFFFF;
      border-radius: 50%; border: 4px solid rgba(241, 67, 67, 0.25);
      box-shadow: 0 35px 80px -10px rgba(241, 67, 67, 0.30), 0 10px 25px rgba(0,0,0,0.08);
      display: flex; align-items: center; justify-content: center; z-index: 30;
    }
    .p9-hero-prism svg { width: 235px; height: 235px; }

    /* 3. TERCEIRO PLANO: OS 3 EIXOS NOS VÉRTICES DO PRISMA */
    .p9-vertex-card {
      position: absolute; background: #FFFFFF; border-radius: 22px;
      padding: 18px 24px; box-sizing: border-box; z-index: 15; width: 335px;
    }
    .p9-card-left {
      top: 135px; left: 45px; border: 2.5px solid rgba(15, 71, 128, 0.25); border-left: 6px solid #0F4780;
      box-shadow: 0 18px 36px rgba(15, 71, 128, 0.12);
    }
    .p9-card-right {
      top: 135px; right: 45px; border: 2.5px solid rgba(241, 67, 67, 0.25); border-right: 6px solid #F14343;
      box-shadow: 0 18px 36px rgba(241, 67, 67, 0.12);
    }
    .p9-card-bottom {
      bottom: 25px; left: 50%; transform: translateX(-50%); width: 560px;
      border: 2.5px solid rgba(255, 204, 0, 0.45); border-bottom: 6px solid #FFCC00;
      box-shadow: 0 18px 36px rgba(217, 119, 6, 0.15);
    }
    .p9-v-title { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
    .p9-v-desc { font-size: 15px; font-weight: 600; color: #334155; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- SEGUNDO PLANO: CHAMADA / TÍTULO -->
    <header class="p9-header">
      <div class="p9-badge font-bukra">Comunicação Científica &bull; IFUSP</div>
      <h1 class="p9-title font-bukra">A Enciclopédia &amp; Acervo<br><span>da Física no IFUSP</span></h1>
      <p class="p9-subtitle font-open-sans">Acesse todo o histórico da ciência, matérias detalhadas e ferramentas de estudo em um só lugar.</p>
    </header>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB NO EPICENTRO -->
    <div class="p9-prism-zone">
      <!-- Feixes de refração triangular -->
      <svg style="position: absolute; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 1240 770">
        <polygon points="620,250 210,220 1030,220" fill="none" stroke="#F14343" stroke-width="1.8" stroke-dasharray="6 6" opacity="0.30" />
        <line x1="620" y1="250" x2="620" y2="580" stroke="#D97706" stroke-width="2" stroke-dasharray="5 5" opacity="0.45" />
      </svg>

      <div class="p9-hero-prism">
        ${hubIconSvg}
      </div>

      <!-- TERCEIRO PLANO: OS 3 EIXOS -->
      <div class="p9-vertex-card p9-card-left">
        <h3 class="p9-v-title font-bukra" style="color: #0F4780;">Eixo Social</h3>
        <p class="p9-v-desc font-open-sans">Espaço de diálogo, compartilhamento de experiências e conexão entre turmas.</p>
      </div>

      <div class="p9-vertex-card p9-card-right">
        <h3 class="p9-v-title font-bukra" style="color: #F14343;">Eixo Informativo</h3>
        <p class="p9-v-desc font-open-sans">O repositório completo da física: artigos, história da ciência e resumos das disciplinas.</p>
      </div>

      <div class="p9-vertex-card p9-card-bottom">
        <h3 class="p9-v-title font-bukra" style="color: #854D0E;">Eixo Ferramentas</h3>
        <p class="p9-v-desc font-open-sans">Simuladores gráficos interativos e calculadoras científicas para os laboratórios e provas.</p>
      </div>
    </div>

    <!-- TERCEIRO PLANO: QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#F14343')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // =========================================================================
  // PROPOSTA 10: "Glassmorphism Deck & Modern Dock" (Camadas de Vidro Acetinado & Dock Horizontal)
  // =========================================================================
  const htmlPoster10 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 10: Glassmorphism Dock')}
  <style>
    /* 1. SEGUNDO PLANO: CHAMADA / TÍTULO */
    .p10-header {
      position: relative; z-index: 25; text-align: center;
      padding-top: 95px; padding-left: 45px; padding-right: 45px;
    }
    .p10-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #FEF9C3; border: 1.5px solid rgba(217, 119, 6, 0.35);
      border-radius: 9999px; padding: 6px 22px; color: #92400E;
      font-size: 13px; font-weight: 800; text-transform: uppercase; margin-bottom: 14px;
    }
    .p10-title {
      font-size: 80px; font-weight: 900; line-height: 1.10; color: #0F172A; letter-spacing: -1.6px;
    }
    .p10-title span { color: #D97706; }
    .p10-subtitle {
      font-size: 23px; font-weight: 600; color: #475569; max-width: 1000px; margin: 10px auto 0 auto;
    }

    /* 2. PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB EM PEDESTAL GLASSMORPHISM */
    .p10-center-zone {
      position: absolute; top: 410px; left: 0; width: 1240px; height: 800px; z-index: 20;
    }
    .p10-hero-glass {
      position: absolute; top: 40px; left: 50%; transform: translateX(-50%);
      width: 340px; height: 340px; background: rgba(255, 255, 255, 0.95);
      border-radius: 80px; border: 3.5px solid rgba(217, 119, 6, 0.25);
      box-shadow: 0 35px 80px -10px rgba(217, 119, 6, 0.30), 0 10px 25px rgba(0,0,0,0.06);
      display: flex; align-items: center; justify-content: center; z-index: 30;
    }
    .p10-hero-glass svg { width: 255px; height: 255px; }

    /* 3. TERCEIRO PLANO: DOCK MODERNO COM OS 3 EIXOS EMPILHADOS */
    .p10-dock-stack {
      position: absolute; top: 420px; left: 45px; right: 45px;
      display: flex; gap: 20px; z-index: 25;
    }
    .p10-dock-card {
      flex: 1; background: #FFFFFF; border-radius: 24px; padding: 20px 24px;
      box-shadow: 0 14px 32px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 6px;
    }
    .p10-dock-card.c-soc { border: 2px solid rgba(15, 71, 128, 0.22); border-left: 6px solid #0F4780; }
    .p10-dock-card.c-inf { border: 2px solid rgba(241, 67, 67, 0.22); border-left: 6px solid #F14343; }
    .p10-dock-card.c-fer { border: 2px solid rgba(255, 204, 0, 0.40); border-left: 6px solid #FFCC00; }
    .p10-dock-head { display: flex; align-items: center; justify-content: space-between; }
    .p10-dock-title { font-size: 22px; font-weight: 900; }
    .p10-dock-desc { font-size: 14.5px; font-weight: 600; color: #334155; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- SEGUNDO PLANO: CHAMADA / TÍTULO -->
    <header class="p10-header">
      <div class="p10-badge font-bukra">Tecnologia &bull; IFUSP</div>
      <h1 class="p10-title font-bukra">Seu Laboratório Virtual<br><span>de Física na Graduação</span></h1>
      <p class="p10-subtitle font-open-sans">Simuladores interativos, calculadoras científicas e utilitários acadêmicos desenvolvidos no IFUSP.</p>
    </header>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB -->
    <div class="p10-center-zone">
      <div class="p10-hero-glass">
        ${hubIconSvg}
      </div>

      <!-- TERCEIRO PLANO: DOCK MODERNO DOS 3 EIXOS -->
      <div class="p10-dock-stack">
        <div class="p10-dock-card c-soc">
          <div class="p10-dock-head">
            <span class="p10-dock-title font-bukra" style="color: #0F4780;">Social</span>
            <span class="font-bukra" style="font-size: 11px; font-weight: 800; color: #0F4780;">EIXO 1</span>
          </div>
          <p class="p10-dock-desc font-open-sans">Conexão entre turmas, grupos de estudos e docentes da física.</p>
        </div>

        <div class="p10-dock-card c-inf">
          <div class="p10-dock-head">
            <span class="p10-dock-title font-bukra" style="color: #F14343;">Informativo</span>
            <span class="font-bukra" style="font-size: 11px; font-weight: 800; color: #F14343;">EIXO 2</span>
          </div>
          <p class="p10-dock-desc font-open-sans">Histórico da ciência e acervo oficial de matérias da graduação.</p>
        </div>

        <div class="p10-dock-card c-fer">
          <div class="p10-dock-head">
            <span class="p10-dock-title font-bukra" style="color: #854D0E;">Ferramentas</span>
            <span class="font-bukra" style="font-size: 11px; font-weight: 800; color: #854D0E;">EIXO 3</span>
          </div>
          <p class="p10-dock-desc font-open-sans">Simuladores numéricos, calculadoras e gerenciador de notas.</p>
        </div>
      </div>
    </div>

    <!-- TERCEIRO PLANO: QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#D97706')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // =========================================================================
  // PROPOSTA 11: "Swiss Precision & High-Impact Editorial" (Grid Suíço & Minimalismo Escultural)
  // =========================================================================
  const htmlPoster11 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 11: Swiss Precision')}
  <style>
    /* 1. SEGUNDO PLANO: CHAMADA / TÍTULO COM GRID SUÍÇO */
    .p11-header {
      position: relative; z-index: 25;
      padding-top: 95px; padding-left: 55px; padding-right: 55px;
      display: flex; flex-direction: column; align-items: flex-start;
    }
    .p11-meta-line {
      display: flex; align-items: center; gap: 14px; margin-bottom: 12px;
      font-size: 13.5px; font-weight: 800; color: #0F4780; letter-spacing: 1px; text-transform: uppercase;
    }
    .p11-meta-line span { color: #F14343; }
    .p11-title {
      font-size: 88px; font-weight: 900; line-height: 1.05; color: #0F172A; letter-spacing: -2px;
    }
    .p11-title mark {
      background: none; color: #0F4780;
    }
    .p11-subtitle {
      font-size: 24px; font-weight: 600; color: #475569; max-width: 1050px; margin-top: 12px;
    }

    /* 2. PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB MONUMENTAL CENTRALIZADA */
    .p11-hero-area {
      position: absolute; top: 430px; left: 0; width: 1240px; height: 740px; z-index: 20;
    }
    .p11-hero-frame {
      position: absolute; top: 20px; left: 50%; transform: translateX(-50%);
      width: 350px; height: 350px; background: #FFFFFF;
      border: 3.5px solid #0F172A; border-radius: 40px;
      box-shadow: 18px 18px 0px rgba(15, 71, 128, 0.15);
      display: flex; align-items: center; justify-content: center; z-index: 30;
    }
    .p11-hero-frame svg { width: 260px; height: 260px; }

    /* 3. TERCEIRO PLANO: GRID MODULAR DOS 3 EIXOS COM LINHAS DE PRECISÃO */
    .p11-axes-row {
      position: absolute; top: 420px; left: 55px; right: 55px;
      display: flex; border-top: 2px solid #0F172A; border-bottom: 2px solid #0F172A;
      background: #FFFFFF; z-index: 25;
    }
    .p11-axis-cell {
      flex: 1; padding: 22px 24px; display: flex; flex-direction: column; gap: 6px;
    }
    .p11-axis-cell:not(:last-child) { border-right: 2px solid #0F172A; }
    .p11-cell-num { font-size: 12px; font-weight: 800; color: #64748B; text-transform: uppercase; }
    .p11-cell-title { font-size: 24px; font-weight: 900; color: #0F172A; }
    .p11-cell-desc { font-size: 15px; font-weight: 600; color: #334155; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- SEGUNDO PLANO: CHAMADA / TÍTULO -->
    <header class="p11-header font-bukra">
      <div class="p11-meta-line">
        <span>LabDiv</span> &bull; Instituto de Física da USP &bull; <span>Hub Acadêmico</span>
      </div>
      <h1 class="p11-title">
        O IFUSP na palma<br><mark>da sua mão</mark>
      </h1>
      <p class="p11-subtitle font-open-sans">
        Uma plataforma aberta e colaborativa feita para elevar o aprendizado e a comunicação científica.
      </p>
    </header>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB -->
    <div class="p11-hero-area">
      <div class="p11-hero-frame">
        ${hubIconSvg}
      </div>

      <!-- TERCEIRO PLANO: GRID MODULAR DOS 3 EIXOS -->
      <div class="p11-axes-row">
        <div class="p11-axis-cell">
          <span class="p11-cell-num font-bukra">Módulo 01</span>
          <h3 class="p11-cell-title font-bukra" style="color: #0F4780;">Social</h3>
          <p class="p11-cell-desc font-open-sans">Comunidade integrada entre turmas e projetos acadêmicos.</p>
        </div>

        <div class="p11-axis-cell">
          <span class="p11-cell-num font-bukra">Módulo 02</span>
          <h3 class="p11-cell-title font-bukra" style="color: #F14343;">Informativo</h3>
          <p class="p11-cell-desc font-open-sans">Acervo oficial, história da ciência e repositório de aulas.</p>
        </div>

        <div class="p11-axis-cell">
          <span class="p11-cell-num font-bukra">Módulo 03</span>
          <h3 class="p11-cell-title font-bukra" style="color: #854D0E;">Ferramentas</h3>
          <p class="p11-cell-desc font-open-sans">Simuladores de fenômenos físicos e calculadoras numéricas.</p>
        </div>
      </div>
    </div>

    <!-- TERCEIRO PLANO: QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#0F4780')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // =========================================================================
  // PROPOSTA 12: "The Quantum Accelerator & Open Science Nexus" (Sincrotron & Ciência Livre)
  // =========================================================================
  const htmlPoster12 = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  ${baseHead('HUB LabDiv - Proposta 12: Quantum Accelerator')}
  <style>
    /* 1. SEGUNDO PLANO: CHAMADA / TÍTULO */
    .p12-header {
      position: relative; z-index: 25; text-align: center;
      padding-top: 95px; padding-left: 45px; padding-right: 45px;
    }
    .p12-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: #EEF4FA; border: 1.5px solid rgba(15, 71, 128, 0.25);
      border-radius: 9999px; padding: 6px 22px; color: #0F4780;
      font-size: 13px; font-weight: 800; text-transform: uppercase; margin-bottom: 14px;
    }
    .p12-title {
      font-size: 80px; font-weight: 900; line-height: 1.10; color: #0F172A; letter-spacing: -1.6px;
    }
    .p12-title span {
      background: linear-gradient(90deg, #0F4780 0%, #F14343 50%, #D97706 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .p12-subtitle {
      font-size: 23px; font-weight: 600; color: #475569; max-width: 1000px; margin: 10px auto 0 auto;
    }

    /* 2. PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB COM ONDAS CONCÊNTRICAS DE ACELERAÇÃO */
    .p12-synchrotron-zone {
      position: absolute; top: 410px; left: 0; width: 1240px; height: 800px; z-index: 20;
    }
    .p12-hero-core {
      position: absolute; top: 55px; left: 50%; transform: translateX(-50%);
      width: 340px; height: 340px; background: #FFFFFF;
      border-radius: 90px; border: 4px solid rgba(15, 71, 128, 0.22);
      box-shadow: 0 40px 90px -10px rgba(15, 71, 128, 0.32), 0 10px 30px rgba(0,0,0,0.08);
      display: flex; align-items: center; justify-content: center; z-index: 30;
    }
    .p12-hero-core svg { width: 250px; height: 250px; }

    /* 3. TERCEIRO PLANO: OS 3 DETECTORES (EIXOS) */
    .p12-detector-card {
      position: absolute; background: #FFFFFF; border-radius: 24px;
      padding: 18px 24px; box-sizing: border-box; z-index: 25; width: 340px;
    }
    .p12-det-left {
      top: 110px; left: 45px; border: 2.5px solid rgba(15, 71, 128, 0.30); border-top: 6px solid #0F4780;
      box-shadow: 0 18px 36px rgba(15, 71, 128, 0.14);
    }
    .p12-det-right {
      top: 110px; right: 45px; border: 2.5px solid rgba(241, 67, 67, 0.30); border-top: 6px solid #F14343;
      box-shadow: 0 18px 36px rgba(241, 67, 67, 0.14);
    }
    .p12-det-bottom {
      bottom: 35px; left: 50%; transform: translateX(-50%); width: 560px;
      border: 2.5px solid rgba(255, 204, 0, 0.50); border-top: 6px solid #FFCC00;
      box-shadow: 0 18px 36px rgba(217, 119, 6, 0.16);
    }
    .p12-d-title { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
    .p12-d-desc { font-size: 15px; font-weight: 600; color: #334155; line-height: 1.35; }
  </style>
</head>
<body>
  <div class="poster-container">
    <div class="brand-gradient-line-top"></div>
    <div class="bg-math-pattern"></div>

    <!-- SEGUNDO PLANO: CHAMADA / TÍTULO -->
    <header class="p12-header">
      <div class="p12-badge font-bukra">Ciência Aberta &bull; Código Livre AGPLv3</div>
      <h1 class="p12-title font-bukra">Ciência Livre.<br><span>Código Aberto.</span></h1>
      <p class="p12-subtitle font-open-sans">A plataforma universitária de comunicação científica, código aberto e autonomia estudantil no IFUSP.</p>
    </header>

    <!-- PLANO 1 (HERO DESTAQUE MÁXIMO): LOGO DO HUB -->
    <div class="p12-synchrotron-zone">
      <!-- Ondas de radiação síncrotron -->
      <svg style="position: absolute; width: 100%; height: 100%; pointer-events: none;" viewBox="0 0 1240 800">
        <circle cx="620" cy="225" r="230" fill="none" stroke="#0F4780" stroke-width="2" stroke-dasharray="6 6" opacity="0.40" />
        <circle cx="620" cy="225" r="330" fill="none" stroke="#F14343" stroke-width="1.8" stroke-dasharray="8 8" opacity="0.30" />
        <circle cx="620" cy="225" r="410" fill="none" stroke="#FFCC00" stroke-width="1.4" stroke-dasharray="4 8" opacity="0.25" />
      </svg>

      <div class="p12-hero-core">
        ${hubIconSvg}
      </div>

      <!-- TERCEIRO PLANO: DETECTORES DOS 3 EIXOS -->
      <div class="p12-detector-card p12-det-left">
        <h3 class="p12-d-title font-bukra" style="color: #0F4780;">1. Eixo Social</h3>
        <p class="p12-d-desc font-open-sans">Rede pedagógica aberta para aproximar calouros, veteranos e docentes.</p>
      </div>

      <div class="p12-detector-card p12-det-right">
        <h3 class="p12-d-title font-bukra" style="color: #F14343;">2. Eixo Informativo</h3>
        <p class="p12-d-desc font-open-sans">Enciclopédia viva de física com resumos e história da ciência ao seu alcance.</p>
      </div>

      <div class="p12-detector-card p12-det-bottom">
        <h3 class="p12-d-title font-bukra" style="color: #854D0E;">3. Eixo Ferramentas</h3>
        <p class="p12-d-desc font-open-sans">Simuladores computacionais e calculadoras analíticas de código aberto.</p>
      </div>
    </div>

    <!-- TERCEIRO PLANO: QR CODE & SEGURANÇA -->
    <div class="bottom-third-plane">
      ${renderQrBox('#0F4780')}
      ${renderInstitutionalBox()}
    </div>
  </div>
</body>
</html>`;

  // Mapeamento dos pôsteres
  const posters = [
    { num: 7, html: htmlPoster7, title: 'Proposta 7: Orbital Gravity Core' },
    { num: 8, html: htmlPoster8, title: 'Proposta 8: Monumental Pillar' },
    { num: 9, html: htmlPoster9, title: 'Proposta 9: Scientific Prism' },
    { num: 10, html: htmlPoster10, title: 'Proposta 10: Glassmorphism Dock' },
    { num: 11, html: htmlPoster11, title: 'Proposta 11: Swiss Precision' },
    { num: 12, html: htmlPoster12, title: 'Proposta 12: Quantum Accelerator' },
  ];

  // Iniciar Puppeteer para renderização a 300 DPI (2480x3508)
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1240,
      height: 1754,
      deviceScaleFactor: 2
    },
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });

  for (const item of posters) {
    const posterDir = path.join(POSTERS_ROOT, `poster${item.num}`);
    if (!fs.existsSync(posterDir)) fs.mkdirSync(posterDir, { recursive: true });

    const htmlPath = path.join(posterDir, 'poster.html');
    fs.writeFileSync(htmlPath, item.html, 'utf8');
    console.log(`📝 Salvo HTML do Poster ${item.num}: ${htmlPath}`);

    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 1754, deviceScaleFactor: 2 });
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(r => setTimeout(r, 800));

    const outPngPath = path.join(posterDir, 'poster.png');
    await page.screenshot({
      path: outPngPath,
      type: 'png',
      clip: { x: 0, y: 0, width: 1240, height: 1754 }
    });
    console.log(`✅ [300 DPI] Poster ${item.num} (${item.title}) gerado em: ${outPngPath}`);

    // Limpar arquivos residuais na pasta para garantir que tem APENAS poster.html e poster.png
    const files = fs.readdirSync(posterDir);
    for (const f of files) {
      if (f !== 'poster.html' && f !== 'poster.png') {
        const fp = path.join(posterDir, f);
        if (fs.statSync(fp).isDirectory()) {
          fs.rmSync(fp, { recursive: true, force: true });
        } else {
          fs.unlinkSync(fp);
        }
      }
    }

    // Copiar para artifacts da sessão para permitir pré-visualização no IDE
    if (fs.existsSync(ARTIFACTS_DIR)) {
      fs.copyFileSync(outPngPath, path.join(ARTIFACTS_DIR, `poster${item.num}.png`));
    }

    await page.close();
  }

  await browser.close();
  console.log('🎉 Todas as 6 propostas de design exclusivas (Posters 7 a 12) foram criadas e renderizadas com sucesso absoluto!');
}

main().catch(err => {
  console.error('❌ Erro na geração dos pôsteres:', err);
  process.exit(1);
});
