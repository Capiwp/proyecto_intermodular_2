import { useState, useEffect } from "react";

// import { useAuthStore } from "../../store/authStore"; // <-- Eliminado, se simulará

// import countryList from "react-select-country-list"; // <-- Eliminado

// import Select from "react-select"; // <-- Eliminado

// 1. SIMULACIÓN (MOCK) DE AUTHSTORE

// Esto reemplaza la importación faltante para que el código sea ejecutable.

const useAuthStore = {
  setState: (newState) => {
    console.log("Estado de authStore actualizado (simulación):", newState);
  },
};

function Register() {
  const [count, setCount] = useState(1);

  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",

    email: "",

    password: "",

    passwordConfirm: "",

    creditCard: "",

    location: "",

    numberPhone: "",

    birthDay: "",

    address: "",
  });

  // 2. NUEVO ESTADO para la lista de países y la carga

  const [countryOptions, setCountryOptions] = useState([]);

  const [isLoadingCountries, setIsLoadingCountries] = useState(true);

  // 3. NUEVO EFFECT para cargar países desde la API

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");

        if (!response.ok) throw new Error("No se pudieron cargar los países");

        const data = await response.json();

        const countryNames = data.map((country) => country.name.common);

        // Ordenamos alfabéticamente

        countryNames.sort((a, b) =>
          a.localeCompare(b, "es", { sensitivity: "base" })
        );

        setCountryOptions(countryNames);
      } catch (error) {
        console.error("Error al cargar países:", error);

        // Podríamos poner un error, pero por ahora lo dejamos
      } finally {
        setIsLoadingCountries(false);
      }
    }

    fetchCountries();
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });

    if (errors[e.target.name]) {
      setErrors({
        ...errors,

        [e.target.name]: null,
      });
    }

    // 4. Limpiar error de país al escribir

    if (e.target.name === "location" && errors.location) {
      setErrors({ ...errors, location: null });
    }
  };

  const siguiente = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!form.name) newErrors.name = "El nombre es obligatorio.";

    if (!form.email) newErrors.email = "El email es obligatorio.";

    if (!form.password) newErrors.password = "La contraseña es obligatoria.";

    if (form.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres.";

    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setCount(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Validar campos del paso 1 (por si acaso)

    if (!form.name) newErrors.name = "El nombre es obligatorio.";

    if (!form.email) newErrors.email = "El email es obligatorio.";

    if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden";
    }

    // Validar campos del paso 2

    if (!form.creditCard) newErrors.creditCard = "La tarjeta es obligatoria.";

    if (!form.location) newErrors.location = "El país es obligatorio.";

    if (!form.numberPhone)
      newErrors.numberPhone = "El teléfono es obligatorio.";

    if (!form.birthDay)
      newErrors.birthDay = "La fecha de nacimiento es obligatoria.";

    if (!form.address) newErrors.address = "La dirección es obligatoria.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      console.log("Errores en el formulario:", newErrors);

      // Si hay errores en el paso 1, volvemos al paso 1

      if (newErrors.name || newErrors.email || newErrors.passwordConfirm) {
        setCount(1);
      }

      return;
    }

    // Usamos la simulación de useAuthStore

    useAuthStore.setState({
      userName: form.name,

      email: form.email,

      password: form.password,

      passwordConfirm: form.passwordConfirm,

      creditCard: form.creditCard,

      location: form.location,

      numberPhone: form.numberPhone,

      birthDay: form.birthDay,

      address: form.address,
    });

    console.log("Usuario registrado:", form);

    // Aquí puedes redirigir o mostrar un mensaje de éxito
  };

  // --- Eliminados useMemo, useState(country), handleCountryChange y customSelectStyles ---

  return (
    <div className="flex items-center justify-center p-6 md:p-12 bg-gray-100 min-h-screen">
      <div className="mx-auto w-full max-w-[550px] bg-white p-8 rounded-xl shadow-lg">
        {/* Indicador de Paso */}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-[#07074D]">
            Registro - Paso {count} de 2
          </h2>

          <div className="mt-2 flex">
            <div
              className={`w-1/2 h-2 rounded-l-full ${
                count === 1 ? "bg-emerald-600" : "bg-emerald-600"
              }`}
            ></div>

            <div
              className={`w-1/2 h-2 rounded-r-full ${
                count === 2 ? "bg-emerald-600" : "bg-gray-200"
              }`}
            ></div>
          </div>
        </div>

        {/* PASO 1 */}

        {count === 1 && (
          <form onSubmit={siguiente}>
            {/* ... (Campos de Nombre, Email, Contraseña sin cambios) ... */}

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Nombre Completo *
              </label>

              <input
                type="text"
                name="name"
                placeholder="Juan Pérez García"
                value={form.name}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.name ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Email *
              </label>

              <input
                type="email"
                name="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange}
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.email ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="flex -mx-3 mb-5">
              <div className="w-1/2 px-3">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Contraseña *
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  value={form.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                    errors.password ? "outline-red-500" : "outline-gray-300"
                  }`}
                />

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="w-1/2 px-3">
                <label className="mb-3 block text-base font-medium text-[#07074D]">
                  Confirmar *
                </label>

                <input
                  type="password"
                  name="passwordConfirm"
                  placeholder="********"
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                    errors.passwordConfirm
                      ? "outline-red-500"
                      : "outline-gray-300"
                  }`}
                />

                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Siguiente
            </button>
          </form>
        )}

        {/* PASO 2 */}

        {count === 2 && (
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Tarjeta de crédito *
              </label>

              <input
                type="text"
                name="creditCard"
                value={form.creditCard}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.creditCard ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.creditCard && (
                <p className="text-red-500 text-xs mt-1">{errors.creditCard}</p>
              )}
            </div>

            {/* 5. CAMPO DE PAÍS REEMPLAZADO */}

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                País *
              </label>

              <input
                type="text"
                name="location" // Se conecta directamente al formulario
                value={form.location}
                onChange={handleChange}
                list="lista-paises" // Se conecta al datalist
                placeholder={
                  isLoadingCountries
                    ? "Cargando países..."
                    : "Escribe tu país..."
                }
                disabled={isLoadingCountries} // Deshabilitado mientras carga
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.location ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              <datalist id="lista-paises">
                {countryOptions.map((pais) => (
                  <option key={pais} value={pais} />
                ))}
              </datalist>

              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location}</p>
              )}
            </div>

            {/* ... (Resto de campos de Teléfono, Nacimiento, Dirección sin cambios) ... */}

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Número de telefono *
              </label>

              <input
                type="tel"
                name="numberPhone"
                value={form.numberPhone}
                onChange={handleChange}
                placeholder="+1 234 567 890"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.numberPhone ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.numberPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.numberPhone}
                </p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Fecha de nacimiento *
              </label>

              <input
                type="date"
                name="birthDay"
                value={form.birthDay}
                onChange={handleChange}
                placeholder="DD/MM/AAAA"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.birthDay ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.birthDay && (
                <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>
              )}
            </div>

            <div className="mb-5">
              <label className="mb-3 block text-base font-medium text-[#07074D]">
                Dirección *
              </label>

              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Av. Siempre Viva 123"
                className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6 ${
                  errors.address ? "outline-red-500" : "outline-gray-300"
                }`}
              />

              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setCount(1);

                  // No limpiamos errores, por si el usuario solo quería volver
                }}
                className="flex w-full justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Atrás
              </button>

              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Registrarse
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
