import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/http';
import { UploadedFile } from '@/features/files/types/file';

type Page<T> = { items: T[]; total: number; page: number; limit: number; hasMore: boolean };

export const useFiles = (filters?: { search?: string }) => {
  return useInfiniteQuery<Page<UploadedFile>>({
    queryKey: ['files', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      params.append('page', String(pageParam));
      params.append('limit', '20');
      const { data } = await api.get(`/files?${params.toString()}`);
      return data as Page<UploadedFile>;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.file as UploadedFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useUpdateFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, description }: { id: number; description: string }) => {
      const { data } = await api.patch(`/files/${id}`, { description });
      return data.file as UploadedFile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
};
