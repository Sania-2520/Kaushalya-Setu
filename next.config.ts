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
    // The `async_hooks` module is Node.js-specific and not available in the browser.
    // Some server-side dependencies (like OpenTelemetry used by Genkit) might try to import it.
    // This configuration tells Webpack to provide an empty module for `async_hooks`
    // when building the client-side bundle, preventing the "Module not found" error.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Spread existing fallbacks if any
        async_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
