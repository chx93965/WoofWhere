import apiClient from './client';
import { API_ENDPOINTS } from './config';

export const partyApi = {
    getAll: async (params) => {
        const response = await apiClient.get(API_ENDPOINTS.parties, { params });
        return response.data;
    },
    getById: async (id) => {
        const response = await apiClient.get(API_ENDPOINTS.partyById(id));
        return response.data;
    },
    create: async (data) => {
        const response = await apiClient.post(API_ENDPOINTS.partyCreate, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await apiClient.put(API_ENDPOINTS.partyUpdate(id), data);
        return response.data;
    },
    delete: async (id) => {
        const response = await apiClient.delete(API_ENDPOINTS.partyDelete(id));
        return response.data;
    },
    addPet: async (partyId, petId) => {
        const response = await apiClient.patch(API_ENDPOINTS.partyAddPet(partyId, petId));
        return response.data;
    },
    removePet: async (partyId, petId) => {
        const response = await apiClient.patch(API_ENDPOINTS.partyRemovePet(partyId, petId));
        return response.data;
    },
};