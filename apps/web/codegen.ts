import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: [
    'modules/**/*.graphql',
    'modules/**/*.gql',
    'app/**/*.gql',
    // 'app/**/*.graphql',
  ],
  generates: {
    './generated/gql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
  ignoreNoDocuments: true,
  schema: 'http://localhost:5000/core/graphql',
};

export default config;
