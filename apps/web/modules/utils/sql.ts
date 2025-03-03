import { formatDialect, postgresql } from 'sql-formatter';

export const formatSQL = (sql: string) =>
  formatDialect(sql, {
    dialect: postgresql,
    functionCase: 'lower',
    keywordCase: 'lower',
    paramTypes: {
      custom: [{ regex: String.raw`\{\{[a-zA-Z0-9_\s]+\}\}` }],
    },
  });
