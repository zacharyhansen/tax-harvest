import { useHarvestsAndTransactionsQuery } from '~/generated/gql';

export function useOpenHarvests() {
  const { data, loading, error } = useHarvestsAndTransactionsQuery({
    variables: {
      where: {
        recommendationExpiresDate: {
          gte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    },
  });

  return {
    harvests: data?.harvests || [],
    loading,
    error,
    hasOpenHarvests: Boolean(data?.harvests?.length),
    openHarvestCount: data?.harvests?.length || 0,
  };
}