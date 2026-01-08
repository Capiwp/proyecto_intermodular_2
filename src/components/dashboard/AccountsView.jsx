import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Plus,
  ArrowRightLeft,
  Edit,
  Trash2,
  Wallet,
  Building2,
  Banknote,
} from "lucide-react";
import { useAccountStore } from "../../store/accountStore";

const AccountModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "cash",
    initial_balance: "",
    currency: "EUR",
    color: "#10B981",
    icon: "wallet",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        initial_balance: initialData.balance, // Use balance for editing if needed, but usually strictly update handled differently. For simple CRUD, ok.
        currency: initialData.currency,
        color: initialData.color || "#10B981",
        icon: initialData.icon || "wallet",
      });
    } else {
      setFormData({
        name: "",
        type: "cash",
        initial_balance: "",
        currency: "EUR",
        color: "#10B981",
        icon: "wallet",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      initial_balance: Number(formData.initial_balance),
      balance: Number(formData.initial_balance), // Pass balance for updates
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {initialData ? "Editar Cuenta" : "Nueva Cuenta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la cuenta
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej: Billetera Principal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="cash">Efectivo</option>
                <option value="bank">Banco</option>
                <option value="credit_card">Tarjeta Crédito</option>
                <option value="savings">Ahorros</option>
                <option value="investment">Inversión</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">Dólar ($)</option>
                <option value="GBP">Libra (£)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Saldo {initialData ? "Actual" : "Inicial"}
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.initial_balance}
              onChange={(e) =>
                setFormData({ ...formData, initial_balance: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="0.00"
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
              {initialData ? "Guardar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TransferModal = ({ isOpen, onClose, onSubmit, accounts }) => {
  const [formData, setFormData] = useState({
    from_account_id: "",
    to_account_id: "",
    amount: "",
    description: "",
  });

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
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
          Nueva Transferencia
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde (Origen)
            </label>
            <select
              required
              value={formData.from_account_id}
              onChange={(e) =>
                setFormData({ ...formData, from_account_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="">Selecciona cuenta origen</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} ({acc.currency} {Number(acc.balance).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hacia (Destino)
            </label>
            <select
              required
              value={formData.to_account_id}
              onChange={(e) =>
                setFormData({ ...formData, to_account_id: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="">Selecciona cuenta destino</option>
              {accounts
                .filter((a) => a.id !== formData.from_account_id)
                .map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.currency} {Number(acc.balance).toFixed(2)})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (Opcional)
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Ej: Ahorro mensual"
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
              Transferir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AccountsView = () => {
  const {
    accounts,
    fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount,
    loading,
    createTransfer,
    transfers,
    fetchTransfers,
  } = useAccountStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [activeTab, setActiveTab] = useState("accounts"); // accounts | transfers

  useEffect(() => {
    fetchAccounts();
    fetchTransfers();
  }, []);

  const handleCreate = async (data) => {
    const success = await addAccount(data);
    if (success) setIsModalOpen(false);
  };

  const handleUpdate = async (data) => {
    if (!editingAccount) return;
    const success = await updateAccount(editingAccount.id, data);
    if (success) {
      setIsModalOpen(false);
      setEditingAccount(null);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "¿Seguro que deseas eliminar esta cuenta? Se perderán las transacciones asociadas a ella."
      )
    ) {
      await deleteAccount(id);
    }
  };

  const handleTransfer = async (data) => {
    const success = await createTransfer(data);
    if (success) setIsTransferModalOpen(false);
  };

  const openEdit = (acc) => {
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const openCreate = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const getIcon = (type) => {
    switch (type) {
      case "bank":
        return Building2;
      case "cash":
        return Banknote;
      case "credit_card":
        return CreditCard;
      default:
        return Wallet;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cuentas y Carteras
          </h1>
          <p className="text-gray-500 mt-1">Gestiona tus fuentes de dinero</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            <ArrowRightLeft className="w-5 h-5" />
            Transferir
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" />
            Nueva Cuenta
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`py-2 px-4 font-medium transition-colors border-b-2 ${
            activeTab === "accounts"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-emerald-500"
          }`}
        >
          Mis Cuentas
        </button>
        <button
          onClick={() => setActiveTab("transfers")}
          className={`py-2 px-4 font-medium transition-colors border-b-2 ${
            activeTab === "transfers"
              ? "border-emerald-500 text-emerald-600"
              : "border-transparent text-gray-500 hover:text-emerald-500"
          }`}
        >
          Historial de Transferencias
        </button>
      </div>

      {/* Content */}
      {activeTab === "accounts" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && accounts.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-10">
              Cargando cuentas...
            </p>
          ) : accounts.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tienes cuentas registradas.</p>
            </div>
          ) : (
            accounts.map((acc) => {
              const Icon = getIcon(acc.type);
              return (
                <div
                  key={acc.id}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 w-2 h-full opacity-60"
                    style={{ backgroundColor: acc.color || "#10B981" }}
                  ></div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={() => openEdit(acc)}
                      className="p-1.5 text-gray-400 hover:text-blue-500 bg-gray-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{acc.name}</h3>
                      <p className="text-xs text-gray-500 uppercase">
                        {acc.type.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Saldo Actual</p>
                    <p className="text-2xl font-extrabold text-gray-900">
                      {acc.currency === "EUR" ? "€" : "$"}{" "}
                      {Number(acc.balance).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Origen
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Destino
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  Descripción
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transfers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hay transferencias registradas
                  </td>
                </tr>
              ) : (
                transfers.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {t.from_account_name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {t.to_account_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {t.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {Number(t.amount).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <AccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingAccount ? handleUpdate : handleCreate}
        initialData={editingAccount}
      />

      <TransferModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSubmit={handleTransfer}
        accounts={accounts}
      />
    </div>
  );
};

export default AccountsView;
