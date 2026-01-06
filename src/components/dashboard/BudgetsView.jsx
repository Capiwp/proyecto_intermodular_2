import { useState, useEffect } from 'react';
import { Tag, Trash2 } from 'lucide-react';
import api from '../../api/api';

export default function BudgetsView() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', color: '#10B981' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      // Envía el post-it al backend local
      await api.post('/categories', {
        name: formData.name.trim(),
        color: formData.color
      });

      setIsDialogOpen(false);
      setFormData({ name: '', color: '#10B981' });
      loadCategories(); // Refresca la lista
    } catch (error) {
      alert("Error: Verifica que el backend esté encendido en la terminal");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase">Mis Post-its</h1>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-xl font-bold"
        >
          + Nueva Nota
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            className="p-6 rounded-[2rem] shadow-xl flex flex-col justify-between border-b-8"
            style={{ backgroundColor: `${cat.color}20`, borderBottomColor: cat.color }}
          >
            <div className="flex justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color }}>
                <Tag className="text-white" size={20} />
              </div>
              <button onClick={async () => { await api.delete(`/categories/${cat.id}`); loadCategories(); }} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
            <h2 className="text-xl font-black mt-4 uppercase">{cat.name}</h2>
          </div>
        ))}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-[2rem] w-80 shadow-2xl">
            <h2 className="font-black mb-4 uppercase">Nueva Categoría</h2>
            <input 
              className="w-full p-3 border-2 rounded-xl mb-4 font-bold"
              placeholder="NOMBRE"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="color" 
              className="w-full h-12 mb-4 rounded-lg cursor-pointer" 
              value={formData.color}
              onChange={(e) => setFormData({...formData, color: e.target.value})}
            />
            <button type="submit" className="w-full bg-emerald-500 text-white p-3 rounded-xl font-black uppercase">Crear</button>
            <button type="button" onClick={() => setIsDialogOpen(false)} className="w-full mt-2 text-gray-400 font-bold">Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}