/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pyodide requires specific webpack configuration
  webpack: (config, { isServer }) => {
    // Pyodide should only run on client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Handle .wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },

  // Allow loading Pyodide from CDN
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
