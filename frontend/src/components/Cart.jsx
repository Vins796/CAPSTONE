import React, { useState } from 'react';
import { useCart } from "../context/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';

export default function Cart({ isCartOpen, closeCart }) {
  const { cart, removeFromCart, updateQuantity, processCheckout } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    
    try {
      await processCheckout();
      setIsConfirmationOpen(true);
      navigate('/profile/:id');
    } catch (err) {
      alert("Si è verificato un errore durante il checkout. Riprova più tardi.");
      console.error('Errore dettagliato:', err);
    }
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    closeCart();
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <>
      <div className="p-4 font-poppins text-[#dadada]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Il tuo carrello</h2>
          <button onClick={closeCart}><XIcon className="size-6"/></button>
        </div>
        {cart.map(item => (
          <div key={item._id} className="flex justify-between items-center py-4 border-b border-[#dadada] w-full">
            <div>
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p>€ {item.price} x {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">-</button>
              <span className="mx-2">{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">+</button>
              <button onClick={() => removeFromCart(item._id)} className="ml-2"><TrashIcon className="size-6 hover:text-red-600"/></button>
            </div>
          </div>
        ))}
        <div className="mt-5">
          <h3 className="text-xl font-bold">Totale: € {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="bg-[#ffd814] hover:bg-[#b49e31] rounded-lg text-black w-2/3 p-1 text-sm mt-3"
          >
            Procedi all'ordine
          </button>
        </div>
      </div>
      <ConfirmationModal 
        isOpen={isConfirmationOpen} 
        onClose={handleConfirmationClose} 
      />
    </>
  );
}