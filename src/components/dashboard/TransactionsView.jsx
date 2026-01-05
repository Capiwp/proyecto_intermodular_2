import { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, Palette } from 'lucide-react';
import api from '../../api/api';

const TransactionsView = () => {
  const [tags, setTags] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981', // Emerald-500 por defecto
    description: ''
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tags'); // Asumiendo que existe el endpoint /tags
      setTags(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error cargando etiquetas:', error);
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert('El nombre es obligatorio');

    try {
      if (editingTag) {
        await api.put(`/tags/${editingTag.id}`, formData);
      } else {
        await api.post('/tags', formData);
      }
      loadTags();
      closeDialog();
    } catch (error) {
      console.error('Error guardando etiqueta:', error);
      alert('Error al procesar la etiqueta');
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      color: tag.color,
      description: tag.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta etiqueta? Los movimientos asociados podrían quedar sin categoría.')) return;
    try {
      await api.delete(`/tags/${id}`);
      loadTags();
    } catch (error) {
      console.error('Error eliminando etiqueta:', error);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTag(null);
    setFormData({ name: '', color: '#10B981', description: '' });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Gestión de Etiquetas</h1>
          <p className="text-gray-600">Organiza tus gastos e ingresos con categorías personalizadas</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Etiqueta
        </button>
      </div>

      {/* Tags Grid */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Tag className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-800">Mis Categorías</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No hay etiquetas creadas. Comienza a organizar tu dinero.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="group relative flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md"
                style={{ borderLeft: `6px solid ${tag.color}` }}
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{tag.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{tag.description || 'Sin descripción'}</p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(tag)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-emerald-500" />
              <h2 className="text-2xl font-bold">{editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Categoría</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ej: Alimentación, Ocio, Alquiler"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Identificador</label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10 p-1 rounded border cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 uppercase font-mono">{formData.color}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows="2"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  {editingTag ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsView;