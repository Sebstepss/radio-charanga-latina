import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.radio.charanga',
  appName: 'Radio Charanga Latina',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    allowNavigation: ['charangalatina.cl']
  }
};

export default config;
