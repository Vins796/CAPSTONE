import { useCart } from "../context/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart({ isCartOpen, closeCart }) {
  
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, processCheckout } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await processCheckout();
      console.log('Ordine completato:', result);
      alert("Ordine inviato");
      closeCart();
      navigate('/');
    } catch (err) {
      setError('Si è verificato un errore durante il checkout. Riprova più tardi.');
      console.error('Errore dettagliato:', err);
    } finally {
      setIsProcessing(false);
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
              <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">-</button>
              <span className="mx-2">{item.quantity}</span>
              <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="border border-black rounded-full size-8 hover:bg-gray-300 hover:text-[#0f0f0f]">+</button>
              <button onClick={() => removeFromCart(item._id)} className="ml-2"><TrashIcon className="size-6 hover:text-red-600"/></button>
            </div>
          </div>
        ))}
        <div className="mt-5">
          <h3 className="text-xl font-bold">Totale: € {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
          <button 
            onClick={handleCheckout} 
            disabled={isProcessing || cart.length === 0}
            className={`bg-[#ffd814] hover:bg-[#b49e31] rounded-lg text-black w-2/3 p-1 text-sm mt-3 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isProcessing ? 'Elaborazione...' : "Procedi all'ordine"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    </>
  );
}