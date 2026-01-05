import React, { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const BudgetsView = () => {
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado del formulario ajustado a tu SQL (name y color)
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
      // Usamos /categories porque así aparece en tu CREATE TABLE
      const response = await api.get('/categories');
      setCategories(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('No se pudieron cargar las categorías. Verifica la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        name: formData.name,
        color: formData.color
      };

      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, dataToSend);
      } else {
        await api.post('/categories', dataToSend);
      }
      
      fetchCategories();
      closeDialog();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al conectar con la base de datos';
      alert(`Error: ${msg}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        alert('No se pudo eliminar la categoría');
      }
    }
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color || '#10B981'
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#10B981' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Presupuestos y Categorías</h1>
          <p className="text-gray-500">Gestiona las etiquetas de tu base de datos SQL</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-800">Tus Categorías (Tabla: categories)</h2>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No hay categorías creadas. Pulsa "Nueva Categoría" para empezar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-4 rounded-xl border-2 transition-hover hover:shadow-sm"
                  style={{ borderColor: cat.color + '40', borderLeftColor: cat.color }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="font-semibold text-gray-700">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(cat)} className="p-1 hover:text-blue-600 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(cat.id)} className="p-1 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal / Diálogo */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingCategory ? 'Editar Categoría' : 'Añadir Categoría'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ej: Comida, Transporte..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color de etiqueta</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    className="h-10 w-20 p-1 rounded-md border border-gray-300 cursor-pointer"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                  />
                  <span className="text-gray-500 text-sm font-mono uppercase">{formData.color}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-lg"
                >
                  {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsView;