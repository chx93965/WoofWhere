import apiClient from './client';
import {API_ENDPOINTS} from './config';

export const petApi = {
    getAll: async (params) => {
        return await apiClient.get(API_ENDPOINTS.pets, {params});
    },
    getById: async (params) => {
        return await apiClient.get(API_ENDPOINTS.petById(id));
    },
    create: async (data) => {
        return await apiClient.post(API_ENDPOINTS.petCreate, data);
    },
    update: async (id, data) => {
        return await apiClient.put(API_ENDPOINTS.petUpdate(id), data);
    },
    delete: async (id) => {
        return await apiClient.delete(API_ENDPOINTS.petDelete(id));
    },
    getByOwner: async (ownerId) => {
        return await apiClient.get(API_ENDPOINTS.petsByOwner(ownerId));
    },
    getParties: async (id) => {
        return await apiClient.get(API_ENDPOINTS.petParties(id));
    },
    transfer: async (id, newOwnerId) => {
        return await apiClient.patch(API_ENDPOINTS.petTransfer(id), {newOwnerId: newOwnerId});
    },
}