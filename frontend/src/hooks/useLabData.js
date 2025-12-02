import { useQuery } from '@tanstack/react-query';
import { authApi, labApi } from '../services/api';

export const useUserData = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ['my-appointments'],
    queryFn: async () => {
      const response = await labApi.getMyAppointments();
      return response.data;
    },
  });
};
