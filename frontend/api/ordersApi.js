import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
};

export const getOrders = async () => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nel recupero degli ordini", error);
      throw error;
    }
  };

  export const getOrderStats = async () => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${API_URL}/orders/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nel recupero delle statistiche degli ordini", error);
      throw error;
    }
  };
  
  export const createOrder = async (orderData) => {
    const token = getAuthToken();
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nella creazione dell'ordine", error);
      throw error;
    }
  };

  export const getUserOrders = async () => {
    const token = getAuthToken();
    try {
      const response = await axios.get(`${API_URL}/orders/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nel recupero degli ordini dell'utente", error);
      throw error;
    }
  };
  
  export const removeOrderItem = async (orderId, itemId) => {
    const token = getAuthToken();
    try {
      const response = await axios.delete(`${API_URL}/orders/${orderId}/items/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nella rimozione dell'articolo", error);
      throw error;
    }
  };

  export const deleteOrder = async (orderId) => {
    const token = getAuthToken();
    try {
      const response = await axios.delete(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error("Errore nell'eliminazione dell'ordine", error);
      throw error;
    }
  };