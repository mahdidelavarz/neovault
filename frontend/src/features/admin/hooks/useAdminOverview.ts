import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/http';

export interface AdminUserOverview {
  id: number;
  username: string;
  email?: string;
  isAdmin: boolean;
  createdAt: string;
  appOpenCount: number;
  loginCount: number;
  actionCount: number;
  lastLoginAt: string | null;
  lastSeenAt: string | null;
  linksCount: number;
  notesCount: number;
  snippetsCount: number;
  promptsCount: number;
  apiCollectionsCount: number;
  infrastructureCount: number;
  projectsCount: number;
}

export interface AdminActivityEvent {
  id: number;
  type: 'app_open' | 'login' | 'create' | 'update' | 'delete' | 'favorite' | 'use' | 'api_test' | 'other';
  module: string;
  action: string;
  method: string;
  path?: string;
  resourceType?: string;
  resourceId?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
}

export interface AdminOverview {
  totalUsers: number;
  totalEvents: number;
  eventsToday: number;
  appOpensToday: number;
  loginsToday: number;
  users: AdminUserOverview[];
  recentActivity: AdminActivityEvent[];
}

export const useAdminOverview = () => {
  return useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      const { data } = await api.get('/admin/overview');
      return data as AdminOverview;
    },
  });
};

export const useMakeUserAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: number) => {
      const { data } = await api.patch(`/admin/users/${userId}/admin`);
      return data as { message: string; user: Pick<AdminUserOverview, 'id' | 'username' | 'email' | 'isAdmin'> };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-overview'] });
    },
  });
};
