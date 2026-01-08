import React, { useRef, useState, useEffect } from "react";
import { User, Camera, Mail, Shield } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const ProfileView = () => {
  const { user, uploadAvatar, updateProfile, loading } = useAuthStore();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    monthly_income: "",
    currency: "",
    birth_date: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        address: user.address || "",
        monthly_income: user.monthly_income || "",
        currency: user.currency || "USD",
        birth_date: user.birth_date ? user.birth_date.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaveStatus("saving");

    // Convert empty strings to null or undefined to avoid DB constraints or validation issues
    const cleanData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    );

    const success = await updateProfile(cleanData);
    if (success) {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("error");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <User className="w-8 h-8 text-emerald-600" />
            Mi Perfil
          </h1>
          <p className="text-gray-500 mt-2">
            Gestiona tu información personal y preferencias
          </p>
        </div>
      </div>

      {/* Tarjeta Principal de Perfil */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            {/* Avatar con botón de subida */}
            <div className="relative group">
              <div
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden cursor-pointer relative"
                onClick={handleImageClick}
              >
                {user?.avatar_url ? (
                  <img
                    src={`${(
                      import.meta.env.VITE_API_URL ||
                      "https://backend2-7u6r.onrender.com"
                    ).replace("/api", "")}${user.avatar_url}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-4xl font-bold text-emerald-600">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                {/* Overlay al hacer hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100 text-gray-600">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                {user?.role === "admin" ? "Administrador" : "Miembro Activo"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Información de la cuenta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingreso Mensual
            </label>
            <input
              type="number"
              name="monthly_income"
              value={formData.monthly_income}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Moneda
            </label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleInputChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {saveStatus === "success" && (
            <span className="text-green-600 text-sm font-medium">
              ¡Cambios guardados!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-red-600 text-sm font-medium">
              Error al guardar
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
