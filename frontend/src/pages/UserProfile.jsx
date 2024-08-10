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

// Importazioni necessarie per il componente

const ProfileField = ({ label, value, isEditing, onChange, placeholder }) => {
  // Componente riutilizzabile per i campi del profilo
  if (isEditing) {
    // Se in modalità di modifica, mostra un input
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
  // Se non in modalità di modifica, mostra solo il testo
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
  const { id } = useParams(); // Ottiene l'ID utente dall'URL
  const [profile, setProfile] = useState(null); // Stato per i dati del profilo
  const [editedProfile, setEditedProfile] = useState(null); // Stato per i dati del profilo in fase di modifica
  const [error, setError] = useState(null); // Stato per gli errori
  const [isLoading, setIsLoading] = useState(true); // Stato per indicare se i dati stanno caricando
  const [isEditing, setIsEditing] = useState(false); // Stato per la modalità di modifica
  const [newProfileImage, setNewProfileImage] = useState(null);

  const fetchProfile = useMemo(
    () => async () => {
      // Funzione per recuperare i dati del profilo, memorizzata con useMemo
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
        setError(
          error.message ||
            "Si è verificato un errore nel caricamento del profilo"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    // Effetto per caricare i dati del profilo al montaggio del componente
    let isMounted = true;
    const fetchData = async () => {
      await fetchProfile();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [fetchProfile]);

  // Funzione di modifica utente
  const handleEdit = () => {
    setIsEditing(true); // Attiva la modalità di modifica
    setNewProfileImage(null); // Resetta l'immagine del profilo quando si inizia a modificare
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  }; // Annulla le modifiche e disattiva la modalità di modifica

  // Funzione per modificare l'immagine profilo
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  // Funzione per caricare l'immagine
  const handleImageUpload = async () => {
    if (newProfileImage) {
      try {
        console.log("Tentativo di upload dell'immagine:", newProfileImage);
        const updatedUser = await customersApi.updateProfileImage(newProfileImage);
        console.log("Profilo aggiornato ricevuto:", updatedUser);
        
        setProfile(prevProfile => ({
          ...prevProfile,
          image: updatedUser.image
        }));
        setNewProfileImage(null);
  
        console.log("Stato del profilo dopo l'aggiornamento:", profile);
      } catch (error) {
        console.error("Errore nel caricamento dell'immagine:", error);
        setError("Errore nel caricamento dell'immagine");
      }
    }
  };

  // Funzione per salvare le modifiche
  const handleSave = async () => {
    try {
        if (newProfileImage) {
            await handleImageUpload();
        }

        const updatedProfileData = { ...editedProfile, id: id };  // Includi l'ID
        const updatedProfile = await customersApi.updateProfile(updatedProfileData);
        setProfile(updatedProfile);
        setIsEditing(false);
        setNewProfileImage(null);
    } catch (error) {
        console.error("Errore nel salvataggio del profilo:", error);
        setError("Errore nel salvataggio delle modifiche");
    }
  };

  const handleChange = (field, value) => {
    // Aggiorna un campo specifico del profilo in fase di modifica
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <div>Caricamento in corso...</div>;
  if (error) return <div>Errore: {error}</div>;
  if (!profile) return <div>Nessun profilo trovato</div>;

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center pt-[72px] h-screen">
        <div className="bg-[#0f0f0f] shadow-xl rounded-lg p-8 max-w-2xl w-full">
          <div className="flex flex-col items-center space-y-5">
            <div className="relative">
              {/* Immagine del profilo o icona predefinita */}
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                {newProfileImage || profile.image ? (
                  <img
                    src={profile.image ? `http://localhost:5001${profile.image}` : UserCircleIcon}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-500" />
                )}
              </div>
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

          <div className="mt-8">
            {!isEditing ? (
              // Pulsante per attivare la modalità di modifica
              <button
                onClick={handleEdit}
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
                  onClick={handleCancel}
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
      <Footer />
    </>
  );
}
