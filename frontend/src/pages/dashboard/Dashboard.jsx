import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CustomersTable from "./components/CustomersTable";
import { getOrders } from "../../../api/ordersApi";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserRegistrationChart from "./components/UserRegistrationChart";
import OrdersBarChart from "./components/OrdersBarChart";
import { updateOrderStatus } from "../../../api/adminApi";

// Componente per la card dell'ordine
const OrderCard = ({ order, onStatusUpdate }) => {
  // Effettuo la destrutturazione dell'oggetto order per estrarre i valori interessati
  const [status, setStatus] = useState(order.status); // Imposto il valore iniziale allo stato iniziale dell'ordine ('pending')
  const [isUpdating, setIsUpdating] = useState(false); // Imposto lo stato iniziale a false, verrà modificato più avanti a seconda della necessità

  // Funzione per modificare lo stato dell'ordine
  const handleStatusChange = async(e) => {
    const newStatus = e.target.value;
    console.log("Tentativo di aggiornamento stato", order._id, newStatus);
    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      setStatus(newStatus);
      onStatusUpdate(order._id, newStatus);
    } catch(error) {
      console.error("Errore nell'aggiornamento dello stato", error)
    } finally {
      setIsUpdating(false);
    }
  }

  return(
    <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="bg-[#0f0f0f] rounded-lg shadow-lg overflow-hidden"
  >
    {/* Intestazione della card */}
    <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800 text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5" />
        <span className="text-lg font-semibold">Order #{order._id.slice(-5)}</span>
      </div>
      <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
        {order.status}
      </div>
    </div>
    {/* Contenuto della card */}
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
        <span className="text-blue-600">{order.user.name}</span>
      </div>

      {/* Modifica dello stato dell'ordine */}
      <span className="text-gray-500">Status</span>
        <select 
          value={status} 
          onChange={handleStatusChange}
          disabled={isUpdating}
          className="bg-white text-gray-800 rounded p-1"
        >
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
    </div>
    </motion.div>
  )  
};

// Componente principale Dashboard
export default function Dashboard() {
  // Stati del componente
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Effetto per caricare i dati all'avvio del componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        setOrders(ordersData);
        console.log(ordersData);
      } catch (err) {
        setError("Errore nel caricamento dei dati degli ordini");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Funzione per alternare la visualizzazione di tutti gli ordini
  const toggleOrdersDisplay = () => setShowAllOrders(!showAllOrders);

  // Filtro per gli ordini da visualizzare
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 3);

  // Funzione che aggiorna lo stato dell'ordine
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Contenuto principale */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4">          
          {/* Gestione dello stato di caricamento e errori */}
          {loading && <p className="text-gray-300">Caricamento dati...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* Contenuto della dashboard */}
          {!loading && !error && (
            <>
              {/* Sezione ordini */}
              <div className="mb-6 bg-[#131313] p-4 rounded-lg border border-white border-opacity-[10%]">
                <h2 className="text-2xl font-semibold text-[#dadada] mb-4">Ordini Recenti</h2>
                
                {/* Griglia degli ordini con animazione */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  <AnimatePresence>
                    {displayedOrders.map(order => (
                      <OrderCard 
                        key={order._id} 
                        order={order}
                        onStatusUpdate={handleOrderStatusUpdate} 
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pulsante "Mostra più/meno" */}
                {orders.length > 3 && (
                  <motion.div 
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <button
                      onClick={toggleOrdersDisplay}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                      {showAllOrders ? (
                        <>
                          <span>Mostra meno</span>
                          <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Mostra tutti</span>
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Tabella dei clienti */}
              <CustomersTable />
              {/* Sezione grafici */}
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <UserRegistrationChart /> 
                <OrdersBarChart />  
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}