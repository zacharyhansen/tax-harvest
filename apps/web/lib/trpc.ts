import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '../../api/@generated/server';

export const trpc = createTRPCReact<AppRouter>({});
