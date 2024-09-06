import React, { useState } from 'react';
import { useCart } from "../context/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import ConfirmationModal from './ConfirmationModal';
import { useNavigate } from 'react-router-dom';

// Componente principale del carrello
export default function Cart({ isCartOpen, closeCart }) {
  // Utilizzo degli hook e del contesto
  const { cart, removeFromCart, updateQuantity, processCheckout } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  // Se il carrello non è aperto, non renderizzare nulla
  if (!isCartOpen) return null;

  // Gestisce il processo di checkout
  const handleCheckout = async () => {
    // Se l'utente non è autenticato, reindirizza al login
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }
    
    try {
      // Processa il checkout
      await processCheckout();
      // Apre il modale di conferma
      setIsConfirmationOpen(true);
      // Naviga alla pagina del profilo utente
      navigate('/profile/:id');
    } catch (err) {
      // Gestione degli errori durante il checkout
      alert("Si è verificato un errore durante il checkout. Riprova più tardi.");
      console.error('Errore dettagliato:', err);
    }
  };

  // Chiude il modale di conferma e il carrello
  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
    closeCart();
  };

  // Gestisce il cambiamento della quantità di un prodotto
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      // Rimuove l'item se la quantità è 0 o negativa
      removeFromCart(itemId);
    } else {
      // Aggiorna la quantità
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <>
      <div className="p-4 font-poppins text-[#dadada]">
        {/* Header del carrello */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold">Il tuo carrello</h2>
          <button onClick={closeCart}><XIcon className="size-6"/></button>
        </div>
        
        {/* Lista degli item nel carrello */}
        {cart.map(item => (
          <div key={item._id} className="flex justify-between items-center py-4 border-b border-[#dadada] w-full">
            <div>
              <h3 className="font-semibold mb-1">{item.name}</h3>
              <p>€ {item.price} x {item.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Bottoni per modificare la quantità */}
              <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">-</button>
              <span className="mx-2">{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">+</button>
              {/* Bottone per rimuovere l'item */}
              <button onClick={() => removeFromCart(item._id)} className="ml-2"><TrashIcon className="size-6 hover:text-red-600"/></button>
            </div>
          </div>
        ))}
        
        {/* Sezione totale e checkout */}
        <div className="mt-5">
          <h3 className="text-xl font-bold">
            Totale: € {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
          </h3>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="bg-[#c7a600] hover:bg-[#ffd500] rounded-lg text-black w-2/3 p-2 text-sm mt-3"
          >
            Procedi all'ordine
          </button>
        </div>
      </div>
      
      {/* Modale di conferma */}
      <ConfirmationModal 
        isOpen={isConfirmationOpen} 
        onClose={handleConfirmationClose} 
      />
    </>
  );
}