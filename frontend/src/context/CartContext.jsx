import React, { createContext, useState, useContext } from 'react';
import { checkout } from '../../api/cartApi';

// Creazione del contesto per il carrello
const CartContext = createContext();

// Provider del contesto del carrello
export const CartProvider = ({ children }) => {
  // Stato per memorizzare gli elementi nel carrello
  const [cart, setCart] = useState([]);

  // Funzione per aggiungere un prodotto al carrello
  const addToCart = (product) => {
    setCart(prevCart => {
      // Cerca se il prodotto è già nel carrello
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        // Se esiste, aumenta la quantità
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Se non esiste, aggiungi il nuovo prodotto
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Funzione per rimuovere un prodotto dal carrello
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  // Funzione per aggiornare la quantità di un prodotto nel carrello
  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => item._id === productId ? { ...item, quantity } : item )
    );
  };

  // Funzione per processare il checkout
  const processCheckout = async() => {
    try {
      // Prepara i dati dell'ordine
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      // Calcola il totale dell'ordine
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Effettua la chiamata API per il checkout
      const response = await checkout({ items: orderItems, total });
      // Svuota il carrello dopo il checkout
      setCart([]);
      return response;
    } catch(error) {
      console.error("Errore durante il checkout", error);
      throw error;
    }
  };

  // Fornisce il contesto del carrello ai componenti figli
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, processCheckout }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto del carrello
export const useCart = () => useContext(CartContext);