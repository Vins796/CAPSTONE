import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
};

export const customersApi = {
    getAllCustomers: async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch(error) {
            console.error("Errore nell'ottenimento dei customers", error);
            throw error;
        }
    },

    getProfile: async () => {
        
    }
}