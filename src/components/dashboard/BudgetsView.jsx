import { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, TrendingUp } from 'lucide-react';
import api from '../../api/api';

export default function BudgetsView() {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estado del formulario siguiendo el patrón de tus otras vistas
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
      // Intentamos con /categories que es el estándar en tu SQL
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

    if (!formData.name) {
      alert('Por favor introduce un nombre');
      return;
    }

    try {
      const categoryData = {
        name: formData.name,
        color: formData.color,
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, categoryData);
      } else {
        await api.post('/categories', categoryData);
      }

      // IMPORTANTE: Recargar la lista después de guardar
      await loadCategories();
      closeDialog();
    } catch (error) {
      console.error('Error guardando categoría:', error);
      alert(error.response?.data?.message || 'Error al conectar con la base de datos');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres borrar este post-it?')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadCategories();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#10B981' });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Mis Etiquetas</h1>
          <p className="text-gray-600">Gestiona tus categorías como post-its</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Nuevo Post-it
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500">No hay etiquetas. Crea la primera para empezar a organizar tu dinero.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="aspect-square p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all transform hover:-rotate-1 border-t-8"
              style={{ 
                backgroundColor: `${cat.color}10`, // Color de fondo muy suave
                borderTopColor: cat.color 
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div 
                  className="p-2 rounded-lg" 
                  style={{ backgroundColor: cat.color }}
                >
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => {
                      setEditingCategory(cat);
                      setFormData({ name: cat.name, color: cat.color });
                      setIsDialogOpen(true);
                    }}
                    className="p-1.5 hover:bg-white rounded-md text-gray-500"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(cat.id)}
                    className="p-1.5 hover:bg-white rounded-md text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 break-words uppercase tracking-tight">
                {cat.name}
              </h3>
              <div className="absolute bottom-6 right-6 opacity-20">
                <TrendingUp className="w-8 h-8" style={{ color: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogo modal idéntico estructuralmente al de GoalsView */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">NOMBRE</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Comida, Ocio..."
                  className="w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">COLOR</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-12 p-1 border rounded-xl cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 font-bold text-gray-500 hover:bg-gray-50 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg"
                >
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}