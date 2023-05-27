import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clientor.app',
  appName: 'clienTOR',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
