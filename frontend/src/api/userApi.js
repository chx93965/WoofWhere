import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const userApi = {
    getAll: async (params) => {
        const response = await apiClient.get(API_ENDPOINTS.users, { params });
        return response.data;
    },
    getStats: async () => {
        const response = await apiClient.get(API_ENDPOINTS.userStats);
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.userById(id));
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.userCreate, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(API_ENDPOINTS.userUpdate(id), data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.userDelete(id));
        return response.data;
    },
    deactivate: async (id) => {
        const response = await apiClient.patch(API_ENDPOINTS.userDeactivate(id));
        return response.data;
    },
    activate: async (id) => {
        const response = await apiClient.patch(API_ENDPOINTS.userActivate(id));
        return response.data;
    },
};