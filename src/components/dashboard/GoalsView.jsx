import { useState, useEffect } from 'react';
import { Plus, Target, Trash2, Edit2, TrendingUp } from 'lucide-react';
import api from '../../api/api';

export default function GoalsView() {
  const [goals, setGoals] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    icon: '🎯',
    color: '#3B82F6',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/goals');
      // Asegurarse de que siempre sea un array
      setGoals(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando metas:', error);
      // En caso de error, establecer un array vacío
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      const goalData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0,
        deadline: formData.deadline,
        icon: formData.icon,
        color: formData.color,
      };

      if (editingGoal) {
        await api.put(`/goals/${editingGoal.id}`, goalData);
        alert('Meta actualizada exitosamente');
      } else {
        await api.post('/goals', goalData);
        alert('Meta creada exitosamente');
      }

      loadGoals();
      closeDialog();
    } catch (error) {
      console.error('Error guardando meta:', error);
      alert(error.response?.data?.message || 'Error al guardar la meta');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.split('T')[0],
      icon: goal.icon,
      color: goal.color,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta meta?')) return;

    try {
      await api.delete(`/goals/${id}`);
      alert('Meta eliminada exitosamente');
      loadGoals();
    } catch (error) {
      console.error('Error eliminando meta:', error);
      alert('Error al eliminar la meta');
    }
  };

  const handleAddFunds = async (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      await api.put(`/goals/${goalId}`, {
        currentAmount: goal.currentAmount + amount,
      });
      alert(`$${amount} agregados a ${goal.name}`);
      loadGoals();
    } catch (error) {
      console.error('Error agregando fondos:', error);
      alert('Error al agregar fondos');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingGoal(null);
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      icon: '🎯',
      color: '#3B82F6',
    });
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Metas Financieras</h1>
          <p className="text-gray-600">Define y alcanza tus objetivos financieros</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nueva Meta
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Meta Total</p>
              <p className="text-2xl font-bold">${totalTargetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ahorrado</p>
              <p className="text-2xl font-bold text-green-600">${totalCurrentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progreso General</p>
              <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-6">Mis Metas</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 mt-4">Cargando metas...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-gray-600 mb-4">No tienes metas aún</p>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Agregar Primera Meta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysRemaining = calculateDaysRemaining(goal.deadline);
              const isCompleted = progress >= 100;

              return (
                <div
                  key={goal.id}
                  className="p-6 rounded-lg border hover:shadow-md transition-shadow"
                  style={{ borderLeft: `4px solid ${goal.color}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        {goal.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{goal.name}</h3>
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              ✓ Completada
                            </span>
                          )}
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>
                            ${goal.currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} / ${goal.targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                          <span>•</span>
                          <span>
                            {daysRemaining > 0
                              ? `${daysRemaining} días restantes`
                              : daysRemaining === 0
                              ? 'Vence hoy'
                              : `Venció hace ${Math.abs(daysRemaining)} días`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progreso</span>
                      <span style={{ color: goal.color }} className="font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${progress}%`, backgroundColor: goal.color }}
                      ></div>
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddFunds(goal.id, 100)}
                        className="flex-1 px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      >
                        + $100
                      </button>
                      <button
                        onClick={() => handleAddFunds(goal.id, 500)}
                        className="flex-1 px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      >
                        + $500
                      </button>
                      <button
                        onClick={() => {
                          const amount = prompt('¿Cuánto quieres agregar?');
                          if (amount && !isNaN(parseFloat(amount))) {
                            handleAddFunds(goal.id, parseFloat(amount));
                          }
                        }}
                        className="flex-1 px-3 py-2 text-sm border rounded hover:bg-gray-50"
                      >
                        + Personalizado
                      </button>
                    </div>
                  )}
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
              {editingGoal ? 'Editar Meta' : 'Nueva Meta'}
            </h2>
            <p className="text-gray-600 mb-6">
              {editingGoal
                ? 'Actualiza los detalles de tu meta financiera'
                : 'Define una nueva meta financiera'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Meta *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Casa Nueva, Vacaciones"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Meta ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                    placeholder="50000"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ahorrado ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="5000"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha Límite *</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icono</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="🎯"
                    maxLength={2}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sugeridos: 🏠 ✈️ 🚗 💍 🎓 🛡️</p>
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
                  {editingGoal ? 'Actualizar' : 'Crear'} Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

