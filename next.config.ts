
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // The `async_hooks`, `fs`, `tls`, and `net` modules are Node.js-specific and not available in the browser.
    // Some server-side dependencies (like OpenTelemetry used by Genkit, or parts of Genkit plugins) might try to import them.
    // This configuration tells Webpack to provide an empty module for these
    // when building the client-side bundle, preventing "Module not found" errors.
    if (!isServer) {
      config.resolve = config.resolve || {}; // Ensure config.resolve exists
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}), // Ensure config.resolve.fallback exists and spread it
        async_hooks: false, // Provide an empty module for async_hooks on the client
        fs: false, // Provide an empty module for fs on the client
        tls: false, // Provide an empty module for tls on the client
        net: false, // Provide an empty module for net on the client
      };
    }
    return config;
  },
};

export default nextConfig;
