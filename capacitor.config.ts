// Capacitor configuration for Android packaging
export interface CapacitorConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime?: boolean;
  server?: {
    androidScheme?: string;
    cleartext?: boolean;
  };
  android?: {
    buildOptions?: {
      keystorePath?: string;
      keystoreAlias?: string;
    };
  };
}

const config: CapacitorConfig = {
  appId: 'com.farmerdirectmarket.app',
  appName: 'Farmer Direct Market',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
