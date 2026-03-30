import type { NextConfig } from "next";
// Double-lock: Validate environment variables during Next.js config loading
// import "./src/env.mjs";

const nextConfig: NextConfig = {
  compress: true,
  devIndicators: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com', pathname: '/**' },
      { protocol: 'https', hostname: 'bqszadfunqgtfpaorwvx.supabase.co', pathname: '/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
      { protocol: 'https', hostname: 'portal.if.usp.br', pathname: '/**' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium', 'nodemailer'],
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/@sparticuz/chromium/bin/**/*'],
  },
  transpilePackages: ['recharts'],
  async redirects() {
    return [
      { source: '/perfil', destination: '/lab', permanent: true },
      { source: '/dms', destination: '/emaranhamento', permanent: true },
      { source: '/timeline', destination: '/fluxo', permanent: true },
      { source: '/guia', destination: '/manual', permanent: true },
    ];
  },
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://*.supabase.co https://*.vercel-scripts.com https://*.vercel.app https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://vlibras.gov.br;
      img-src 'self' blob: data: https://*.supabase.co https://res.cloudinary.com https://*.ytimg.com https://img.youtube.com https://images.unsplash.com https://lh3.googleusercontent.com https://upload.wikimedia.org https://portal.if.usp.br https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms;
      font-src 'self' data: https://fonts.gstatic.com;
      connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.vercel.app https://vlibras.gov.br https://*.google-analytics.com https://*.clarity.ms https://*.bing.com https://*.visualstudio.com;
      media-src 'self' https://*.supabase.co https://res.cloudinary.com https://*.youtube.com;
      frame-src 'self' https://*.youtube.com https://*.youtube-nocookie.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      block-all-mixed-content;
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload', // 2 anos
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
