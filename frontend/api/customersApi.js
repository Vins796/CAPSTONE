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
        try {
            const token = getAuthToken();
            const response = await axios.get(`${API_URL}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch(error) {
            console.error("Errore nella richiesta dei dati", error.response || error);
            throw error;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const token = getAuthToken();
            const response = await axios.patch(`${API_URL}/users/profile`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch(error) {
            console.error("Errore nella modifica utente", error);
            throw error;
        }
    },

    updateProfileImage: async (imageFile) => {
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('image', imageFile);
        
            const response = await axios.patch(`${API_URL}/users/profile/image`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log("Risposta dal server dopo l'upload:", response.data);
            return response.data;
        } catch (error) {
            console.error("Errore nell'aggiornamento dell'immagine del profilo", error.response?.data || error.message);
            throw error;
        }
    },
}