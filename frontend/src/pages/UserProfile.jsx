import React, { useEffect, useState } from "react";
import { customersApi } from "../../api/customersApi";
import { getUserOrders, deleteOrder, removeOrderItem } from "../../api/ordersApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PencilIcon, UserCircleIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import OrdersTable from "../components/OrdersTable";
import { Link } from "react-router-dom";

// Componente per i campi del profilo
const ProfileField = ({ label, value, isEditing, onChange, placeholder }) => (
  <div className="mb-4">
    <span className="block text-gray-200 text-sm font-bold mb-2">{label}</span>
    {isEditing ? (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-[#eee] leading-tight focus:outline-none focus:shadow-outline"
      />
    ) : (
      <span className="text-gray-600">{value || "Non specificato"}</span>
    )}
  </div>
);

export default function UserProfile() {
  // Stati per gestire i dati del profilo e lo stato dell'interfaccia
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Effetto per caricare il profilo e gli ordini
  useEffect(() => {
    const loadProfileAndOrders = async () => {
      setIsLoading(true);
      try {
        const profileData = await customersApi.getProfile();
        setProfile(profileData);
        setEditedProfile(profileData);

        const ordersData = await getUserOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        setError("Si è verificato un errore nel caricamento dei dati");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileAndOrders();
  }, []);

  // Gestione del cambio dell'immagine del profilo
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageLoading(true);
      try {
        const updatedUser = await customersApi.updateProfileImage(e.target.files[0]);
        setProfile(updatedUser);
        setEditedProfile(updatedUser);
      } catch (error) {
        setError("Errore nel caricamento dell'immagine: " + error.message);
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  // Gestione del salvataggio del profilo
  const handleSave = async () => {
    try {
      const updatedProfile = await customersApi.updateProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setError("Errore nel salvataggio delle modifiche");
    }
  };

  // Gestione dell'eliminazione di un ordine
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error("Errore nell'eliminazione dell'ordine", error);
    }
  };

  // Gestione della rimozione di un item da un ordine
  const handleRemoveOrderItem = async (orderId, itemId) => {
    if (!itemId) return;
    try {
      const updatedOrder = await removeOrderItem(orderId, itemId);
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order._id === orderId) {
            if (!updatedOrder.items || updatedOrder.items.length === 0) {
              return null;
            }
            return updatedOrder;
          }
          return order;
        }).filter(Boolean)
      );
      // Feedback all'utente
      alert("Articolo rimosso con successo");
    } catch (error) {
      console.error("Errore nella rimozione dell'articolo", error);
      // Feedback all'utente sull'errore
      alert("Si è verificato un errore durante la rimozione dell'articolo. Riprova più tardi.");
    }
  };

  if (isLoading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!profile) return <div>Nessun profilo trovato</div>;

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center px-5 pt-[84px]">
        <div className="bg-[#0f0f0f] shadow-xl rounded-lg p-8 max-w-2xl w-full">
          {/* Sezione immagine profilo */}
          <div className="flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                {isImageLoading ? (
                  <div>Caricamento...</div>
                ) : profile.image ? (
                  <img
                    src={`http://localhost:5001${profile.image}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => { e.target.src = "/path/to/fallback/image.jpg"; }}
                  />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-500" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-blue-500 rounded-full p-2 text-white">
                  <PencilIcon className="w-4 h-4" />
                </div>
                <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
              </label>
            </div>
            <h2 className="text-2xl font-bold text-gray-200">{profile.name || profile.email}</h2>
          </div>

          {/* Sezione campi profilo */}
          <div className="mt-8">
            <div className="flex justify-center mb-4">
              {!isEditing ? (
                  
                
                <button onClick={() => setIsEditing(true)} className="mb-4 text-[#eee] hover:text-[#d1d0d0] flex items-center">
                  <PencilIcon className="h-5 w-5 mr-2" /> Modifica Profilo
                </button>
              ) : (
                <div className="flex justify-end mb-4">
                  <button onClick={handleSave} className="text-green-500 hover:text-green-700 mr-2">
                    <CheckIcon className="h-6 w-6" />
                  </button>
                  <button onClick={() => setIsEditing(false)} className="text-red-500 hover:text-red-700">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
            </div>

            <ProfileField label="Email" value={profile.email} isEditing={false} />
            <ProfileField
              label="Nome"
              value={isEditing ? editedProfile.name : profile.name}
              isEditing={isEditing}
              onChange={(value) => setEditedProfile(prev => ({ ...prev, name: value }))}
              placeholder="Inserisci il tuo nome"
            />
            <ProfileField
              label="Indirizzo"
              value={isEditing ? editedProfile.address : profile.address}
              isEditing={isEditing}
              onChange={(value) => setEditedProfile(prev => ({ ...prev, address: value }))}
              placeholder="Inserisci il tuo indirizzo"
            />
            <ProfileField
              label="Numero di telefono"
              value={isEditing ? editedProfile.phone : profile.phone}
              isEditing={isEditing}
              onChange={(value) => setEditedProfile(prev => ({ ...prev, phone: value }))}
              placeholder="Inserisci il tuo numero di telefono"
            />
          </div>
        </div>
      </div>

      {/* Sezione Ordini */}
      {orders.length > 0 ? (
        <OrdersTable
          orders={orders}
          handleDeleteOrder={handleDeleteOrder}
          handleRemoveOrderItem={handleRemoveOrderItem}
        />
      ) : (
        <div className="text-center p-20 md:p-40 space-y-5">
          <p>Nessun ordine trovato.</p>
          <p className="underline text-[#3b82f6]"><Link to='/products'>Effettua un ordine</Link></p>
        </div>
      )}
      <Footer />
    </>
  );
}