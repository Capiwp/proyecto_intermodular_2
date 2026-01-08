import React, { useEffect, useState } from "react";
import { TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { useBudgetStore } from "../../store/budgetStore";
import { useCategoryStore } from "../../store/categoryStore";

const BudgetModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}) => {
  const [formData, setFormData] = useState({
    category_id: "",
    limit_amount: "",
    period: "monthly",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        category_id: initialData.category_id,
        limit_amount: initialData.limit_amount,
        period: initialData.period || "monthly",
      });
    } else {
      setFormData({
        category_id: "",
        limit_amount: "",
        period: "monthly",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      limit_amount: Number(formData.limit_amount),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {initialData ? "Editar Presupuesto" : "Nuevo Presupuesto"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                €
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.limit_amount}
                onChange={(e) =>
                  setFormData({ ...formData, limit_amount: e.target.value })
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodo
            </label>
            <select
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="monthly">Mensual</option>
              <option value="weekly">Semanal</option>
              <option value="yearly">Anual</option>
            </select>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
            >
              {initialData ? "Guardar Cambios" : "Crear Presupuesto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BudgetsView = () => {
  const {
    budgets,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    loading,
  } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    const success = await addBudget(data);
    if (success) setIsModalOpen(false);
  };

  const handleUpdate = async (data) => {
    if (!editingBudget) return;
    const success = await updateBudget(editingBudget.id, data);
    if (success) {
      setIsModalOpen(false);
      setEditingBudget(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar presupuesto?")) {
      await deleteBudget(id);
    }
  };

  const openCreate = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const openEdit = (b) => {
    setEditingBudget(b);
    setIsModalOpen(true);
  };

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat ? cat.name : "Desconocida";
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Presupuestos
          </h1>
          <p className="text-gray-500 mt-1">
            Controla tus gastos por categoría
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && budgets.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            Cargando presupuestos...
          </p>
        ) : budgets.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tienes presupuestos definidos.</p>
          </div>
        ) : (
          budgets.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
            >
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(b)}
                  className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mb-4">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wide">
                  {b.period === "monthly" ? "Mensual" : b.period}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {getCategoryName(b.category_id)}
              </h3>
              <p className="text-3xl font-extrabold text-gray-900 mb-4">
                €{Number(b.limit_amount).toLocaleString()}
              </p>

              {/* Progress bar placeholder (requires transaction data integration for real progress) */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full w-[0%]"></div>
              </div>
              <p className="text-xs text-gray-500 text-right">
                0% gastado (Integración pendiente)
              </p>
            </div>
          ))
        )}
      </div>

      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingBudget ? handleUpdate : handleCreate}
        initialData={editingBudget}
        categories={categories}
      />
    </div>
  );
};

export default BudgetsView;
