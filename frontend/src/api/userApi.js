// import apiClient from './client';
import axios from 'axios';

// TODO: define URL in config files
const BACKEND_URL = 'http://localhost:4001/api/user';

// export const userApi = {
//     getAll: (params) => apiClient.get('/api/user', { params }),
//     getStats: () => apiClient.get('/api/user/stats'),
//     getById: (id) => apiClient.get(`/api/user/${id}`),
//     create: (data) => {apiClient.post('/api/user', data)
//         console.log("Calling create user API with data:", data);
//     },
//     update: (id, data) => apiClient.put(`/api/user/${id}`, data),
//     delete: (id) => apiClient.delete(`/api/user/${id}`),
//     deactivate: (id) => apiClient.patch(`/api/user/${id}/deactivate`),
//     activate: (id) => apiClient.patch(`/api/user/${id}/activate`),
// };

export const userApi = {
    getAll: async (params) => {
        const response = await axios.get(BACKEND_URL, { params });
        return response.data;
    },
    getStats: async () => {
        const response = await axios.get(`${BACKEND_URL}/stats`);
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
    deactivate: async (id) => {
        const response = await axios.patch(`${BACKEND_URL}/${id}/deactivate`);
        return response.data;
    },
    activate: async (id) => {
        const response = await axios.patch(`${BACKEND_URL}/${id}/activate`);
        return response.data;
    },
};