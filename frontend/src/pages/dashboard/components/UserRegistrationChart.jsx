import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { customersApi } from "../../../../api/customersApi";

export default function UserRegistrationChart() {
  // Stati per gestire i dati del grafico, il caricamento e gli errori
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const users = await customersApi.getAllCustomers();
        const data = processUserData(users);
        setChartData(data);
      } catch (err) {
        setError("Errore nel caricamento dei dati");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Funzione per processare i dati degli utenti
  const processUserData = (users) => {
    const monthsData = {};
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthsData[monthYear]) {
        monthsData[monthYear] = 0;
      }
      monthsData[monthYear]++;
    });

    return Object.entries(monthsData)
      .map(([month, count]) => ({ month, registeredUsers: count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Ultimi 6 mesi
  };

  // Gestione dello stato di caricamento
  if (loading) return <div className="p-4 bg-[#131313] rounded-lg shadow text-[#dadada]">Caricamento dati...</div>;
  // Gestione dello stato di errore
  if (error) return <div className="p-4 bg-[#131313] rounded-lg shadow text-red-500">Errore: {error}</div>;

  // Calcolo del totale degli utenti e del tasso di crescita
  const totalUsers = chartData.reduce((sum, data) => sum + data.registeredUsers, 0);
  const latestMonth = chartData[chartData.length - 1];
  const previousMonth = chartData[chartData.length - 2];
  const growthRate = previousMonth
    ? ((latestMonth.registeredUsers - previousMonth.registeredUsers) / previousMonth.registeredUsers) * 100
    : 0;

  return (
    <div className="bg-[#131313] p-4 rounded-lg shadow mt-6 border border-white border-opacity-[10%] text-[#dadada]">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Registrazioni Utenti</h2>
        <p className="text-sm text-gray-500">
          Mostra il numero di utenti registrati negli ultimi 6 mesi
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
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#912084" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#912084" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone"
              dataKey="registeredUsers" 
              stroke="#912084"
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorUsers)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm">
        <div className="flex items-center gap-2 font-medium mb-1">
          {growthRate >= 0 ? (
            <>Crescita del {growthRate.toFixed(1)}% questo mese <TrendingUp className="h-4 w-4 text-green-500" /></>
          ) : (
            <>Calo del {Math.abs(growthRate).toFixed(1)}% questo mese <TrendingDown className="h-4 w-4 text-red-500" /></>
          )}
        </div>
        <div className="text-gray-500">
          Totale utenti registrati: {totalUsers}
        </div>
      </div>
    </div>
  );
}