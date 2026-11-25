/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    const common = [
      // Ask search engines not to index anything on the site.
      { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
      // Don't leak private links to other sites through the Referer header.
      { key: 'Referrer-Policy', value: 'no-referrer' },
    ];
    return [
      { source: '/:path*', headers: common },
      {
        source: '/p/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
      {
        source: '/m/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

export default nextConfig;
