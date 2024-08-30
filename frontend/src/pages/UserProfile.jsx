import React, { useEffect, useState } from "react";
import { customersApi } from "../../api/customersApi";
import { getUserOrders, deleteOrder, removeOrderItem } from "../../api/ordersApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PencilIcon, UserCircleIcon, CheckIcon, XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";
import OrdersTable from "../components/OrdersTable";
import { Link, useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

// Componente per i campi del profilo
const ProfileField = ({ label, value, isEditing, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor={label}>
      {label}
    </label>
    {isEditing ? (
      <input
        id={label}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline bg-gray-700"
      />
    ) : (
      <p className="text-gray-400 py-2">{value || "Non specificato"}</p>
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

  const location = useLocation();

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

    // Verifica se c'è un messaggio di successo nell'oggetto location state
    if (location.state && location.state.orderSuccess) {
      toast.success('Ordine effettuato con successo', {
        position: window.innerWidth <= 768 ? 'top-center' : 'bottom-right',
      });
    }
  }, [location]);

  // Gestione del cambio dell'immagine del profilo
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageLoading(true);
      try {
        const updatedUser = await customersApi.updateProfileImage(e.target.files[0]);
        setProfile(updatedUser);
        setEditedProfile(updatedUser);
        toast.success('Immagine del profilo aggiornata con successo');
      } catch (error) {
        setError("Errore nel caricamento dell'immagine: " + error.message);
        toast.error("Errore nel caricamento dell'immagine");
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
      toast.success('Profilo aggiornato con successo');
    } catch (error) {
      setError("Errore nel salvataggio delle modifiche");
      toast.error("Errore nel salvataggio delle modifiche");
    }
  };

  // Gestione dell'eliminazione di un ordine
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders(orders.filter(order => order._id !== orderId));
      toast.success('Ordine eliminato con successo');
    } catch (error) {
      console.error("Errore nell'eliminazione dell'ordine", error);
      toast.error("Errore nell'eliminazione dell'ordine");
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
      toast.success("Articolo rimosso con successo");
    } catch (error) {
      console.error("Errore nella rimozione dell'articolo", error);
      toast.error("Errore nella rimozione dell'articolo");
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Caricamento in corso...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Errore: {error}</div>;
  if (!profile) return <div className="text-center py-10">Nessun profilo trovato</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white">
      <Navbar />
      <Toaster />
      <div className="container mx-auto px-4 py-20 md:py-36">
        <div className="bg-[#141414] shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex flex-col md:flex-row">
            {/* Sezione immagine profilo */}
            <div className="md:w-full md:w-1/3 p-6 md:p-8 bg-[#1b1b1b]">
              <div className="relative">
                <div className="w-32 h-32 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                  {isImageLoading ? (
                    <div className="text-white">Caricamento...</div>
                  ) : profile.image ? (
                    <img
                      src={`http://localhost:5001${profile.image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/path/to/fallback/image.jpg"; }}
                    />
                  ) : (
                    <UserCircleIcon className="w-24 h-24 md:w-32 md:h-32 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-1/2 md:right-0 transform translate-x-1/2 md:translate-x-0 bg-blue-500 rounded-full p-2 cursor-pointer">
                  <CameraIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-center mt-4">{profile.name || profile.email}</h2>
              <p className="text-gray-400 text-center text-sm md:text-base">{profile.email}</p>
            </div>

            {/* Sezione campi profilo */}
            <div className="md:w-full md:w-2/3 p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-0">Informazioni Profilo</h3>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    <PencilIcon className="h-5 w-5 inline mr-2" /> Modifica
                  </button>
                ) : (
                  <div className="flex flex-col md:flex-row w-full md:w-auto space-y-2 md:space-y-0 md:space-x-2">
                    <button onClick={handleSave} className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
                      <CheckIcon className="h-5 w-5 inline mr-2" /> Salva
                    </button>
                    <button onClick={() => setIsEditing(false)} className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                      <XMarkIcon className="h-5 w-5 inline mr-2" /> Annulla
                    </button>
                  </div>
                )}
              </div>

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
        <div className="mt-8 md:mt-12">
          <h3 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">I tuoi Ordini</h3>
          {orders.length > 0 ? (
            <OrdersTable
              orders={orders}
              handleDeleteOrder={handleDeleteOrder}
              handleRemoveOrderItem={handleRemoveOrderItem}
            />
          ) : (
            <div className="text-center py-8 md:py-10 bg-[#141414] rounded-lg">
              <p className="text-lg md:text-xl mb-4">Nessun ordine trovato.</p>
              <Link to='/products' className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                Effettua un ordine
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}