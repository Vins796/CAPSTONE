import React, { createContext, useState, useContext } from 'react';
import { checkout } from '../../api/cartApi';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item._id === product._id);
      if (existingItem) {
        return prevCart.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const processCheckout = async() => {
    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // console.log("Invio l'ordine", { items: orderItems, total });
      const response = await checkout({ items: orderItems, total });
      setCart([]);
      return response;
    } catch(error) {
      console.error("Errore durante il checkout", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, processCheckout }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
