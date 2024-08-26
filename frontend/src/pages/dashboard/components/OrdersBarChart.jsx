"use client"
import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { getOrders } from "../../../../api/ordersApi"


export default function OrdersBarChart() {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        const orders = await getOrders()
        const processedData = processOrderData(orders)
        setChartData(processedData)
      } catch (err) {
        setError("Errore nel caricamento dei dati degli ordini")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [])

  const processOrderData = (orders) => {
    const monthsData = {}
    const now = new Date()
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt)
      if (orderDate >= twoMonthsAgo) {
        const monthYear = `${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`
        if (!monthsData[monthYear]) {
          monthsData[monthYear] = 0
        }
        monthsData[monthYear]++
      }
    })

    return Object.entries(monthsData)
      .map(([month, count]) => ({ month, orders: count }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
  }

  if (loading) return <div className="p-4 bg-white rounded-lg shadow">Caricamento dati...</div>
  if (error) return <div className="p-4 bg-white rounded-lg shadow text-red-500">Errore: {error}</div>

  const totalOrders = chartData.reduce((sum, data) => sum + data.orders, 0)
  const currentMonth = chartData[chartData.length - 1]
  const previousMonth = chartData[chartData.length - 2]
  const growthRate = previousMonth
    ? ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100
    : 0

  return (
    <div className="bg-[#131313] p-4 rounded-lg shadow mt-6 border border-white border-opacity-[10%] text-[#dadada]">
      <div className="mb-4">
        <h2 className="text-xl font-bold">Ordini degli Ultimi Due Mesi</h2>
        <p className="text-sm text-gray-500">{previousMonth?.month} - {currentMonth?.month}</p>
      </div>
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#3b82f6" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </div>
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