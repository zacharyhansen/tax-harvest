/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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
