import React from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gray-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
        <img
          alt="FinanceFlow"
          src="/finance-flow-logo-gradient.svg?color=indigo&size=256"
          className="mx-auto h-28 w-auto hover:drop-shadow-[0_0_10px_theme(colors.emerald.400)] transition-all duration-300;"
        />

        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Recuperar Contraseña
        </h2>

        <p className="mt-2 text-center text-sm/6 text-gray-500">
          Ingresa tu correo electrónico para restablecer tu contraseña
        </p>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6">
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
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
