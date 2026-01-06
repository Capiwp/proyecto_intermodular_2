import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart as PieIcon, BarChart3, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import api from '../../api/api';

const TransactionsView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      // Cambiamos el endpoint a /transactions para obtener movimientos reales
      const response = await api.get('/transactions');
      const transactions = Array.isArray(response.data) ? response.data : [];
      
      setData(transactions);
      calculateStats(transactions);
    } catch (error) {
      console.error('Error cargando transacciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactions) => {
    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    setStats({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    });
  };

  // Preparar datos para Gráfico de Pastel (Por Categoría)
  const chartDataPie = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += Number(curr.amount);
    } else {
      acc.push({ name: curr.category || 'Otros', value: Number(curr.amount), color: curr.color || '#94a3b8' });
    }
    return acc;
  }, []);

  if (loading) return <div className="p-8 text-center font-bold animate-pulse">GENERANDO GRÁFICAS...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Análisis de Gastos</h1>
        <p className="text-gray-500 font-medium">Visualización detallada de tus movimientos financieros</p>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-emerald-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600"><TrendingUp /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Ingresos Totales</p>
              <p className="text-2xl font-black text-emerald-600">+{stats.totalIncome}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-red-500">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600"><TrendingDown /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Gastos Totales</p>
              <p className="text-2xl font-black text-red-600">-{stats.totalExpense}€</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border-b-4 border-black">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-100 rounded-2xl text-black"><PieIcon /></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Balance Neto</p>
              <p className="text-2xl font-black text-gray-900">{stats.balance}€</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Distribución (Pie) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon className="text-emerald-500" />
            <h2 className="text-xl font-black uppercase tracking-tight">Distribución por Categoría</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDataPie}
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartDataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Barras (Histórico) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="text-blue-500" />
            <h2 className="text-xl font-black uppercase tracking-tight">Comparativa Mensual</h2>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.slice(-5)}> {/* Muestra las últimas 5 transacciones */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === 'income' ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Lista Reciente Estilizada */}
      <div className="mt-8 bg-white p-8 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Calendar className="text-gray-400" />
          <h2 className="text-xl font-black uppercase">Últimos Movimientos</h2>
        </div>
        <div className="space-y-4">
          {data.slice(0, 5).map((t) => (
            <div key={t.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border-l-8" style={{borderColor: t.color}}>
              <div>
                <p className="font-black text-gray-800 uppercase">{t.name}</p>
                <p className="text-xs text-gray-400 font-bold uppercase">{t.category}</p>
              </div>
              <p className={`text-lg font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                {t.type === 'income' ? '+' : '-'}{t.amount}€
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionsView;