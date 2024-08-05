import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const getAuthToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No auth token found');
    }
    return token;
};

export const productApi = {
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${API_URL}/products`);
            return response.data;
        } catch(error) {
            console.error("Errore nell'ottenimento dei prodotti", error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
          const token = getAuthToken();
          const formData = new FormData();
          for (const key in productData) {
            formData.append(key, productData[key]);
          }
          const response = await axios.post(`${API_URL}/products`, formData, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
          return response.data;
        } catch (error) {
            if (error.message === 'No auth token found') {
              throw new Error('User not authenticated');
            }
            if (error.response && error.response.status === 401) {
              throw new Error('Session expired or unauthorized');
            }
            console.error("Errore nella creazione del prodotto", error);
            throw error;
          }
      },

    updateProduct: async (id, productData) => {
        try {
          const response = await axios.put(`${API_URL}/products/${id}`, productData);
          return response.data;
        } catch (error) {
          console.error('Error updating product:', error);
          throw error;
        }
    },
    
    deleteProduct: async (id) => {
        try {
        const response = await axios.delete(`${API_URL}/products/${id}`);
        return response.data;
        } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
        }
    }
}