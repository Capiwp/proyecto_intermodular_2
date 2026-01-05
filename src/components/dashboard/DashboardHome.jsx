import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
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
  PiggyBank
} from 'lucide-react';
import TopBar from './TopBar';
import TransactionsView from './TransactionsView';
import BudgetsView from './BudgetsView';
import WalletsView from './WalletsView';
import InvestmentsView from './InvestmentsView';
import GoalsView from './GoalsView';
import ReportsView from './ReportsView';
import AccountsView from './AccountsView';
import ProfileView from './ProfileView';
import SettingsView from './SettingsView';

// Datos de ejemplo para las tarjetas
const mockDashboardData = {
  currentBalance: 5245.75,
  totalIncome: 7500.00,
  monthlyExpenses: 2254.25,
  savingsGoal: 10000.00,
};

const mockTransactions = [
  { id: 1, name: 'Compra en el supermercado', amount: -45.90, color: 'text-red-500' },
  { id: 2, name: 'Salario (Ingreso)', amount: 2500.00, color: 'text-blue-500' },
  { id: 3, name: 'Suscripción de streaming', amount: -15.99, color: 'text-red-500' },
  { id: 4, name: 'Transferencia recibida', amount: 150.00, color: 'text-emerald-500' },
  { id: 5, name: 'Pago de alquiler', amount: -800.00, color: 'text-red-500' },
];

const mockNotifications = [
  { id: 1, title: 'Nuevo inicio de sesión', time: 'Hace 5 min', unread: true },
  { id: 2, title: 'Meta de ahorro alcanzada', time: 'Hace 2 horas', unread: false },
  { id: 3, title: 'Presupuesto excedido', time: 'Hace 1 día', unread: false },
];

// Configuración de los ítems del menú de navegación
const navigationItems = [
  { name: 'Inicio', path: '/dashboard', icon: Home, current: true, description: 'Resumen y saldo general' },
  { name: 'Transacciones', path: '/transactions', icon: DollarSign, current: false, description: 'Ver y registrar movimientos' },
  { name: 'Presupuestos', path: '/budgets', icon: TrendingUp, current: false, description: 'Control de gastos mensuales' },
  { name: 'Carteras', path: '/wallets', icon: Wallet, current: false, description: 'Gestión de carteras y saldos' },
  { name: 'Inversiones', path: '/investments', icon: PiggyBank, current: false, description: 'Seguimiento de inversiones' },
  { name: 'Metas', path: '/goals', icon: Target, current: false, description: 'Objetivos de ahorro' },
  { name: 'Reportes', path: '/reports', icon: BarChart3, current: false, description: 'Análisis y reportes' },
  { name: 'Cuentas', path: '/accounts', icon: CreditCard, current: false, description: 'Gestión de tarjetas y bancos' },
  { name: 'Perfil', path: '/profile', icon: User, current: false, description: 'Configuración personal y datos' },
  { name: 'Configuración', path: '/settings', icon: Settings, current: false, description: 'Seguridad y preferencias' },
];

