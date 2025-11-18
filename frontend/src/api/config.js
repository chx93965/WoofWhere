const getApiBaseUrl = () => {
    return '';  // Use relative URLs
};

export const API_CONFIG = {
    baseURL: getApiBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
};

export const API_ENDPOINTS = {
    user: '/api/user',
    pet: '/api/pet',
    party: '/api/party',
};