import { useCart } from "../context/CartContext";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XIcon } from "lucide-react";

export default function Cart({ isCartOpen, closeCart }) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  if (!isCartOpen) return null; // Non renderizzare se il carrello è chiuso

  return (
    <>
        <div className="p-4 text-black">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-poppins">Il tuo carrello</h2>
            <button onClick={closeCart}><XIcon className="size-6"/></button>
          </div>
          {cart.map(item => (
            <div key={item._id} className="flex justify-between items-center mb-2 space-y-8">
              <div>
                <h3>{item.name}</h3>
                <p>€{item.price} x {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="border border-black rounded-full size-8 hover:bg-red-500">-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="border border-black rounded-full size-8 hover:bg-green-500">+</button>
                <button onClick={() => removeFromCart(item._id)} className="ml-2"><TrashIcon className="size-6"/></button>
              </div>
            </div>
          ))}
          <div className="mt-5">
            <h3 className="text-xl font-bold">Totale: €{cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
          </div>
        </div>
    </>
  );
}