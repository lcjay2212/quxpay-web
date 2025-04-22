const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'no-referrer',
  },
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self), microphone=()',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
  {
    key: 'Expect-CT',
    value: 'max-age=86400, enforce',
  },
];

const nextConfig = {
  reactStrictMode: false,

  // Remove assetPrefix unless you're serving static assets from a CDN
  // assetPrefix: 'https://quxpay.com', ❌ Remove this unless using a CDN

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.forumpay.com',
        pathname: '/pay/qr/**',
      },
      {
        protocol: 'https',
        hostname: 'sandbox.api.forumpay.com',
        pathname: '/pay/qr/**',
      },
      {
        protocol: 'https',
        hostname: 'p2.api.quxtech.tv',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.quxtech.tv',
        pathname: '/staging-quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.qux.tv',
        pathname: '/quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 'qa.api.quxtech.tv',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qux.tv',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 's3.qux.tv',
        pathname: '/quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 's3.qux.tv',
        pathname: '/keys/puzzle_images/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          ...securityHeaders,
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,PUT,POST,DELETE,PATCH' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
          { key: 'Accept', value: 'application/json' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://p2.api.quxtech.tv/:path*',
      },
    ];
  },
};

// Injected Sentry support
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: 'qux-sn',
    project: 'quxpay-web',
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  }
);
