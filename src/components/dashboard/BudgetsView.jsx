import { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, TrendingUp } from 'lucide-react';
import api from '../../api/api';

export default function BudgetsView() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado del formulario: Solo name y color (lo que hay en tu SQL)
  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // Usamos el endpoint que coincide con tu tabla SQL
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Evitar envíos vacíos
    if (!formData.name.trim()) return;

    try {
      const data = {
        name: formData.name.trim(),
        color: formData.color
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, data);
      } else {
        await api.post('/categories', data);
      }

      // IMPORTANTE: Limpiar estado y CERRAR antes de recargar para que el usuario vea acción
      setFormData({ name: '', color: '#10B981' });
      setIsDialogOpen(false);
      setEditingCategory(null);
      
      // Recargar la lista del servidor
      await loadCategories();

    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar la categoría. Revisa si el endpoint /categories es correcto.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este post-it?')) return;
    try {
      await api.delete(`/categories/${id}`);
      await loadCategories();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, color: cat.color });
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Gestión de Post-its</h1>
          <p className="text-gray-500 font-medium text-sm">Organiza tu dinero por etiquetas de colores</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-2xl hover:scale-105 transition-all shadow-lg flex items-center gap-2 font-bold"
        >
          <Plus className="w-5 h-5" /> Nueva Etiqueta
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 animate-pulse text-gray-400 font-bold uppercase tracking-widest">
          Leyendo base de datos...
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold">Aún no hay post-its creados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="aspect-square p-6 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all transform hover:-rotate-1 border-t-[10px] flex flex-col justify-between"
              style={{ backgroundColor: `${cat.color}15`, borderTopColor: cat.color }}
            >
              <div className="flex justify-between items-start">
                <div className="p-3 rounded-2xl shadow-sm" style={{ backgroundColor: cat.color }}>
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(cat)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-blue-500 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter leading-tight break-words">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Creación */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 tracking-tight">
              {editingCategory ? 'Editar Etiqueta' : 'Crear Post-it'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: ALQUILER"
                  className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-emerald-500 font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Color de Fondo</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-16 p-1 bg-white border-2 border-gray-100 rounded-2xl cursor-pointer"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600">CANCELAR</button>
                <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 uppercase text-xs tracking-widest">GUARDAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}