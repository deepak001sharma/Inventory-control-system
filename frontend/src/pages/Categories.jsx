import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Trash2, Plus, AlertCircle } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/categories', { name, description });
      setCategories([...categories, data]);
      setName('');
      setDescription('');
      setSuccess('Category added successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add category');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c._id !== id));
        setSuccess('Category deleted');
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Failed to delete category');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center' }}><Loader2 className="loader" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Categories</h2>
      </div>

      {error && <div className="error-message" style={{ background: '#fee2e2', padding: '1rem', borderRadius: 6 }}>{error}</div>}
      {success && <div style={{ color: '#065f46', background: '#d1fae5', padding: '1rem', borderRadius: 6, marginBottom: '1rem' }}>{success}</div>}

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.description || '-'}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon delete" onClick={() => handleDelete(category._id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ width: '300px' }}>
          <div className="auth-card" style={{ padding: '1.5rem', margin: 0 }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add Category</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
                <Plus size={16} /> Add Category
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
