import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.usp.ifusp.hublabdiv',
  appName: 'HUB LabDiv',
  webDir: 'out',
  server: {
    url: 'https://hub-lab-div.vercel.app/',
    cleartext: true,
    errorPath: 'offline.html'
  },
  appendUserAgent: 'LabDiv-App',
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;