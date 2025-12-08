const API_BASE_URL = '';

export const API_CONFIG = {
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
};

export const API_ENDPOINTS = {
    // Users
    users: '/api/user',
    userStats: '/api/user/stats',
    userById: (id) => `/api/user/${id}`,
    userCreate: '/api/user',
    userLogin: '/api/user/login',
    userUpdate: (id) => `/api/user/${id}`,
    userDelete: (id) => `/api/user/${id}`,
    userDeactivate: (id) => `/api/user/${id}/deactivate`,
    userActivate: (id) => `/api/user/${id}/activate`,

    // Pets
    pets: '/api/pet',
    petById: (id) => `/api/pet/${id}`,
    petCreate: '/api/pet',
    petUpdate: (id) => `/api/pet/${id}`,
    petDelete: (id) => `/api/pet/${id}`,
    petsByOwner: (ownerId) => `/api/pet/${ownerId}/get`,
    petParties: (id) => `/api/pet/${id}/party`,
    petTransfer: (id) => `/api/pet/${id}/transfer`,

    // Parties
    parties: '/api/party',
    partyById: (id) => `/api/party/${id}`,
    partyCreate: '/api/party',
    partyUpdate: (id) => `/api/party/${id}`,
    partyDelete: (id) => `/api/party/${id}`,
    partyAddPet: (partyId, petId) => `/api/party/${partyId}/add/${petId}`,
    partyRemovePet: (partyId, petId) => `/api/party/${partyId}/remove/${petId}`,
};

export default API_CONFIG;