/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

// Fix libsodium ESM issue by copying the mjs file to the correct location
const libsodiumSrcPath = path.resolve(__dirname, 'node_modules/libsodium-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs');
const libsodiumDestPath = path.resolve(__dirname, 'node_modules/libsodium-wrappers-sumo/dist/modules-sumo-esm/libsodium-sumo.mjs');
try {
    if (fs.existsSync(libsodiumSrcPath) && !fs.existsSync(libsodiumDestPath)) {
        fs.copyFileSync(libsodiumSrcPath, libsodiumDestPath);
    }
} catch (e) {
    // Ignore copy errors
}

const nextConfig = {
    // Server external packages (moved from experimental in Next.js 15)
    serverExternalPackages: [
        '@meshsdk/core',
        '@meshsdk/core-cst',
        '@meshsdk/react',
        '@cardano-sdk/crypto',
        'libsodium-wrappers',
        'libsodium-wrappers-sumo',
        'libsodium-sumo',
    ],

    // Development indicators
    devIndicators: {
        buildActivity: true,
        appIsrStatus: true,
    },

    // Enhanced logging for debugging
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    // Webpack configuration for MeshJS
    webpack: (config, { isServer }) => {
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            layers: true,
            topLevelAwait: true,
        };

        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false,
            crypto: false,
        };

        // Handle ESM packages
        config.resolve.extensionAlias = {
            '.js': ['.js', '.ts', '.tsx'],
            '.mjs': ['.mjs', '.js'],
        };

        // External packages for server-side
        if (isServer) {
            config.externals = config.externals || [];
            config.externals.push({
                'libsodium-wrappers': 'commonjs libsodium-wrappers',
                'libsodium-wrappers-sumo': 'commonjs libsodium-wrappers-sumo',
            });
        }

        return config;
    },

    // Environment variables
    env: {
        NEXT_PUBLIC_CARDANO_NETWORK: process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod',
        NEXT_PUBLIC_BLOCKFROST_PROJECT_ID: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID,
    },

    // Image optimization
    images: {
        domains: ['ipfs.io', 'gateway.pinata.cloud'],
    },

    // Headers for security
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
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
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
