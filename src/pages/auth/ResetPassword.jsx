import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/images/finance-flow-logo-gradient.svg";
import { CheckCircle, Lock } from "lucide-react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { confirmPasswordReset, loading, error } = useAuthStore();
  
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMessage("");

    if (passwords.new !== passwords.confirm) {
      setLocalError("Las contraseñas no coinciden");
      return;
    }

    if (passwords.new.length < 6) {
      setLocalError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const success = await confirmPasswordReset(token, passwords.new);
    if (success) {
      setSuccessMessage("¡Contraseña restablecida correctamente!");
      setTimeout(() => navigate("/"), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gradient-to-r from-green-50 to-emerald-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
        <img
          alt="FinanceFlow"
          src={logo}
          className="mx-auto h-28 w-auto hover:drop-shadow-[0_0_10px_theme(colors.emerald.400)] transition-all duration-300;"
        />

        <h2 className="mt-8 text-center text-2xl font-bold tracking-tight text-gray-900">
          Nueva Contraseña
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          Ingresa tu nueva contraseña a continuación
        </p>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {successMessage && (
             <div className="mb-4 p-4 bg-green-50 rounded-lg flex items-center justify-center gap-2 text-green-700 font-medium">
               <CheckCircle className="w-5 h-5" />
               {successMessage}
             </div>
          )}
          
          {(error || localError) && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
              {localError || error}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                    className="block w-full rounded-md border-0 py-2.5 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50 transition-all"
              >
                {loading ? "Actualizando..." : "Cambiar Contraseña"}
              </button>
            </form>
          )}
          
          <p className="mt-8 text-center text-sm text-gray-500">
            <Link
              to="/"
              className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
