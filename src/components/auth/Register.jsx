import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

function Register() {
  const [count, setCount] = useState(0);
  const {
    userName,
    email,
    password,
    creditCard,
    location,
    numberPhone,
    birthDay,
    address,
  } = useAuthStore();
  useEffect(() => {}, []);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <form>
          <div className="mb-5">
            <label
              htmlFor="name"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Juan Pérez García"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="tu@email.com"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="password"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Contraseña *
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="passwordConfirm"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Confirmar contraseña *
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordConfirm"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="hover:shadow-htmlForm w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
