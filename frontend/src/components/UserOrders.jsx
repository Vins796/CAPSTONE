// UserOrders.jsx
import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../../api/ordersApi';

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        setError("Errore nel caricamento degli ordini");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Caricamento ordini...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>I tuoi ordini</h2>
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
