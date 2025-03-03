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

module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.forumpay.com',
        port: '',
        pathname: '/pay/qr/**',
      },
      {
        protocol: 'https',
        hostname: 'sandbox.api.forumpay.com',
        port: '',
        pathname: '/pay/qr/**',
      },
      {
        protocol: 'https',
        hostname: 'p2.api.quxtech.tv',
        port: '',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.quxtech.tv',
        port: '',
        pathname: '/staging-quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.qux.tv',
        port: '',
        pathname: '/quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 'qa.api.quxtech.tv',
        port: '',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qux.tv',
        port: '',
        pathname: '/puzzle_images/**',
      },
      {
        protocol: 'https',
        hostname: 's3.qux.tv',
        port: '',
        pathname: '/quxtech/**',
      },
      {
        protocol: 'https',
        hostname: 's3.qux.tv',
        port: '',
        pathname: '/keys/puzzle_images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // matching all API routes
        source: '/:path*',
        headers: [
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
        destination: 'https://p2.api.quxtech.tv/:path*', // Proxy to QuxTech API
      },
    ];
  },
};

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'qux-sn',
    project: 'quxpay-web',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
