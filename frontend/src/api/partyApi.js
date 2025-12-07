import apiClient from './client';
import {API_ENDPOINTS} from './config';

export const partyApi = {
    getAll: async (params) => {
        return await apiClient.get(API_ENDPOINTS.parties, {params});
    },
    getById: async (id) => {
        return await apiClient.get(API_ENDPOINTS.partyById(id));
    },
    create: async (data) => {
        return await apiClient.post(API_ENDPOINTS.partyCreate, data);
    },
    update: async (id, data) => {
        return await apiClient.put(API_ENDPOINTS.partyUpdate(id), data);
    },
    delete: async (id) => {
        return await apiClient.delete(API_ENDPOINTS.partyDelete(id));
    },
    addPet: async (partyId, petId) => {
        return await apiClient.patch(API_ENDPOINTS.partyAddPet(partyId, petId));
    },
    removePet: async (partyId, petId) => {
        return await apiClient.patch(API_ENDPOINTS.partyRemovePet(partyId, petId));
    },
};