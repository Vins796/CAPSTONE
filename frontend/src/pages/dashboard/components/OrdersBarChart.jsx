"use client"
// Importiamo i hook necessari da React
import { useState, useEffect } from "react"
// Importiamo le icone per il trend
import { TrendingUp, TrendingDown } from "lucide-react"
// Importiamo i componenti necessari da recharts
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
// Importiamo la funzione per ottenere i dati degli ordini
import { getOrders } from "../../../../api/ordersApi"

export default function OrdersAreaChart() {
  // Stato per i dati del grafico
  const [chartData, setChartData] = useState([])
  // Stato per indicare se i dati stanno caricando
  const [loading, setLoading] = useState(true)
  // Stato per gestire eventuali errori
  const [error, setError] = useState(null)

  // useEffect per caricare i dati quando il componente viene montato
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        // Otteniamo i dati degli ordini
        const orders = await getOrders()
        // Processiamo i dati per il grafico
        const processedData = processOrderData(orders)
        // Aggiorniamo lo stato con i dati processati
        setChartData(processedData)
      } catch (err) {
        // In caso di errore, lo salviamo nello stato
        setError("Errore nel caricamento dei dati degli ordini")
        console.error(err)
      } finally {
        // Indipendentemente dal risultato, settiamo loading a false
        setLoading(false)
      }
    }

    fetchOrderData()
  }, []) // L'array vuoto significa che questo effetto viene eseguito solo al montaggio del componente

  // Funzione per processare i dati degli ordini
  const processOrderData = (orders) => {
    const monthsData = {}
    const now = new Date()
    // Calcoliamo la data di due mesi fa
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      // Consideriamo solo gli ordini degli ultimi due mesi
      if (orderDate >= twoMonthsAgo) {
        const monthYear = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`
        if (!monthsData[monthYear]) {
          monthsData[monthYear] = 0
        }
        monthsData[monthYear]++
      }
    })

    // Convertiamo l'oggetto in un array e lo ordiniamo per data
    return Object.entries(monthsData)
      .map(([month, count]) => ({ month, orders: count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  // Rendering condizionale per stati di caricamento ed errore
  if (loading) return <div className="p-4 bg-[#131313] rounded-lg shadow text-[#dadada]">Caricamento dati...</div>
  if (error) return <div className="p-4 bg-[#131313] rounded-lg shadow text-red-500">Errore: {error}</div>

  // Calcoliamo alcune statistiche dai dati
  const totalOrders = chartData.reduce((sum, data) => sum + data.orders, 0)
  const currentMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const growthRate = previousMonth
    ? ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100
    : 0

  // Rendering principale del componente
  return (
    <div className="bg-[#131313] p-4 rounded-lg shadow mt-6 border border-white border-opacity-[10%] text-[#dadada]">
      {/* Intestazione del grafico */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Ordini degli Ultimi Due Mesi</h2>
        <p className="text-sm text-gray-500">{previousMonth?.month} - {currentMonth?.month}</p>
      </div>
      {/* Container del grafico */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            {/* Griglia del grafico */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#2a2a2a" />
            {/* Asse X */}
            <XAxis 
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="#dadada"
            />
            {/* Asse Y (nascosto) */}
            <YAxis hide />
            {/* Tooltip per mostrare i dati al passaggio del mouse */}
            <Tooltip 
              contentStyle={{
                backgroundColor: "#1f1f1f",
                border: "1px solid #2a2a2a",
                borderRadius: "0.375rem",
                color: "#dadada"
              }}
            />
            {/* Definizione del gradiente per l'area */}
            <defs>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            {/* Area del grafico */}
            <Area 
              type="natural"
              dataKey="orders" 
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorOrders)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Sezione delle statistiche */}
      <div className="text-sm">
        <div className="flex items-center gap-2 font-medium mb-1">
          {growthRate >= 0 ? (
            <>Crescita del {growthRate.toFixed(1)}% rispetto al mese precedente <TrendingUp className="h-4 w-4 text-green-500" /></>
          ) : (
            <>Calo del {Math.abs(growthRate).toFixed(1)}% rispetto al mese precedente <TrendingDown className="h-4 w-4 text-red-500" /></>
          )}
        </div>
        <div className="text-gray-500">
          Totale ordini negli ultimi due mesi: {totalOrders}
        </div>
      </div>
    </div>
  )
}