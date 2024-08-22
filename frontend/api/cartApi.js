import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
};

export const syncCart = async (cartItems) => {
    const token = getAuthToken();
    try {
      const response = await axios.post(`${API_URL}/cart/sync`, { items: cartItems }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nella sincronizzazione del carrello", error);
      throw error;
    }
};

export const checkout = async (cartItems) => {
    const token = getAuthToken();
    try {
        const response = await axios.post(`${API_URL}/orders`, { items: cartItems }, {
        headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Errore durante il checkout", error);
        throw error;
    }
};