import { useState, useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CustomersTable from "./components/CustomersTable";
import { getOrders } from "../../../api/ordersApi";
import { ChevronDown, ChevronUp, Package, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import UserRegistrationChart from "./components/UserRegistrationChart";
import OrdersBarChart from "./components/OrdersBarChart";
import { updateOrderStatus } from "../../../api/adminApi";

// Componente per la card dell'ordine
const OrderCard = ({ order, onStatusUpdate }) => {
  // Stato locale per lo status dell'ordine e lo stato di aggiornamento
  const [status, setStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  // Nuovo stato per gestire l'espansione della card
  const [isExpanded, setIsExpanded] = useState(false);

  // Funzione per gestire il cambiamento di stato dell'ordine
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      await updateOrderStatus(order._id, newStatus);
      setStatus(newStatus);
      onStatusUpdate(order._id, newStatus);
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Funzione per alternare l'espansione della card
  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Rendering della card dell'ordine
  return (
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
          {status}
        </div>
      </div>
      {/* Corpo della card */}
      <div className="px-6 py-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Totale</span>
          <span className="text-2xl font-bold">€{order.total.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Data</span>
          <span className="text-gray-500">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Cliente</span>
          <span className="text-blue-600">{order.user.name}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Stato</span>
          <select 
            value={status} 
            onChange={handleStatusChange}
            disabled={isUpdating}
            className="bg-[#131313] text-gray-500 rounded p-1"
          >
            <option value="pending">Ricevuto</option>
            <option value="processing">In lavorazione</option>
            <option value="completed">Completato</option>
          </select>
        </div>
        {/* Pulsante per espandere/comprimere i dettagli dell'ordine */}
        <button
          onClick={toggleExpand}
          className="w-full flex items-center justify-between text-blue-500 hover:text-blue-600 transition-colors"
        >
          <span>{isExpanded ? "Nascondi dettagli" : "Mostra dettagli"}</span>
          <ChevronRight className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </button>
        {/* Dettagli dell'ordine (visibili solo quando espanso) */}
        {isExpanded && (
          <div className="mt-4 space-y-2">
            <h4 className="text-lg font-semibold text-gray-300">Dettaglio Ordine:</h4>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-gray-400">
                <span className="text-white">Nome: <span className="text-[#2151cc]">{item.productName}</span></span>
                <span className="text-white">Quantità: <span className="text-[#2151cc]">{item.quantity}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Componente principale Dashboard
export default function Dashboard() {
  // Stati del componente
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [search, setSearch] = useState('');

  // Funzione per gestire la ricerca
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  // Effetto per caricare i dati degli ordini all'avvio del componente
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        console.log(ordersData);
        setOrders(ordersData);
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

  // Funzione memorizzata per filtrare gli ordini
  const filterOrders = useMemo(() => {
    if (!search.trim()) return orders;
    
    const searchTerms = search.toLowerCase().trim().split(/\s+/);
    
    return orders.filter(order => {
      if (!order.user || !order.user.name) {
        return false;
      }
      
      const orderId = order._id.toLowerCase();
      const userName = order.user.name.toLowerCase();
      const userEmail = (order.user.email || '').toLowerCase();
      
      return searchTerms.some(term => 
        orderId.includes(term) ||
        userName.includes(term) ||
        userEmail.includes(term)
      );
    });
  }, [search, orders]);

  // Effetto per aggiornare gli ordini filtrati quando cambia la ricerca o gli ordini
  useEffect(() => {
    setFilteredOrders(filterOrders);
  }, [filterOrders]);

  // Determina gli ordini da visualizzare (filtrati e limitati se necessario)
  const displayedOrders = showAllOrders ? filteredOrders : filteredOrders.slice(0, 3);

  // Funzione per aggiornare lo stato di un ordine
  const handleOrderStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => order._id === orderId ? { ...order, status: newStatus } : order)
    );
  };

  // Rendering del componente Dashboard
  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      {/* Sidebar component */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Topbar component con funzionalità di ricerca */}
        <Topbar 
          search={search} 
          handleSearch={handleSearch} 
          onMenuButtonClick={() => setSidebarOpen(!sidebarOpen)} 
        />

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
                {displayedOrders.length > 0 ? (
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                ) : (
                  <p className="text-gray-300">Nessun ordine trovato.</p>
                )}

                {/* Pulsante "Mostra più/meno" */}
                {filteredOrders.length > 3 && (
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
              <CustomersTable search={search} />

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