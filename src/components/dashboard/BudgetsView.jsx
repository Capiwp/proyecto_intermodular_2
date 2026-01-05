import { useState, useEffect } from 'react';
import { Plus, Tag, Trash2, Edit2, Palette, TrendingUp } from 'lucide-react';
import api from '../../api/api';

const BudgetsView = () => {
  const [tags, setTags] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    color: '#10B981',
    description: ''
  });

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tags');
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
      const tagData = {
        name: formData.name.trim(),
        color: formData.color,
        description: formData.description.trim()
      };

      if (editingTag) {
        await api.put(`/tags/${editingTag.id}`, tagData);
      } else {
        await api.post('/tags', tagData);
      }
      
      loadTags();
      closeDialog();
    } catch (error) {
      console.error('Error detallado:', error);
      // Esto te dirá si el error es 404 (ruta no existe) o 500 (error servidor)
      const serverMsg = error.response?.data?.message || error.message;
      alert(`Error al guardar: ${serverMsg}. Verifica que el backend tenga la ruta /tags.`);
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
    if (!confirm('¿Eliminar esta etiqueta?')) return;
    try {
      await api.delete(`/tags/${id}`);
      loadTags();
    } catch (error) {
      alert('Error al eliminar la etiqueta');
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
          <h1 className="text-3xl font-extrabold text-gray-900">Configuración de Presupuestos</h1>
          <p className="text-gray-600">Gestiona las etiquetas para categorizar tus presupuestos</p>
        </div>
        <div className="flex items-center gap-4">
          <TrendingUp className="w-8 h-8 text-emerald-500" />
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Etiqueta
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-6 border-b pb-4">
          <Tag className="w-5 h-5 text-emerald-500" />
          <h2 className="text-xl font-bold text-gray-800">Etiquetas Disponibles</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500">No hay etiquetas. Crea una para empezar a organizar tus presupuestos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <div 
                key={tag.id}
                className="group flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-md"
                style={{ borderLeft: `6px solid ${tag.color}` }}
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{tag.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1">{tag.description || 'Sin descripción'}</p>
                </div>
                
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(tag)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(tag.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 p-1 rounded border cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows="2"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeDialog} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Guardar
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