import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    if (userInfo && token) {
      setUser(JSON.parse(userInfo));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
  const { data } = await axios.post(
    'http://localhost:5000/api/auth/login',
    { email, password }
  );

  localStorage.setItem('userInfo', JSON.stringify(data));
  localStorage.setItem('token', data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  setUser(data);
};
  

 const register = async (username, email, password) => {
  const { data } = await axios.post(
    'http://localhost:5000/api/auth/register',
    { username, email, password }
  );

  localStorage.setItem('userInfo', JSON.stringify(data));
  localStorage.setItem('token', data.token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

  setUser(data);
};

  const logout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
