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
    console.error("Errore nel recupero delle statistiche degli ordini", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const token = getAuthToken();
  console.log("provo a modificare", orderId, newStatus);
  try {
    const data = { status: newStatus };
    console.log("dati inviati", data);
    const response = await axios.put(`${API_URL}/orders/${orderId}/status`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    return response.data;
  } catch (error) {
    console.error("Errore nell'aggiornamento dello stato dell'ordine", error);
    throw error;
  }
};