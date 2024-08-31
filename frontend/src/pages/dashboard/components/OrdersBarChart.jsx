import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { getOrders } from "../../../../api/ordersApi";

export default function TotalOrdersChart() {
  // Stato per i dati del grafico
  const [chartData, setChartData] = useState([]);
  // Stato per indicare se i dati stanno caricando
  const [loading, setLoading] = useState(true);
  // Stato per gestire eventuali errori
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        // Otteniamo tutti gli ordini
        const orders = await getOrders();
        // Processiamo i dati per il grafico
        const processedData = processOrderData(orders);
        setChartData(processedData);
      } catch (err) {
        setError("Errore nel caricamento dei dati degli ordini");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  // Funzione per processare i dati degli ordini
  const processOrderData = (orders) => {
    const monthsData = {};

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthYear = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
      if (!monthsData[monthYear]) {
        monthsData[monthYear] = 0;
      }
      monthsData[monthYear]++;
    });

    // Convertiamo l'oggetto in un array e lo ordiniamo per data
    return Object.entries(monthsData)
      .map(([month, count]) => ({ month, orders: count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  // Calcolo del trend generale
  const calculateTrend = () => {
    if (chartData.length < 2) return 0;
    const firstMonth = chartData[0].orders;
    const lastMonth = chartData[chartData.length - 1].orders;
    return ((lastMonth - firstMonth) / firstMonth) * 100;
  };

  if (loading) return <div className="p-4 bg-[#131313] rounded-lg shadow text-[#dadada]">Caricamento dati...</div>;
  if (error) return <div className="p-4 bg-[#131313] rounded-lg shadow text-red-500">Errore: {error}</div>;

  const totalOrders = chartData.reduce((sum, data) => sum + data.orders, 0);
  const trendPercentage = calculateTrend();

  return (
    <div className="bg-[#131313] p-4 rounded-lg shadow mt-6 border border-white border-opacity-[10%] text-[#dadada]">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Totale Ordini nel Tempo</h2>
        <p className="text-sm text-gray-500">
          {chartData[0]?.month} - {chartData[chartData.length - 1]?.month}
        </p>
      </div>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="#dadada"
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: "#1f1f1f",
                border: "1px solid #2a2a2a",
                borderRadius: "0.375rem",
                color: "#dadada"
              }}
            />
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone"
              dataKey="orders" 
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOrders)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm">
        <div className="flex items-center gap-2 font-medium mb-1">
          {trendPercentage >= 0 ? (
            <>Crescita del {trendPercentage.toFixed(1)}% dall'inizio <TrendingUp className="h-4 w-4 text-green-500" /></>
          ) : (
            <>Calo del {Math.abs(trendPercentage).toFixed(1)}% dall'inizio <TrendingDown className="h-4 w-4 text-red-500" /></>
          )}
        </div>
        <div className="text-gray-500">
          Totale ordini: {totalOrders}
        </div>
      </div>
    </div>
  );
}