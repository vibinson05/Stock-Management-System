/// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import ProductList from './components/ProductList';
import StockPage from './pages/StockPage';
import SalesSummary from './pages/SalesSummary';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import './index.css'; 
import DashboardPage from './pages/DashboardPage';

const App = () => {
  return (
    <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<RegisterPage />} />
            <Route path="/Layout" element={<Layout />} />
         
            <Route path="/products" element={<ProductList />} />

        <Route path="/stock" element={<StockPage />} />
        <Route path="/sales-summary" element={<SalesSummary />} />
        <Route path="/dashboard" element={<DashboardPage/>} />
      
    </Routes>
  );
};

export default App;
