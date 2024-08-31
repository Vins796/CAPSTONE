import { useEffect, useState } from "react";
import { customersApi } from "../../../../api/customersApi";
import defaultAvatar from '/avatar.png'

// URL di base per l'API
const API_URL = 'http://localhost:5001';

// Componente per la card del cliente
const CustomerCard = ({ customer }) => {
  // Costruzione dell'URL dell'immagine del profilo
  const imageUrl = customer.image 
    ? `${API_URL}${customer.image}` 
    : defaultAvatar;

  return (
    <div className="border-opacity-25 bg-[#0f0f0f] drop-shadow-lg shadow rounded-lg p-4 mb-4">
      <div className="flex items-center gap-4 mb-3">
        <img
          src={imageUrl}
          alt={customer.name || 'Customer'}
          className="w-12 h-12 rounded-full text-[#7f848b]"
          onError={(e) => {
            // Gestione dell'errore nel caso l'immagine non possa essere caricata
            e.target.onerror = null; // previene loop infiniti
            e.target.src = defaultAvatar;
          }}
        />
        <div className="text-[#dbdee0]">
          <h3 className="font-bold text-md">{customer.name}</h3>
          <p className="text-sm text-[#7f848b]">{customer.email}</p>
        </div>
      </div>
      <div className="text-sm text-[#dbdee0]">
        <p><span className="font-semibold text-sm">Address:</span> <span className="text-[#7f848b]"> {customer.address || 'N/A'}</span></p>
        <p><span className="font-semibold text-sm">Phone:</span> <span className="text-[#7f848b]"> {customer.phone || 'N/A'}</span></p>
      </div>
    </div>
  );
};

// Componente principale CustomersTable
export default function CustomersTable({ search }) {
  // Stati per gestire i dati dei clienti, il caricamento e gli errori
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effetto per caricare i dati dei clienti all'avvio del componente
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const response = await customersApi.getAllCustomers();
        // Filtra i clienti per mostrare solo quelli con ruolo 'user'
        setCustomers(response.filter(customer => customer.role === 'user'));
      } catch(error) {
        console.error("Error fetching customers:", error);
        setError("Failed to load customers. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Funzione per filtrare i clienti in base alla ricerca
  const filterCustomers = (customers) => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase())
    );
  };

  // Applica il filtro di ricerca ai clienti
  const filteredCustomers = filterCustomers(customers);

  // Rendering condizionale basato sullo stato di caricamento e errori
  if (isLoading) return <div className="text-center py-4">Loading customers...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  // Rendering principale del componente
  return (
    <div className="bg-[#141414] border border-white border-opacity-[10%] rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => (
          <CustomerCard key={customer._id} customer={customer} />
        ))}
      </div>
    </div>
  );
}