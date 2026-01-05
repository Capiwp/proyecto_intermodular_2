import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, TrendingUp } from 'lucide-react';
import api from '../../api/api';

const BudgetsView = () => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al cargar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      await fetchCategories();
      closeDialog();
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este post-it?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert('No se pudo eliminar');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#10B981' });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mis Etiquetas</h1>
          <p className="text-gray-500">Organiza tu dinero con tarjetas de colores</p>
        </div>
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          <Plus className="w-5 h-5" /> Nueva Tarjeta
        </button>
      </div>

      {/* Grid de Post-its */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="relative aspect-square p-6 rounded-2xl shadow-md flex flex-col justify-between transform transition-all hover:-rotate-2 hover:shadow-xl border-t-8"
              style={{ backgroundColor: `${cat.color}15`, borderTopColor: cat.color }}
            >
              <div className="flex justify-between items-start">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: cat.color }}
                >
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingCategory(cat); setFormData({name: cat.name, color: cat.color}); setIsDialogOpen(true); }} className="p-1 hover:bg-white/50 rounded text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-1 hover:bg-white/50 rounded text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800 break-words">{cat.name}</h3>
                <p className="text-xs font-mono text-gray-400 mt-2">ID: {cat.id.substring(0,8)}</p>
              </div>
            </div>
          ))}

          {/* Botón rápido para añadir (Post-it vacío) */}
          <button 
            onClick={() => setIsDialogOpen(true)}
            className="aspect-square border-4 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition-colors"
          >
            <Plus className="w-10 h-10 mb-2" />
            <span className="font-medium">Añadir más</span>
          </button>
        </div>
      )}

      {/* Modal de Creación */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Configurar Post-it</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Nombre</label>
                <input 
                  className="w-full mt-1 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 outline-none font-semibold"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Ahorro Casa"
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Color de Tarjeta</label>
                <input 
                  type="color" 
                  className="w-full h-14 mt-1 rounded-xl cursor-pointer bg-transparent border-none" 
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeDialog} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cerrar</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600">Listo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsView;