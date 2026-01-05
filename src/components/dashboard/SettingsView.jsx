import { useState, useEffect } from 'react';
import { Settings, Shield, Smartphone, Monitor, Trash2, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const SettingsView = () => {
  const { changePassword, deleteAccount, user } = useAuthStore();
  
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [status, setStatus] = useState({ type: '', message: '' });

  // 2FA State (Simulated per session/browser for this demo)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    localStorage.getItem('2fa_enabled') === 'true'
  );

  // Mock Devices State
  const [devices, setDevices] = useState([
    { id: 1, name: 'Chrome en Windows', type: 'desktop', active: true, location: 'Madrid, España', ip: '192.168.1.1' },
    { id: 2, name: 'iPhone 13 Pro', type: 'mobile', active: false, location: 'Barcelona, España', lastActive: 'Hace 2 horas' }
  ]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setStatus({ type: 'error', message: 'Las nuevas contraseñas no coinciden' });
      return;
    }
    if (passwords.new.length < 6) {
      setStatus({ type: 'error', message: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }
    setStatus({ type: 'loading', message: 'Actualizando...' });
    const result = await changePassword(passwords.current, passwords.new);
    if (result.success) {
      setStatus({ type: 'success', message: 'Contraseña actualizada correctamente' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } else {
      setStatus({ type: 'error', message: result.error });
    }
  };

  const handleToggle2FA = () => {
    // In a real app, this would verify a code or QR
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    localStorage.setItem('2fa_enabled', newState);
  };

  const handleRevokeDevice = (id) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿ESTÁ SEGURO? Esta acción eliminará permanentemente su cuenta y todos sus datos. No se puede deshacer.')) {
      const success = await deleteAccount();
      if (!success) {
        alert("Error al eliminar la cuenta. Intente nuevamente.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8 text-emerald-500" />
        <h1 className="text-3xl font-extrabold text-gray-900">Configuración</h1>
      </div>

      {/* Security Section - 2FA */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>
           </div>
           <p className="text-gray-500 text-sm">Protege tu cuenta con capas adicionales de seguridad.</p>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Autenticación de dos factores (2FA)</h3>
              <p className="text-sm text-gray-500 mt-1">Añade una capa extra de seguridad a tu cuenta.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={twoFactorEnabled}
                onChange={handleToggle2FA}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Cambiar Contraseña</h2>
           </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
              <input 
                type="password" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
              <input 
                type="password" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                required
                minLength={6}
              />
            </div>

            {status.message && (
              <div className={`p-3 rounded-lg text-sm ${status.type === 'error' ? 'bg-red-50 text-red-600' : status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                {status.message}
              </div>
            )}

            <button 
              type="submit"
              disabled={status.type === 'loading'}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {status.type === 'loading' ? 'Actualizando...' : 'Actualizar Contraseña'}
            </button>
          </form>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-6 h-6 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Dispositivos Conectados</h2>
           </div>
        </div>
        
        <div className="p-6 space-y-4">
          {devices.length === 0 && <p className="text-gray-500">No hay otros dispositivos conectados.</p>}
          {devices.map(device => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                 {device.type === 'mobile' ? <Smartphone className="w-8 h-8 text-gray-400" /> : <Monitor className="w-8 h-8 text-gray-400" />}
                 <div>
                   <p className="font-semibold text-gray-900">{device.name}</p>
                   <p className="text-xs text-gray-500">
                     {device.active ? (
                       <span className="text-green-600 font-medium flex items-center gap-1">
                         <span className="w-2 h-2 rounded-full bg-green-500"></span> Activo ahora
                       </span>
                     ) : (
                       `${device.location} · ${device.lastActive}`
                     )}
                   </p>
                 </div>
              </div>
              <button 
                onClick={() => handleRevokeDevice(device.id)}
                className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl shadow-md border border-red-100 overflow-hidden">
        <div className="p-6 border-b border-red-100">
           <div className="flex items-center gap-3 mb-2">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-bold text-red-700">Zona de Peligro</h2>
           </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Eliminar cuenta</h3>
              <p className="text-sm text-gray-500 mt-1">
                Acción irreversible. Borrará todos tus datos.
              </p>
            </div>
            <button 
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
              onClick={handleDeleteAccount}
            >
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
