import apiClient from './client';
import axios from 'axios';

// TODO: define URL in config files
const BACKEND_URL = 'http://localhost:4001/api/pet';

// export const petApi = {
//     getAll: (params) => apiClient.get('/api/pet', { params }),
//     getById: (id) => apiClient.get(`/api/pet/${id}`),
//     create: (data) => apiClient.post('/api/pet', data),
//     update: (id, data) => apiClient.put(`/api/pet/${id}`, data),
//     delete: (id) => apiClient.delete(`/api/pet/${id}`),
//     getByOwner: (ownerId) => apiClient.get(`/api/pet/${ownerId}/get`),
//     getParties: (id) => apiClient.get(`/api/pet/${id}/party`),
//     transfer: (id, newOwnerId) =>
//         apiClient.patch(`/api/pet/${id}/transfer`, { new_owner_id: newOwnerId }),
// };

export const petApi = {
    getAll: async (params) => {
        const response = await axios.get(BACKEND_URL, { params });
        return response.data;
    },
    getById: async (params) => {
        const response = await axios.get(`${BACKEND_URL}/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(BACKEND_URL, data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await axios.put(`${BACKEND_URL}/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await axios.delete(`${BACKEND_URL}/${id}`);
        return response.data;
    },
    getByOwner: async (ownerId) => {
        const response = await axios.get(`${BACKEND_URL}/${ownerId}/get`);
        return response.data;
    },
    getParties: async (id) => {
        const response = await axios.get(`${BACKEND_URL}/${id}/party`);
        return response.data;
    },
    transfer: async (id, newOwnerId) => {
        const response = await axios.patch(`${BACKEND_URL}/${id}/transfer`, { new_owner_id: newOwnerId });
        return response.data;
    },
}