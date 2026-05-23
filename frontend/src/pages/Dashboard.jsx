import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Tags, AlertTriangle, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center' }}><Loader2 className="loader" /></div>;

  return (
    <div>
      <div className="page-header">
        <h2>Overview</h2>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <h3>Total Products</h3>
            <p>{stats?.totalProducts || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon success">
            <Tags size={24} />
          </div>
          <div className="stat-details">
            <h3>Categories</h3>
            <p>{stats?.totalCategories || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-details">
            <h3>Low Stock Alerts</h3>
            <p>{stats?.lowStockItems || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