// Componente para las tarjetas de resumen
const StatCard = ({ title, value, icon: Icon, colorClass, currency = '€' }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {/* Usamos Icon como componente JSX */}
      <Icon className={`w-5 h-5 ${colorClass}`} />
    </div>
    <p className="mt-1 text-3xl font-bold text-gray-900">
      {currency} {value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </p>
  </div>
);

// Componente principal del Dashboard
const DashboardHome = () => {
  const { logout, user, tryAutoLogin } = useAuthStore();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Inicio'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Intentar recuperar sesión al recargar
  React.useEffect(() => {
    if (!user) {
      tryAutoLogin();
    }
  }, []);

  const handleNavigation = (path, name) => {
    if (path === '/register' || path === '/') {
      console.log(`Redirigiendo a: ${path}`);
      window.location.href = path;
      return;
    }

    const pageMap = {
      '/dashboard': 'Inicio',
      '/transactions': 'Transacciones',
      '/budgets': 'Presupuestos',
      '/wallets': 'Carteras',
      '/investments': 'Inversiones',
      '/goals': 'Metas',
      '/reports': 'Reportes',
      '/accounts': 'Cuentas',
      '/profile': 'Perfil',
      '/settings': 'Configuración'
    };

    const pageName = pageMap[path] || name;
    setCurrentPage(pageName);
    setIsSidebarOpen(false); 
  };

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

  const filteredTransactions = mockTransactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-emerald-50 to-gray-100 font-inter">

      {/* 1. Barra Superior (TopBar) */}
      <div className="fixed top-0 left-0 right-0 z-50 hidden lg:block">
         <TopBar 
           onSearch={(q) => setSearchQuery(q)} 
           onSettingsClick={() => handleNavigation('/settings', 'Configuración')}
           onProfileClick={() => handleNavigation('/profile', 'Perfil')}
           onNotificationsClick={() => setShowNotifications(!showNotifications)}
         />
         
         {/* Dropdown de Notificaciones */}
         {showNotifications && (
           <div className="absolute top-16 right-20 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
             <div className="p-4 border-b border-gray-50 flex justify-between items-center">
               <h3 className="font-bold text-gray-800">Notificaciones</h3>
               <span className="text-xs text-emerald-600 font-medium cursor-pointer hover:underline">Marcar leídas</span>
             </div>
             <div className="max-h-96 overflow-y-auto">
               {mockNotifications.map(notif => (
                 <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${notif.unread ? 'bg-emerald-50/50' : ''}`}>
                   <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                   <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                 </div>
               ))}
             </div>
             <div className="p-3 bg-gray-50 text-center">
               <button className="text-xs font-semibold text-gray-500 hover:text-emerald-600">Ver todas</button>
             </div>
           </div>
         )}
      </div>

      {/* ... structure ... */}
      
      <div className="flex flex-1 overflow-hidden h-screen pt-0">
        
        {/* Sidebar ... */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 w-64 bg-emerald-700 shadow-xl flex flex-col shrink-0 pt-20 lg:pt-20`}
        >
          {/* ... sidebar content ... */}
          {/* (Please ensure you do not overwrite the sidebar content if not intending to change it, 
              but since I'm replacing the whole component logic block I need to be careful. 
              Ideally I'd use multiple chunks but the state changes are pervasive. 
              I'll just replace the relevant blocks carefully.) 
           */}
           {/* ... Reusing existing sidebar code strictly ... */}
           <div className="px-4 pt-6 pb-4">
            <button
              onClick={() => console.log('Nueva transacción')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Transacción</span>
            </button>
          </div>
          <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href="#"
                onClick={() => handleNavigation(item.path, item.name)}
                className={`flex items-center p-3 rounded-lg group transition duration-150 ease-in-out ${
                  currentPage === item.name
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-100 hover:bg-emerald-600/70 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-semibold text-sm">{item.name}</span>
              </a>
            ))}
             <a
                href="#"
                onClick={() => handleNavigation('/register', 'Registrarse')}
                className="flex items-center p-3 rounded-lg group transition duration-150 ease-in-out text-emerald-100 hover:bg-emerald-600/70 hover:text-white mt-4 border-t border-emerald-600/50 pt-4"
              >
                <User className="w-5 h-5 mr-3" />
                <span className="font-semibold text-sm">Registrarse (Demo)</span>
            </a>
          </nav>
          <div className="p-4 border-t border-emerald-600">
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-emerald-100 hover:bg-emerald-600 hover:text-white transition duration-150 ease-in-out"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-semibold text-sm">Cerrar Sesión</span>
            </button>
            <div className="mt-2 text-xs text-emerald-300 text-center">
              FinanceFlow v1.0
            </div>
          </div>
        </div>

        {/* Contenido Principal (Derecha) */}
        <div className="flex-1 flex flex-col overflow-y-auto h-full scroll-smooth">
          
          <header className="flex items-center justify-between lg:hidden h-16 bg-white/10 backdrop-blur-md border-b border-white/20 p-4 shrink-0 sticky top-0 z-40">
            <div className="flex items-center">
              <img src="finance-flow-logo-gradient.svg" alt="" className="w-10 h-10 mr-2"/>
              <span className="text-lg font-bold text-gray-900">FinanceFlow</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </header>

          <main className="flex-1 p-4 md:p-8 pt-20 lg:pt-24">
            {currentPage === 'Inicio' && (
              <>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
                  Resumen Financiero
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard title="Saldo Actual" value={mockDashboardData.currentBalance} icon={Wallet} colorClass="text-emerald-500" currency="€" />
                  <StatCard title="Ingresos Totales" value={mockDashboardData.totalIncome} icon={DollarSign} colorClass="text-blue-500" currency="€" />
                  <StatCard title="Gastos del Mes" value={mockDashboardData.monthlyExpenses} icon={TrendingUp} colorClass="text-red-500" currency="€" />
                  <StatCard title="Meta de Ahorro" value={mockDashboardData.savingsGoal} icon={Settings} colorClass="text-yellow-500" currency="€" />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg h-96 flex items-center justify-center">
                  <p className="text-gray-400 text-lg">
                    [Gráfico de Flujo de Efectivo Mensual - Placeholder]
                  </p>
                </div>

                <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Transacciones Recientes
                  </h2>
                  <div className="space-y-4">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map(t => (
                        <div key={t.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0">
                          <span className="font-medium">{t.name}</span>
                          <span className={`${t.color} font-semibold`}>
                             {t.amount > 0 ? '+' : ''}€{Math.abs(t.amount).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No se encontraron transacciones.</p>
                    )}
                  </div>
                </div>
              </>
            )}
            {currentPage === 'Transacciones' && <TransactionsView />}
            {currentPage === 'Presupuestos' && <BudgetsView />}
            {currentPage === 'Carteras' && <WalletsView />}
            {currentPage === 'Inversiones' && <InvestmentsView />}
            {currentPage === 'Metas' && <GoalsView />}
            {currentPage === 'Reportes' && <ReportsView />}
            {currentPage === 'Cuentas' && <AccountsView />}
            {currentPage === 'Perfil' && <ProfileView />}
            {currentPage === 'Configuración' && <SettingsView />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;