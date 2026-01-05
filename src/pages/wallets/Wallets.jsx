import { useState, useEffect } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown, Trash2, Edit2 } from 'lucide-react';
import api from '../../api/api';

export default function Wallets() {
  const [wallets, setWallets] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    balance: '',
    currency: 'USD',
    color: '#3B82F6',
    icon: '🏦',
  });

  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/wallets');
      setWallets(response.data);
    } catch (error) {
      console.error('Error cargando carteras:', error);
      alert('Error al cargar carteras');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.balance) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const walletData = {
        name: formData.name,
        type: formData.type,
        balance: parseFloat(formData.balance),
        currency: formData.currency,
        color: formData.color,
        icon: formData.icon,
      };

      if (editingWallet) {
        await api.put(`/wallets/${editingWallet.id}`, walletData);
        alert('Cartera actualizada exitosamente');
      } else {
        await api.post('/wallets', walletData);
        alert('Cartera creada exitosamente');
      }

      loadWallets();
      closeDialog();
    } catch (error) {
      console.error('Error guardando cartera:', error);
      alert(error.response?.data?.message || 'Error al guardar la cartera');
    }
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setFormData({
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance.toString(),
      currency: wallet.currency,
      color: wallet.color,
      icon: wallet.icon,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta cartera?')) return;

    try {
      await api.delete(`/wallets/${id}`);
      alert('Cartera eliminada exitosamente');
      loadWallets();
    } catch (error) {
      console.error('Error eliminando cartera:', error);
      alert('Error al eliminar la cartera');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingWallet(null);
    setFormData({
      name: '',
      type: 'bank',
      balance: '',
      currency: 'USD',
      color: '#3B82F6',
      icon: '🏦',
    });
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const positiveBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance > 0 ? wallet.balance : 0), 0);
  const negativeBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance < 0 ? wallet.balance : 0), 0);

  const walletIcons = {
    bank: '🏦',
    savings: '💰',
    credit: '💳',
    cash: '💵',
    investment: '📈',
    other: '👛',
  };

  const walletColors = {
    bank: '#3B82F6',
    savings: '#10B981',
    credit: '#EF4444',
    cash: '#F59E0B',
    investment: '#8B5CF6',
    other: '#6B7280',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Carteras y Cuentas</h1>
          <p className="text-gray-600">Gestiona todas tus cuentas y carteras</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nueva Cartera
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Balance Total</p>
              <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`w-12 h-12 ${totalBalance >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              <Wallet className={`w-6 h-6 ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-600">${positiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Deudas</p>
              <p className="text-2xl font-bold text-red-600">${Math.abs(negativeBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallets List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">Mis Carteras</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando carteras...</p>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💳</div>
            <p className="text-gray-600 mb-4">No tienes carteras aún</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Agregar Primera Cartera
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer relative overflow-hidden"
                style={{ borderLeft: `4px solid ${wallet.color}` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${wallet.color}20` }}
                    >
                      {wallet.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold mb-1">{wallet.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                        {wallet.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Balance</p>
                  <p className={`text-2xl font-bold ${wallet.balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                    ${Math.abs(wallet.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-500">{wallet.currency}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(wallet)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(wallet.id)}
                    className="px-3 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">
              {editingWallet ? 'Editar Cartera' : 'Nueva Cartera'}
            </h2>
            <p className="text-gray-600 mb-6">
              {editingWallet
                ? 'Actualiza los detalles de tu cartera'
                : 'Agrega una nueva cartera o cuenta'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Cuenta Principal, Ahorros"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({
                      ...formData,
                      type: value,
                      icon: walletIcons[value] || '💳',
                      color: walletColors[value] || '#3B82F6'
                    });
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="bank">🏦 Cuenta Bancaria</option>
                  <option value="savings">💰 Ahorros</option>
                  <option value="credit">💳 Tarjeta de Crédito</option>
                  <option value="cash">💵 Efectivo</option>
                  <option value="investment">📈 Inversión</option>
                  <option value="other">👛 Otro</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Balance Inicial *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Moneda *</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - Libra</option>
                    <option value="MXN">MXN - Peso</option>
                    <option value="ARS">ARS - Peso Argentino</option>
                    <option value="COP">COP - Peso Colombiano</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icono</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🏦"
                    maxLength={2}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full h-10 px-1 py-1 border rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingWallet ? 'Actualizar' : 'Crear'} Cartera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
