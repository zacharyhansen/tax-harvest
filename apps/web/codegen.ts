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
				scalars: {
					Decimal: 'string',
					BigInt: 'string',
				},
			},
		},
	},
	ignoreNoDocuments: true,
	schema: process.env.url ? `${process.env.url}/graphql` : '../api/schema.graphql',
};

export default config;
