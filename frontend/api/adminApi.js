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
    // console.log("Faccio la richiesta degli ordini");
    const response = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Errore nel recupero delle statistiche degli ordini", error);
    throw error;
  }
};

// export const getOrderStats = async () => {
//   const token = getAuthToken();
//   try {
//     const response = await axios.get(`${API_URL}/orders/stats`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Errore nel recupero delle statistiche degli ordini", error);
//     throw error;
//   }
// };