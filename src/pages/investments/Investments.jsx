import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Trash2, Edit2, DollarSign } from 'lucide-react';
import api from '../../api/api';

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'stock',
    symbol: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/investments');
      setInvestments(response.data);
    } catch (error) {
      console.error('Error cargando inversiones:', error);
      alert('Error al cargar inversiones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.symbol || !formData.quantity || !formData.purchasePrice) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const investmentData = {
        name: formData.name,
        type: formData.type,
        symbol: formData.symbol.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        purchasePrice: parseFloat(formData.purchasePrice),
        currentPrice: formData.currentPrice ? parseFloat(formData.currentPrice) : parseFloat(formData.purchasePrice),
        purchaseDate: formData.purchaseDate,
      };

      if (editingInvestment) {
        await api.put(`/investments/${editingInvestment.id}`, investmentData);
        alert('Inversión actualizada exitosamente');
      } else {
        await api.post('/investments', investmentData);
        alert('Inversión creada exitosamente');
      }

      loadInvestments();
      closeDialog();
    } catch (error) {
      console.error('Error guardando inversión:', error);
      alert(error.response?.data?.message || 'Error al guardar la inversión');
    }
  };

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
    setFormData({
      name: investment.name,
      type: investment.type,
      symbol: investment.symbol,
      quantity: investment.quantity.toString(),
      purchasePrice: investment.purchasePrice.toString(),
      currentPrice: investment.currentPrice.toString(),
      purchaseDate: investment.purchaseDate.split('T')[0],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta inversión?')) return;

    try {
      await api.delete(`/investments/${id}`);
      alert('Inversión eliminada exitosamente');
      loadInvestments();
    } catch (error) {
      console.error('Error eliminando inversión:', error);
      alert('Error al eliminar la inversión');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingInvestment(null);
    setFormData({
      name: '',
      type: 'stock',
      symbol: '',
      quantity: '',
      purchasePrice: '',
      currentPrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
    });
  };

  const calculateReturn = (investment) => {
    const totalCost = investment.quantity * investment.purchasePrice;
    const currentValue = investment.quantity * investment.currentPrice;
    const returnAmount = currentValue - totalCost;
    const returnPercent = ((returnAmount / totalCost) * 100).toFixed(2);
    return { returnAmount, returnPercent };
  };

  const totalInvested = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchasePrice,
    0
  );

  const currentValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );

  const totalReturn = currentValue - totalInvested;
  const totalReturnPercent = totalInvested > 0 ? ((totalReturn / totalInvested) * 100).toFixed(2) : '0.00';

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock':
        return '📈';
      case 'crypto':
        return '₿';
      case 'bond':
        return '📊';
      case 'fund':
        return '💼';
      default:
        return '💰';
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inversiones</h1>
          <p className="text-gray-600">Gestiona tu portafolio de inversiones</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nueva Inversión
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invertido</p>
              <p className="text-2xl font-bold">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Valor Actual</p>
              <p className="text-2xl font-bold">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rendimiento Total</p>
              <p className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${Math.abs(totalReturn).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
              <p className={`text-sm ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalReturn >= 0 ? '+' : '-'}{Math.abs(parseFloat(totalReturnPercent))}%
              </p>
            </div>
            <div className={`w-12 h-12 ${totalReturn >= 0 ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center`}>
              {totalReturn >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Investments List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">Mis Inversiones</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando inversiones...</p>
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-gray-600 mb-4">No tienes inversiones aún</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Agregar Primera Inversión
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => {
              const { returnAmount, returnPercent } = calculateReturn(investment);
              const isPositive = returnAmount >= 0;

              return (
                <div
                  key={investment.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-3xl">{getTypeIcon(investment.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold">{investment.name}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                          {investment.symbol}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{investment.quantity} unidades</span>
                        <span>•</span>
                        <span>Compra: ${investment.purchasePrice.toLocaleString()}</span>
                        <span>•</span>
                        <span>Actual: ${investment.currentPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-base font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}${Math.abs(returnAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? '+' : '-'}{Math.abs(parseFloat(returnPercent))}%
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(investment)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(investment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-2">
              {editingInvestment ? 'Editar Inversión' : 'Nueva Inversión'}
            </h2>
            <p className="text-gray-600 mb-6">
              {editingInvestment
                ? 'Actualiza los detalles de tu inversión'
                : 'Agrega una nueva inversión a tu portafolio'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Apple Inc., Bitcoin"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="stock">📈 Acción</option>
                  <option value="crypto">₿ Criptomoneda</option>
                  <option value="bond">📊 Bono</option>
                  <option value="fund">💼 Fondo</option>
                  <option value="other">💰 Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Símbolo/Ticker *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="ej: AAPL, BTC"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cantidad *</label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="10"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Precio Compra *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    placeholder="150.00"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio Actual</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    placeholder="175.00"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fecha Compra *</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
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
                  {editingInvestment ? 'Actualizar' : 'Crear'} Inversión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
