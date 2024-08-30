import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './component/dashboard';
import Login from './component/login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = (username) => {
    localStorage.setItem('username', username);
    setIsAuthenticated(true); 
  };

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) {
      setIsAuthenticated(true); 
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={<Login onLoginSuccess={handleLoginSuccess} />}
      />
    </Routes>
  );
};

export default App;