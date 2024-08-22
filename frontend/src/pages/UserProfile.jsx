import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { customersApi } from "../../api/customersApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  PencilIcon,
  UserCircleIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Componente per i campi del profilo
const ProfileField = ({ label, value, isEditing, onChange, placeholder }) => {
  if (isEditing) {
    // Renderizza un campo di input modificabile
    return (
      <div className="mb-4">
        <label className="block text-[#eee] text-sm font-bold mb-2">
          {label}
        </label>
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-[#eee] leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
    );
  }
  // Renderizza un campo di testo non modificabile
  return (
    <div className="mb-4">
      <span className="block text-gray-200 text-sm font-bold mb-2">
        {label}
      </span>
      <span className="text-gray-600">{value || "Non specificato"}</span>
    </div>
  );
};

export default function UserProfile() {
  // Ottiene l'ID utente dall'URL
  const { id } = useParams();

  // Stati per gestire i dati del profilo e lo stato dell'interfaccia
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(false);

  // Funzione per recuperare i dati del profilo
  const fetchProfile = useMemo(
    () => async () => {
      if (!id) {
        setError("ID utente non disponibile");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const response = await customersApi.getProfile(id);
        setProfile(response);
        setEditedProfile(response);
      } catch (error) {
        setError("Si è verificato un errore nel caricamento del profilo");
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  // Effetto per caricare il profilo all'avvio e quando forceUpdate cambia
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile, forceUpdate]);

  // Gestisce il cambio dell'immagine del profilo
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsImageLoading(true);
      try {
        const updatedUser = await customersApi.updateProfileImage(
          e.target.files[0]
        );
        setProfile(updatedUser);
        setEditedProfile(updatedUser);
        setForceUpdate((prev) => !prev);
      } catch (error) {
        setError("Errore nel caricamento dell'immagine");
      } finally {
        setIsImageLoading(false);
      }
    }
  };

  // Gestisce il salvataggio delle modifiche al profilo
  const handleSave = async () => {
    try {
      const updatedProfile = await customersApi.updateProfile(editedProfile);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      setError("Errore nel salvataggio delle modifiche");
    }
  };

  // Gestisce i cambiamenti nei campi del profilo
  const handleChange = (field, value) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Rendering condizionale basato sullo stato
  if (isLoading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!profile) return <div>Nessun profilo trovato</div>;

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center px-5 pt-24 mb-10">
        <div className="bg-[#0f0f0f] shadow-xl rounded-lg p-8 max-w-2xl w-full">
          {/* Sezione immagine profilo */}
          <div className="flex flex-col items-center space-y-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                {isImageLoading ? (
                  <div>Caricamento...</div>
                ) : profile.image ? (
                  <img
                    src={`http://localhost:5001${
                      profile.image
                    }?t=${new Date().getTime()}`}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = UserCircleIcon;
                    }}
                  />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-500" />
                )}
              </div>
              {/* Pulsante per cambiare l'immagine del profilo */}
              <label className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-blue-500 rounded-full p-2 text-white">
                  <PencilIcon className="w-4 h-4" />
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </label>
            </div>
            <h2 className="text-2xl font-bold text-gray-200">
              {profile.name || profile.email}
            </h2>
          </div>

          {/* Sezione campi profilo */}
          <div className="mt-8">
            {!isEditing ? (
              // Pulsante per attivare la modalità di modifica
              <button
                onClick={() => setIsEditing(true)}
                className="mb-4 text-[#eee] hover:text-[#d1d0d0] flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" /> Modifica Profilo
              </button>
            ) : (
              // Pulsanti per salvare o annullare le modifiche
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleSave}
                  className="text-green-500 hover:text-green-700 mr-2"
                >
                  <CheckIcon className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            )}

            {/* Campi del profilo */}
            <ProfileField
              label="Email"
              value={profile.email}
              isEditing={false}
            />
            <ProfileField
              label="Nome"
              value={isEditing ? editedProfile.name : profile.name}
              isEditing={isEditing}
              onChange={(value) => handleChange("name", value)}
              placeholder="Inserisci il tuo nome"
            />
            <ProfileField
              label="Indirizzo"
              value={isEditing ? editedProfile.address : profile.address}
              isEditing={isEditing}
              onChange={(value) => handleChange("address", value)}
              placeholder="Inserisci il tuo indirizzo"
            />
            <ProfileField
              label="Numero di telefono"
              value={isEditing ? editedProfile.phone : profile.phone}
              isEditing={isEditing}
              onChange={(value) => handleChange("phone", value)}
              placeholder="Inserisci il tuo numero di telefono"
            />
          </div>
        </div>
      </div>

      {/* Sezione Ordini */}
      <h2 className="text-center text-2xl font-poppins">Your Order</h2>
      <Footer />
    </>
  );
}
