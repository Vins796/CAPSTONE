// UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../api/ordersApi';

export default function UserOrders() {
  // Stati per gestire gli ordini, lo stato di caricamento e gli errori
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect hook per caricare gli ordini al montaggio del componente
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Chiamata API per ottenere gli ordini dell'utente
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        // Gestione degli errori
        setError("Errore nel caricamento degli ordini");
      } finally {
        // Imposta loading a false sia in caso di successo che di errore
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Array di dipendenze vuoto, l'effect viene eseguito solo al montaggio

  // Rendering condizionale basato sullo stato di caricamento e errore
  if (loading) return <div>Caricamento ordini...</div>;
  if (error) return <div>{error}</div>;

  // Rendering principale del componente
  return (
    <div>
      <h2>I tuoi ordini</h2>
      {/* Mappa attraverso gli ordini e renderizza i dettagli per ciascuno */}
      {orders.map(order => (
        <div key={order._id}>
          <p>Ordine ID: {order._id}</p>
          <p>Totale: €{order.total}</p>
          <p>Stato: {order.status}</p>
          {/* Puoi aggiungere altri dettagli dell'ordine qui */}
        </div>
      ))}
    </div>
  );
};