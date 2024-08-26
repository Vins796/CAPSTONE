import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CustomersTable from "./components/CustomersTable";
import { getOrders, getOrderStats } from "../../../api/ordersApi";
import { Package } from "lucide-react";

const OrderCard = ({ order }) => (
  <div className="bg-[#0f0f0f] rounded-lg shadow-lg overflow-hidden">
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <span className="text-lg font-semibold">Order #{order._id.slice(-5)}</span>
      </div>
      <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
        {order.status}
      </div>
    </div>
    <div className="px-6 py-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Total</span>
        <span className="text-2xl font-bold">€{order.total.toFixed(2)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Order Date</span>
        <span className="text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Customer</span>
        <Link to={`/customers/${order.user}`} className="text-blue-600 hover:underline">
          View Customer
        </Link>
      </div>
    </div>
  </div>
);

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
          // getOrderStats()
        ]);
        setOrders(ordersData);
        setStats(statsData);
      } catch (err) {
        setError("Errore nel caricamento dei dati degli ordini");
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
          {loading && <p className="text-gray-700">Caricamento dati...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
            <>
              {stats && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Statistiche</h2>
                  <p className="text-gray-600">Vendite totali: €{stats.totalSales.toFixed(2)}</p>
                  <p className="text-gray-600">Numero totale di ordini: {stats.orderCount}</p>
                </div>
              )}

              <div className="mb-6 bg-[#131313] p-4 rounded-lg border border-white border-opacity-[10%]">
                <h2 className="text-2xl font-semibold text-[#dadada] mb-4">Ordini Recenti</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.slice(0, 6).map(order => (
                    <OrderCard key={order._id} order={order} />
                  ))}
                </div>
              </div>        
              <CustomersTable />             
            </>
          )}
        </main>
      </div>
    </div>
  );
}