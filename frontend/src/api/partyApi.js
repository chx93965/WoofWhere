import apiClient from './client';
import axios from 'axios';

// TODO: define URL in config files
const BACKEND_URL = 'http://localhost:4001/api/party';

// export const partyApi = {
//     getAll: (params) => apiClient.get('/api/party', { params }),
//     getById: (id) => apiClient.get(`/api/party/${id}`),
//     create: (data) => apiClient.post('/api/party', data),
//     update: (id, data) => apiClient.put(`/api/party/${id}`, data),
//     delete: (id) => apiClient.delete(`/api/party/${id}`),
//     addPet: (partyId, petId) => apiClient.patch(`/api/party/${partyId}/add/${petId}`),
//     removePet: (partyId, petId) => apiClient.patch(`/api/party/${partyId}/remove/${petId}`),
// };

export const partyApi = {
    getAll: async (params) => {
        const response = await axios.get(BACKEND_URL, { params });
        return response.data;
    },
    getById: async (id) => {
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
    addPet: async (partyId, petId) => {
        const response = await axios.patch(`${BACKEND_URL}/${partyId}/add/${petId}`);
        return response.data;
    },
    removePet: async (partyId, petId) => {
        const response = await axios.patch(`${BACKEND_URL}/${partyId}/remove/${petId}`);
        return response.data;
    },
};