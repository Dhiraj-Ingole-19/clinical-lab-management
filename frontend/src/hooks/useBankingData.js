import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getMyTransactions } from '../services/api';

export const useUserData = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getCurrentUser();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTransactions = (accountId) => {
  return useQuery({
    queryKey: ['transactions', accountId],
    queryFn: async () => {
      if (!accountId) return [];
      const response = await getMyTransactions();
      return response.data;
    },
    enabled: !!accountId,
  });
};
