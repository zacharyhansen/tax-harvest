import type { ReactNode } from 'react';
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

const httpLink = new HttpLink({
  credentials: 'include',
  uri: (operation) => {
    console.info('operation', operation);
    console.info(
      'process.env.NEXT_PUBLIC_CORE_SERVER_URL',
      process.env.NEXT_PUBLIC_CORE_SERVER_URL,
    );
    return `${process.env.NEXT_PUBLIC_CORE_SERVER_URL}/graphql?${operation.operationName}`;
  },
});

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { getToken, isLoaded } = useAuth();

  const client = useMemo(() => {
    const authMiddleware = setContext(async (operation, { headers }) => {
      const token = await getToken();

      return {
        headers: {
          ...headers,
          authorization: `Bearer ${token}`,
        },
      };
    });

    return new ApolloClient({
      cache: new InMemoryCache(),
      credentials: 'include',
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
      link: ApolloLink.from([authMiddleware, httpLink]),
      name: 'react-web-client',
      queryDeduplication: false,
      version: '1.3',
    });
  }, [getToken]);

  return (
    <ApolloProvider client={client}>
      {/* Dont render children till the auth is loaded so the Bearer token can be properly attached */}
      {isLoaded ? children : null}
    </ApolloProvider>
  );
};

export default ApolloProviderWrapper;
