import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/http';
import { ApiEndpoint, ApiCollection, Environment, CreateEndpointDto, CreateEnvironmentDto, TestRequestDto, TestResponseDto } from '@/features/postman/types/apiClient';

// Environments
export const useEnvironments = () => {
  return useQuery({
    queryKey: ['api-environments'],
    queryFn: async () => {
      const { data } = await api.get('/api-client/environments');
      return data.environments as Environment[];
    },
  });
};

export const useCreateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEnvironmentDto) => {
      const { data: res } = await api.post('/api-client/environments', data);
      return res.environment as Environment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-environments'] }),
  });
};

export const useUpdateEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateEnvironmentDto & { id: number }) => {
      const { data: res } = await api.put(`/api-client/environments/${id}`, data);
      return res.environment as Environment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-environments'] }),
  });
};

export const useDeleteEnvironment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api-client/environments/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-environments'] }),
  });
};

// Collections
export const useCollections = () => {
  return useQuery({
    queryKey: ['api-collections'],
    queryFn: async () => {
      const { data } = await api.get('/api-client/collections');
      return data.collections as ApiCollection[];
    },
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const { data: res } = await api.post('/api-client/collections', data);
      return res.collection;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-collections'] }),
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api-client/collections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-collections'] });
      queryClient.invalidateQueries({ queryKey: ['api-endpoints'] });
    },
  });
};

// Endpoints
export const useEndpoints = (filters?: {
  collectionId?: number;
  categoryId?: number;
  search?: string;
  method?: string;
  isFavorite?: boolean;
}) => {
  return useQuery({
    queryKey: ['api-endpoints', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.collectionId) params.append('collectionId', filters.collectionId.toString());
      if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
      if (filters?.search) params.append('search', filters.search);
      if (filters?.method) params.append('method', filters.method);
      if (filters?.isFavorite) params.append('isFavorite', 'true');

      const { data } = await api.get(`/api-client/endpoints?${params.toString()}`);
      return data.endpoints as ApiEndpoint[];
    },
  });
};

export const useEndpoint = (id: number) => {
  return useQuery({
    queryKey: ['api-endpoint', id],
    queryFn: async () => {
      const { data } = await api.get(`/api-client/endpoints/${id}`);
      return data.endpoint as ApiEndpoint;
    },
    enabled: !!id,
  });
};

export const useCreateEndpoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEndpointDto) => {
      const { data: res } = await api.post('/api-client/endpoints', data);
      return res.endpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-endpoints'] });
    },
  });
};

export const useUpdateEndpoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: CreateEndpointDto & { id: number }) => {
      const { data: res } = await api.put(`/api-client/endpoints/${id}`, data);
      return res.endpoint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-endpoints'] });
    },
  });
};

export const useDeleteEndpoint = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api-client/endpoints/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-endpoints'] }),
  });
};

// Test endpoint
export const useTestEndpoint = () => {
  return useMutation({
    mutationFn: async (data: TestRequestDto) => {
      // The backend proxy allows the outbound request up to 30s (Api.service.ts),
      // so give this call a longer timeout than the 15s global default — otherwise
      // the browser aborts first and the failure looks like a network error.
      const { data: res } = await api.post('/api-client/test', data, { timeout: 35_000 });
      return res as TestResponseDto;
    },
  });
};