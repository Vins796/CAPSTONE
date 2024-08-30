import { useState } from "react";
import { TrashIcon, EyeIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import DeleteModal from "./DeleteOrderModal";
import { updateOrderStatus } from "../../api/adminApi";
import toast from 'react-hot-toast';

export default function OrdersTable({ orders, handleDeleteOrder, handleRemoveOrderItem }) {
  // Stati per gestire i modali e l'espansione degli ordini
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isRemoveItemModalOpen, setIsRemoveItemModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Funzione per aprire il modal di conferma eliminazione ordine
  const openDeleteModal = (orderId) => {
    setOrderToDelete(orderId);
    setIsDeleteModalOpen(true);
  };

  // Funzione per confermare l'eliminazione dell'ordine
  const confirmDelete = () => {
    if (orderToDelete) {
      handleDeleteOrder(orderToDelete);
      setIsDeleteModalOpen(false);
      setOrderToDelete(null);
      toast.success('Ordine eliminato con successo', {
        position: 'bottom-center',
      });
    }
  };

  // Funzione per aprire il modal di conferma rimozione articolo
  const openRemoveItemModal = (orderId, itemId) => {
    setItemToRemove({ orderId, itemId });
    setIsRemoveItemModalOpen(true);
  };

  // Funzione per confermare la rimozione dell'articolo
  const confirmRemoveItem = () => {
    if (itemToRemove) {
      handleRemoveOrderItem(itemToRemove.orderId, itemToRemove.itemId);
      setIsRemoveItemModalOpen(false);
      setItemToRemove(null);
      toast.success('Articolo rimosso dall\'ordine', {
        position: 'bottom-center',
      });
    }
  };

  // Funzione per gestire il cambio di stato dell'ordine
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Stato dell'ordine aggiornato a ${newStatus}`, {
        position: 'bottom-center',
      });
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato dell'ordine", error);
      toast.error('Errore nell\'aggiornamento dello stato dell\'ordine', {
        position: 'bottom-center',
      });
    }
  };

  // Funzione per renderizzare un singolo item dell'ordine
  const renderOrderItem = (item, orderId, isOnlyItem) => {
    const itemId = item.id || item._id || item.product;
    if (!itemId) {
      console.error("Item senza ID trovato:", item);
      return null;
    }
    return (
      <div key={`${orderId}-${itemId}`} className="flex justify-between items-center py-2 border-b border-gray-700">
        <span className="text-gray-300">{item.productName || "Nome non disponibile"}</span>
        <div className="flex items-center">
          <span className="mr-4 text-gray-400">x {item.quantity}</span>
          {!isOnlyItem && (
            <button
              onClick={() => openRemoveItemModal(orderId, itemId)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  // Se non ci sono ordini, mostra un messaggio
  if (!Array.isArray(orders) || orders.length === 0) {
    return <p className="text-center text-gray-400 py-8">Nessun ordine da visualizzare.</p>;
  }

  return (
    <div className="bg-[#141414] rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">I tuoi Ordini</h2>
      </div>

      <div className="divide-y divide-gray-700">
        {orders.map((order) => (
          <div key={order._id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Ordine #{order._id.slice(-6)}</p>
                <p className="text-lg font-medium text-white">${order.total}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                className="text-blue-500 hover:text-blue-400"
              >
                {expandedOrder === order._id ? (
                  <ChevronUpIcon className="h-6 w-6" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" />
                )}
              </button>
            </div>
            {expandedOrder === order._id && (
              <div className="mt-4 bg-[#1b1b1b] p-4 rounded-lg">
                <h4 className="text-md font-medium text-white mb-2">Dettagli dell'ordine</h4>
                {order.items.map((item) => renderOrderItem(item, order._id, order.items.length === 1))}
                <div className="mt-4 flex justify-between items-center">
                  <select
                    disabled
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="bg-[#1b1b1b] text-white rounded p-2 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={() => openDeleteModal(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
                  >
                    Elimina ordine
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modali di conferma */}
      {isDeleteModalOpen && (
        <DeleteModal
          handleDeleteOrder={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
      {isRemoveItemModalOpen && (
        <DeleteModal
          handleDeleteOrder={confirmRemoveItem}
          onClose={() => setIsRemoveItemModalOpen(false)}
          message="Sei sicuro di voler rimuovere questo articolo dall'ordine?"
        />
      )}
    </div>
  );
}