import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { customersApi } from "../../../../api/customersApi";

export default function UserRegistrationChart() {
    const [chartData, setChartData] = useState([]);
    // Gestione del caricamento e dell'errore per i dati
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

    if (loading) return <p>Caricamento dati...</p>;
    if (error) return <p>Errore: {error}</p>;

    const totalUsers = chartData.reduce((sum, data) => sum + data.registeredUsers, 0);
    const latestMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    const growthRate = previousMonth
        ? ((latestMonth.registeredUsers - previousMonth.registeredUsers) / previousMonth.registeredUsers) * 100
        : 0;

    return (
        <div className="bg-[#131313] p-4 rounded-lg shadow mt-6 border border-white border-opacity-[10%] text-[#dadada]">
            <h2 className="text-xl font-bold mb-2">Registrazioni Utenti</h2>
            <p className="text-sm text-gray-500 mb-4">
                Mostra il numero di utenti registrati negli ultimi 6 mesi
            </p>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                    type="natural"
                    dataKey="registeredUsers"
                    stroke="#af57db"
                    fill="#5f1a34"
                    fillOpacity={.5}
                    />
                </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-sm">
                <div className="flex items-center gap-2 font-medium">
                {growthRate >= 0 ? "Crescita" : "Calo"} del {Math.abs(growthRate).toFixed(1)}% questo mese
                {growthRate >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
                <div className="text-gray-600">
                Totale utenti registrati: {totalUsers}
                </div>
            </div>
        </div>
    )
}