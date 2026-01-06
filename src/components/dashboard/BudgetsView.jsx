import { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2 } from 'lucide-react';
import api from '../../api/api'; // Verifica que esta ruta sea correcta

export default function BudgetsView() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', color: '#10B981' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      // Enviamos a /categories porque así está en tu SQL
      await api.post('/categories', {
        name: formData.name.trim(),
        color: formData.color
      });

      setFormData({ name: '', color: '#10B981' });
      setIsDialogOpen(false);
      await loadCategories(); // Recarga la lista
    } catch (error) {
      console.error('Error al crear:', error);
      alert('Error: No se pudo conectar con el Backend. Revisa la carpeta con flecha.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-gray-900">MIS POST-ITS</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-xl font-bold shadow-lg"
        >
          + NUEVA NOTA
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse font-bold text-gray-400">CONECTANDO...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="aspect-square p-6 rounded-[2rem] shadow-xl flex flex-col justify-between transform -rotate-1 hover:rotate-0 transition-all border-b-8"
              style={{ backgroundColor: `${cat.color}20`, borderBottomColor: cat.color }}
            >
              <div className="flex justify-between">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color }}>
                  <Tag className="text-white w-5 h-5" />
                </div>
                <button 
                  onClick={async () => { if(confirm('¿Borrar?')) { await api.delete(`/categories/${cat.id}`); loadCategories(); } }}
                  className="text-red-500 p-2 hover:bg-white rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <h2 className="text-xl font-black text-gray-800 uppercase break-words">{cat.name}</h2>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm shadow-2xl">
            <h2 className="text-2xl font-black mb-6">NUEVA CATEGORÍA</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold"
                placeholder="NOMBRE"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <input 
                type="color" 
                className="w-full h-16 rounded-xl cursor-pointer" 
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
              />
              <button type="submit" className="w-full bg-emerald-500 text-white p-4 rounded-xl font-black uppercase">Crear Post-it</button>
              <button type="button" onClick={() => setIsDialogOpen(false)} className="w-full text-gray-400 font-bold">Cerrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}