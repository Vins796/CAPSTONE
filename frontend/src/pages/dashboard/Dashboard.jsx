// Dashboard.jsx
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CustomersTable from "./components/CustomersTable";
import { getOrders, getOrderStats } from "../../../api/ordersApi";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [ordersData, statsData] = await Promise.all([
          getOrders(),
          getOrderStats()
        ]);
        setOrders(ordersData);
        setStats(statsData);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">
          <h1 className="text-2xl font-semibold text-white mb-4">Dashboard</h1>
          
          {loading && <p className="text-white">Caricamento dati...</p>}
          {error && <p className="text-red-500">{error}</p>}
          
          {!loading && !error && (
            <>
              {stats && (
                <div className="bg-gray-700 p-4 rounded-lg mb-4">
                  <h2 className="text-xl font-semibold text-white mb-2">Statistiche</h2>
                  <p className="text-white">Vendite totali: €{stats.totalSales.toFixed(2)}</p>
                  <p className="text-white">Numero totale di ordini: {stats.orderCount}</p>
                </div>
              )}

              <div className="bg-gray-700 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-white mb-2">Ordini Recenti</h2>
                <table className="w-full text-white">
                  <thead>
                    <tr>
                      <th className="text-left">ID Ordine</th>
                      <th className="text-left">Totale</th>
                      <th className="text-left">Stato</th>
                      <th className="text-left">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map(order => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>€{order.total.toFixed(2)}</td>
                        <td>{order.status}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <CustomersTable />
        </main>
      </div>
    </div>
  );
}