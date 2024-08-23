import React from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function OrdersTable({
  orders,
  handleDeleteOrder,
  handleUpdateOrderStatus,
}) {
  console.log("Rendering OrdersTable with orders:", orders);

  if (!Array.isArray(orders) || orders.length === 0) {
    return <p className="text-center">Nessun ordine da visualizzare.</p>;
  }

  return (
    <div className="container mx-auto my-14">
      <h2 className="text-center text-2xl font-poppins mb-5">I tuoi Ordini</h2>

      {/* Tabella per schermi più grandi */}
      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table className="min-w-full bg-[#0f0f0f]">
          <thead>
            <tr>
              <th className="p-4 border-b border-[#2f353c] text-left">ID Ordine</th>
              <th className="p-4 border-b border-[#2f353c] text-left">Data</th>
              <th className="p-4 border-b border-[#2f353c] text-left">Prodotti</th>
              <th className="p-4 border-b border-[#2f353c] text-left">Totale</th>
              <th className="p-4 border-b border-[#2f353c] text-left">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4 border-b border-[#2f353c]">{order._id}</td>
                <td className="py-2 px-4 border-b border-[#2f353c]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b border-[#2f353c]">
                  {order.items.map((item) => (
                    <div key={item._id}>
                      {item.product?.name || "Nome non disponibile"} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="py-2 px-4 border-b border-[#2f353c]">${order.total}</td>
                <td className="py-2 px-4 border-b border-[#2f353c]">
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="text-red-500 hover:text-red-700 mr-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lista per schermi più piccoli */}
      <div className="md:hidden px-5">
        {orders.map((order) => (
          <div key={order._id} className="bg-[#0f0f0f] shadow rounded-lg mb-4 p-4">
            <div className="mb-2">
              <span className="font-bold">ID Ordine:</span> {order._id}
            </div>
            <div className="mb-2">
              <span className="font-bold">Data:</span> {new Date(order.createdAt).toLocaleDateString()}
            </div>
            <div className="mb-2">
              <span className="font-bold">Prodotti:</span>
              {order.items.map((item) => (
                <div key={item._id}>
                  {item.product?.name || "Nome non disponibile"} x {item.quantity}
                </div>
              ))}
            </div>
            <div className="mb-2">
              <span className="font-bold">Totale:</span> ${order.total}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="text-red-500 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}