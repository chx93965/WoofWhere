import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const petApi = {
    getAll: async (params) => {
        const response = await apiClient.get(API_ENDPOINTS.pets, { params });
        return response.data;
    },
    getById: async (params) => {
        const response = await apiClient.get(API_ENDPOINTS.petById(id));
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.petCreate, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(API_ENDPOINTS.petUpdate(id), data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.petDelete(id));
        return response.data;
    },
    getByOwner: async (ownerId) => {
        const response = await apiClient.get(API_ENDPOINTS.petsByOwner(ownerId));
        return response.data;
    },
    getParties: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.petParties(id));
        return response.data;
    },
    transfer: async (id, newOwnerId) => {
        const response = await apiClient.patch(API_ENDPOINTS.petTransfer(id), { newOwnerId: newOwnerId });
        return response.data;
    },
}