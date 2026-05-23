import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2, Trash2, Edit2, Plus, Search } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortField, setSortField] = useState('createdAt');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', quantity: '', sku: '', supplierName: '', description: ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, sortField]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products?search=${search}&category=${categoryFilter}&sort=${sortField}`);
      setProducts(data);
    } catch (error) {
      showMessage('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (product = null) => {
    if (product) {
      setIsEditing(true);
      setCurrentId(product._id);
      setFormData({
        name: product.name,
        category: product.category?._id || '',
        price: product.price,
        quantity: product.quantity,
        sku: product.sku,
        supplierName: product.supplierName || '',
        description: product.description || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ name: '', category: '', price: '', quantity: '', sku: '', supplierName: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/products/${currentId}`, formData);
        showMessage('success', 'Product updated');
      } else {
        await api.post('/products', formData);
        showMessage('success', 'Product added');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        showMessage('success', 'Product deleted');
        fetchProducts();
      } catch (error) {
        showMessage('error', 'Failed to delete product');
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={() => openModal()} style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {message.text && (
        <div style={{ 
          padding: '1rem', borderRadius: 6, marginBottom: '1rem',
          background: message.type === 'error' ? '#fee2e2' : '#d1fae5',
          color: message.type === 'error' ? '#991b1b' : '#065f46'
        }}>
          {message.text}
        </div>
      )}

      <div className="toolbar" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', flex: 1, minWidth: '200px' }}>
          <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%' }}
          />
        </div>
        
        <select className="form-input" style={{ width: 'auto' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <select className="form-input" style={{ width: 'auto' }} value={sortField} onChange={(e) => setSortField(e.target.value)}>
          <option value="createdAt">Date Added</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="quantityLow">Quantity: Low to High</option>
          <option value="quantityHigh">Quantity: High to Low</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="loader" /></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || '-'}</td>
                  <td>${product.price}</td>
                  <td>
                    <span className={`badge ${product.quantity < 5 ? 'badge-danger' : 'badge-success'}`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-icon" onClick={() => openModal(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No products found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
              {isEditing ? 'Edit Product' : 'Add Product'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>SKU</label>
                  <input type="text" className="form-input" name="sku" value={formData.sku} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-input" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Supplier</label>
                  <input type="text" className="form-input" name="supplierName" value={formData.supplierName} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Price</label>
                  <input type="number" step="0.01" className="form-input" name="price" value={formData.price} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input type="number" className="form-input" name="quantity" value={formData.quantity} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Description</label>
                <textarea className="form-input" name="description" rows="2" value={formData.description} onChange={handleInputChange} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn" style={{ background: '#e5e7eb', color: '#374151' }} onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
                  {isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
