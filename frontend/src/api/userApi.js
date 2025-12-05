import apiClient from './client';
import {API_ENDPOINTS} from './config';

export const userApi = {
    getAll: async (params) => {
        return await apiClient.get(API_ENDPOINTS.users, {params});
    },
    getStats: async () => {
        return await apiClient.get(API_ENDPOINTS.userStats);
    },
    getById: async (id) => {
        return await apiClient.get(API_ENDPOINTS.userById(id));
    },
    create: async (data) => {
        return await apiClient.post(API_ENDPOINTS.userCreate, data);
    },
    login: async (data) => {
        return await apiClient.post(API_ENDPOINTS.userLogin, data);
    },
    update: async (id, data) => {
        return await apiClient.put(API_ENDPOINTS.userUpdate(id), data);
    },
    delete: async (id) => {
        return await apiClient.delete(API_ENDPOINTS.userDelete(id));
    },
    deactivate: async (id) => {
        return await apiClient.patch(API_ENDPOINTS.userDeactivate(id));
    },
    activate: async (id) => {
        return await apiClient.patch(API_ENDPOINTS.userActivate(id));
    },
};