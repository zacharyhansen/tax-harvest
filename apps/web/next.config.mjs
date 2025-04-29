/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    experimental: {
      swcPlugins: [
        [
          '@graphql-codegen/client-preset-swc-plugin',
          { artifactDirectory: './generated/gql', gqlTagName: 'graphql' },
        ],
      ],
    },
  },
};

export default nextConfig;
