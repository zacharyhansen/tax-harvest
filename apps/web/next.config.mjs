import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
jiti('./lib/env/clientEnvironment');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
  // experimental: {
  // swcPlugins: [
  //   [
  //     '@graphql-codegen/client-preset-swc-plugin',
  //     { artifactDirectory: './generated/gql', gqlTagName: 'graphql' },
  //   ],
  // ],
  // },
  // Conditionally disable linting and type checking for Docker builds
  ...(process.env.DOCKER_BUILD === 'true' && {
    // Disable the built-in linting during build
    eslint: {
      ignoreDuringBuilds: true,
    },
    // Disable TypeScript type checking during build
    typescript: {
      ignoreBuildErrors: true,
    },
  }),
};

export default nextConfig;
