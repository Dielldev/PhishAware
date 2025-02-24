/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com'],
    unoptimized: false,
    disableStaticImages: false,
  },
  transpilePackages: ['react-simple-maps', 'd3-scale'],
  webpack: (config, { isServer }) => {
    // Handle ESM/CommonJS interop
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.mjs': ['.mjs', '.mts'],
      '.cjs': ['.cjs', '.cts'],
    };
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Improved module resolution
    config.resolve = {
      ...config.resolve,
      exportsFields: ['exports', 'module.exports'],
      mainFields: ['module', 'main'],
    };
    
    config.module.rules.push({
      test: /\.m?js$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    // Add topojson loader
    config.module.rules.push({
      test: /\.topojson$/,
      use: ['json-loader'],
    });

    return config;
  },
  experimental: {
    serverActions: true,
    esmExternals: true, // Changed from 'loose' to true for stricter ESM handling
  },
};

export default nextConfig;