import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useReportStore } from "../../store/reportStore";
import { useTransactionStore } from "../../store/transactionStore";
import {
  Home,
  DollarSign,
  TrendingUp,
  CreditCard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Wallet,
  Plus,
  Target,
  BarChart3,
  PiggyBank,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TopBar from "./TopBar";
import TransactionsView from "./TransactionsView";
import BudgetsView from "./BudgetsView";
import WalletsView from "./WalletsView";
import InvestmentsView from "./InvestmentsView";
import GoalsView from "./GoalsView";
import ReportsView from "./ReportsView";
import AccountsView from "./AccountsView";
import ProfileView from "./ProfileView";
import SettingsView from "./SettingsView";

const navigationItems = [
  {
    name: "Inicio",
    path: "/dashboard",
    icon: Home,
    current: true,
    description: "Resumen y saldo general",
  },
  {
    name: "Transacciones",
    path: "/transactions",
    icon: DollarSign,
    current: false,
    description: "Ver y registrar movimientos",
  },
  {
    name: "Presupuestos",
    path: "/budgets",
    icon: TrendingUp,
    current: false,
    description: "Control de gastos mensuales",
  },
  {
    name: "Carteras",
    path: "/wallets",
    icon: Wallet,
    current: false,
    description: "Gestión de carteras y saldos",
  },
  {
    name: "Inversiones",
    path: "/investments",
    icon: PiggyBank,
    current: false,
    description: "Seguimiento de inversiones",
  },
  {
    name: "Metas",
    path: "/goals",
    icon: Target,
    current: false,
    description: "Objetivos de ahorro",
  },
  {
    name: "Reportes",
    path: "/reports",
    icon: BarChart3,
    current: false,
    description: "Análisis y reportes",
  },
  {
    name: "Cuentas",
    path: "/accounts",
    icon: CreditCard,
    current: false,
    description: "Gestión de tarjetas y bancos",
  },
  {
    name: "Perfil",
    path: "/profile",
    icon: User,
    current: false,
    description: "Configuración personal y datos",
  },
  {
    name: "Configuración",
    path: "/settings",
    icon: Settings,
    current: false,
    description: "Seguridad y preferencias",
  },
];

const StatCard = ({ title, value, icon: Icon, colorClass, currency = "€" }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div
        className={`p-2 rounded-lg ${colorClass
          .replace("text-", "bg-")
          .replace("500", "100")}`}
      >
        <Icon className={`w-5 h-5 ${colorClass}`} />
      </div>
    </div>
    <p className="mt-4 text-3xl font-bold text-gray-900 tracking-tight">
      {currency}{" "}
      {value !== undefined && value !== null
        ? value.toLocaleString("es-ES", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "0,00"}
    </p>
  </div>
);

const DashboardHome = () => {
  const { logout, user, tryAutoLogin } = useAuthStore();
  const { dashboardStats, fetchDashboardStats, yearlyTrend, fetchYearlyTrend } =
    useReportStore();
  const { transactions, fetchTransactions } = useTransactionStore();

  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("Inicio");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    if (!user) {
      tryAutoLogin();
    }
  }, []);

  React.useEffect(() => {
    if (user && currentPage === "Inicio") {
      fetchDashboardStats();
      fetchTransactions({ limit: 5 });
      fetchYearlyTrend();
    }
  }, [user, currentPage]);

  const handleNavigation = (path, name) => {
    if (path === "/register" || path === "/") {
      window.location.href = path;
      return;
    }
    const pageMap = {
      "/dashboard": "Inicio",
      "/transactions": "Transacciones",
      "/budgets": "Presupuestos",
      "/wallets": "Carteras",
      "/investments": "Inversiones",
      "/goals": "Metas",
      "/reports": "Reportes",
      "/accounts": "Cuentas",
      "/profile": "Perfil",
      "/settings": "Configuración",
    };
    setCurrentPage(pageMap[path] || name);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Prepare chart data
  const chartData = yearlyTrend
    ? yearlyTrend
        .map((item) => ({
          name: new Date(item.year).getFullYear().toString(),
          ingresos: Number(item.total_income),
          gastos: Number(item.total_expense),
        }))
        .sort((a, b) => a.name - b.name)
    : [];

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-inter text-gray-900">
      {/* 1. Barra Superior */}
      <div className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
        <TopBar
          onSearch={(q) => setSearchQuery(q)}
          onSettingsClick={() => handleNavigation("/settings", "Configuración")}
          onProfileClick={() => handleNavigation("/profile", "Perfil")}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
        />
        {showNotifications && (
          <div className="absolute top-16 right-20 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">Notificaciones</h3>
              <span className="text-xs text-emerald-600 font-medium cursor-pointer hover:underline">
                Marcar leídas
              </span>
            </div>
            <div className="p-8 text-center text-gray-400 text-sm">
              No tienes notificaciones nuevas
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden h-screen pt-0">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-emerald-900 shadow-xl flex flex-col shrink-0 pt-20 lg:pt-20 border-r border-emerald-800`}
        >
          <div className="px-4 pt-6 pb-6">
            <button
              onClick={() => handleNavigation("/transactions", "Transacciones")}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:scale-[1.02]"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Transacción</span>
            </button>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path, item.name)}
                className={`w-full flex items-center p-3 rounded-lg group transition-all duration-200 ${
                  currentPage === item.name
                    ? "bg-emerald-800/50 text-emerald-300 shadow-inner ring-1 ring-emerald-700"
                    : "text-emerald-100/70 hover:bg-emerald-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${
                    currentPage === item.name
                      ? "text-emerald-400"
                      : "text-emerald-500/70 group-hover:text-emerald-400"
                  }`}
                />
                <span className="font-medium text-sm">{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-emerald-800 bg-emerald-950/30">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-emerald-300/70 hover:bg-emerald-900 hover:text-white transition duration-150 ease-in-out"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col overflow-y-auto h-full scroll-smooth bg-gray-50/50">
          <header className="flex items-center justify-between lg:hidden h-16 bg-white border-b border-gray-200 p-4 shrink-0 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center">
              <img
                src="/finance-flow-logo-gradient.svg"
                alt=""
                className="w-8 h-8 mr-2"
              />
              <span className="text-lg font-bold text-gray-900">
                FinanceFlow
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none p-2 rounded-md hover:bg-gray-100"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </header>

          <main className="flex-1 p-4 md:p-8 pt-6 lg:pt-24 max-w-7xl mx-auto w-full">
            {currentPage === "Inicio" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                      Resumen Financiero
                    </h1>
                    <p className="text-gray-500 mt-1">
                      Bienvenido de nuevo, {user?.name}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 hidden md:block">
                    Última actualización: {new Date().toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard
                    title="Balance Total"
                    value={dashboardStats?.total_balance}
                    icon={Wallet}
                    colorClass="text-emerald-500"
                  />
                  <StatCard
                    title="Ingresos (Mes)"
                    value={dashboardStats?.current_month?.income}
                    icon={DollarSign}
                    colorClass="text-blue-500"
                  />
                  <StatCard
                    title="Gastos (Mes)"
                    value={dashboardStats?.current_month?.expense}
                    icon={TrendingUp}
                    colorClass="text-red-500"
                  />
                  <StatCard
                    title="Flujo Neto"
                    value={dashboardStats?.current_month?.balance}
                    icon={BarChart3}
                    colorClass={
                      dashboardStats?.current_month?.balance >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  />
                </div>

                {/* GRAPH SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px]">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">
                      Tendencia Anual
                    </h2>
                    <ResponsiveContainer width="100%" height="90%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient
                            id="colorIngresos"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#10B981"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="95%"
                              stopColor="#10B981"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorGastos"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#EF4444"
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="95%"
                              stopColor="#EF4444"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          stroke="#E5E7EB"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF" }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#9CA3AF" }}
                          tickFormatter={(val) => `€${val}`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "12px",
                            border: "none",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                          formatter={(value) => [`€${value}`, ""]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="ingresos"
                          stroke="#10B981"
                          fillOpacity={1}
                          fill="url(#colorIngresos)"
                          strokeWidth={3}
                          name="Ingresos"
                        />
                        <Area
                          type="monotone"
                          dataKey="gastos"
                          stroke="#EF4444"
                          fillOpacity={1}
                          fill="url(#colorGastos)"
                          strokeWidth={3}
                          name="Gastos"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Placeholder Pie Chart (needs category data) */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] w-full flex flex-col items-center justify-center text-center">
                    <h2 className="text-lg font-bold text-gray-800 mb-2 w-full text-left">
                      Gastos por Categoría
                    </h2>
                    <div className="flex-1 w-full flex items-center justify-center min-h-[200px]">
                      <div className="relative w-48 h-48 rounded-full border-8 border-gray-50 flex items-center justify-center">
                        <p className="text-xs text-gray-400">
                          Datos insuficientes
                          <br />
                          para gráfico
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Transactions */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">
                        Transacciones Recientes
                      </h2>
                      <button
                        onClick={() =>
                          handleNavigation("/transactions", "Transacciones")
                        }
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Ver todas
                      </button>
                    </div>
                    <div className="space-y-4">
                      {transactions && transactions.length > 0 ? (
                        transactions.slice(0, 5).map((t) => (
                          <div
                            key={t.id}
                            className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100/50"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-full ${
                                  t.type === "income"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                              >
                                {t.type === "income" ? (
                                  <DollarSign className="w-5 h-5" />
                                ) : (
                                  <TrendingUp className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {t.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(t.date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`font-bold ${
                                t.type === "income"
                                  ? "text-emerald-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {t.type === "expense" ? "-" : "+"}€
                              {Number(t.amount).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <DollarSign className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-500">
                            No hay movimientos recientes.
                          </p>
                          <button
                            onClick={() =>
                              handleNavigation("/transactions", "Transacciones")
                            }
                            className="mt-2 text-emerald-600 font-medium text-sm"
                          >
                            Registrar mi primer gasto
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Insights / Goals Preview */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-lg text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6" />
                      Metas de Ahorro
                    </h2>
                    {dashboardStats?.savings_goals?.active > 0 ? (
                      <div>
                        <div className="mb-6">
                          <p className="text-emerald-100 text-sm">
                            Metas Activas
                          </p>
                          <p className="text-4xl font-bold">
                            {dashboardStats.savings_goals.active}
                          </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                          <p className="text-sm font-medium mb-1">
                            Falta por ahorrar
                          </p>
                          <p className="text-2xl font-bold">
                            €
                            {dashboardStats.savings_goals.remaining_amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-emerald-100 mb-4">
                          No tienes metas de ahorro activas.
                        </p>
                        <button
                          onClick={() => handleNavigation("/goals", "Metas")}
                          className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-emerald-50"
                        >
                          Crear Meta
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Render other views */}
            {currentPage === "Transacciones" && <TransactionsView />}
            {currentPage === "Presupuestos" && <BudgetsView />}
            {currentPage === "Carteras" && <WalletsView />}
            {currentPage === "Inversiones" && <InvestmentsView />}
            {currentPage === "Metas" && <GoalsView />}
            {currentPage === "Reportes" && <ReportsView />}
            {currentPage === "Cuentas" && <AccountsView />}
            {currentPage === "Perfil" && <ProfileView />}
            {currentPage === "Configuración" && <SettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
