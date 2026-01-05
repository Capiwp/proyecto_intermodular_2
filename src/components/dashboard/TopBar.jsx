import { useAuthStore } from "../../store/authStore";

const TopBar = ({ onSearch, onSettingsClick, onProfileClick, onNotificationsClick }) => {
    const { user } = useAuthStore();

    return (
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 px-6 py-4 shadow-lg flex items-center justify-between">
            {/* LADO IZQUIERDO: LOGO */}
            <a
                href="/dashboard"
                className="flex items-center gap-2 w-64 cursor-pointer hover:opacity-80 transition-opacity"
            >
                {/* Logo FinanceFlow */}
                <img src="/finance-flow-logo-gradient.svg" alt="" className="w-10 h-10"/>
                <span className="text-xl font-bold text-gray-800 tracking-tight">
                    FinanceFlow
                </span>
            </a>

            {/* CENTRO: BUSCADOR */}
            <div className="flex-1 flex justify-center px-4">
                <div className="relative">
                    {/* Icono Lupa (Posición absoluta) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>

                    {/* Campo de Texto (Input) */}
                    <input
                        type="text"
                        placeholder="Buscar transacciones..."
                        className="w-96 min-w-96 max-w-96 pl-10 pr-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:bg-white/20 focus:border-white/40 shadow-inner transition-all"
                        onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* LADO DERECHO: AJUSTES, NOTIFICACIONES Y PERFIL */}
            <div className="flex items-center gap-4 w-64 justify-end">
                {/* Ajustes */}
                <button 
                    onClick={onSettingsClick}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </button>
                {/* Campana */}
                <button 
                  onClick={onNotificationsClick}
                  className="relative p-2 text-gray-400 hover:text-emerald-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
                    {/* Badge rojo */}
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                {/* Separador */}
                <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

                {/* Avatar y Nombre */}
                <div 
                  onClick={onProfileClick}
                  className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white overflow-hidden">
                        {user?.avatar_url ? (
                            <img 
                                src={`${(import.meta.env.VITE_API_URL || "https://backend2-7u6r.onrender.com").replace('/api', '')}${user.avatar_url}`} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                        )}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-gray-700 leading-none mb-0.5">
                            {user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">Miembro</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
