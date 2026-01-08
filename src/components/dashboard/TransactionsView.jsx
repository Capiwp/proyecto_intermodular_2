import React, { useEffect, useState } from "react";
import { DollarSign, Plus, Search, Filter, Trash2, Edit } from "lucide-react";
import { useTransactionStore } from "../../store/transactionStore";
import { useAuthStore } from "../../store/authStore";

const TransactionModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        amount: Math.abs(initialData.amount),
        type: initialData.type,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {initialData ? "Editar Transacción" : "Nueva Transacción"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income" })}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.type === "income"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense" })}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  formData.type === "expense"
                    ? "bg-red-50 border-red-500 text-red-700 font-semibold"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Gasto
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                €
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Ej: Compra supermercado"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
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
              {initialData ? "Guardar Cambios" : "Crear Transacción"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TransactionsView = () => {
  const {
    transactions,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    loading,
  } = useTransactionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, income, expense

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleCreate = async (data) => {
    const success = await addTransaction(data);
    if (success) setIsModalOpen(false);
  };

  const handleUpdate = async (data) => {
    if (!editingTx) return;
    const success = await updateTransaction(editingTx.id, data);
    if (success) {
      setIsModalOpen(false);
      setEditingTx(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta transacción?")) {
      await deleteTransaction(id);
    }
  };

  const openEdit = (tx) => {
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingTx(null);
    setIsModalOpen(true);
  };

  const filtered = transactions.filter(
    (t) => filterType === "all" || t.type === filterType
  );

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Transacciones
          </h1>
          <p className="text-gray-500 mt-1">Gestiona tus ingresos y gastos</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Nueva Transacción
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
        {["all", "income", "expense"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filterType === type
                ? "bg-emerald-100 text-emerald-800"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {type === "all"
              ? "Todas"
              : type === "income"
              ? "Ingresos"
              : "Gastos"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hay transacciones registradas
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.type === "income"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {tx.type === "income" ? "Ingreso" : "Gasto"}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-bold text-right ${
                        tx.type === "income"
                          ? "text-emerald-600"
                          : "text-gray-700"
                      }`}
                    >
                      {tx.type === "expense" ? "-" : "+"}€
                      {Number(tx.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(tx)}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingTx ? handleUpdate : handleCreate}
        initialData={editingTx}
      />
    </div>
  );
};

export default TransactionsView;
