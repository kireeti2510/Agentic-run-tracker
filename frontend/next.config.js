/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `experimental.appDir` was used in older Next.js versions to opt-in to the
  // App Router. In modern Next.js (13+ with App Router enabled by default,
  // and Next 14+) this option is no longer recognized. Remove it to avoid
  // the warning shown at startup. The App Router is enabled by default when
  // you have an `app/` directory in the project.
}

module.exports = nextConfig;
