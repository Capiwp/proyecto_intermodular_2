import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import logo from "../../assets/images/finance-flow-logo-gradient.svg";

function ForgotPassword() {
  const { resetPassword, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const success = await resetPassword(email);
    if (success) {
      setMessage("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
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

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recuperar Contraseña
        </h2>

        <p className="mt-2 text-center text-sm/6 text-gray-500">
          Ingresa tu correo electrónico para restablecer tu contraseña
        </p>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              {typeof error === "string" ? error : "Error al solicitar recuperación"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>

              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="ejemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Reset Password"}
              </button>
            </div>
          </form>
          
          <p className="mt-10 text-center text-sm/6 text-gray-500">
            <Link
              to="/"
              className="font-semibold text-gray-800 hover:text-emerald-500"
            >
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;