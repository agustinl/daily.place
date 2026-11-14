/** @type {import('next').NextConfig} */

const securityHeaders = [
    // Minimal CSP: no framing, plugins or <base> hijacking. Script/connect sources are not
    // restricted yet because Clerk, Convex, GA and the embedded players load from many origins.
    {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'"
    },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
];

const nextConfig = {
    // E2E builds use their own folder so they never overwrite a running dev server (see playwright.config.ts)
    distDir: process.env.NEXT_DIST_DIR || '.next',
    reactStrictMode: false,
    env: {
        NEXT_PUBLIC_APP_VERSION: require('./package.json').version
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    async headers() {
        return [
            { source: '/:path*', headers: securityHeaders },
            // The service worker must always be revalidated so updates reach installed apps
            {
                source: '/sw.js',
                headers: [{ key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' }]
            }
        ];
    },
    images: {
        dangerouslyAllowSVG: true,
        // Remote SVGs served by the image optimizer can't run scripts
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com'
            }
        ]
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.(mp3)$/,
            type: 'asset/resource',
            generator: {
                filename: 'static/chunks/[path][name].[hash][ext]'
            }
        });

        return config;
    }
};

module.exports = nextConfig;
