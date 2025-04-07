// src/pages/Layout.jsx
import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../index.css'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  

  return (
    <div className="d-flex">
      <Sidebar isOpen={sidebarOpen} />

      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '230px' : '60px',
          transition: 'margin-left 0.3s ease',
          padding: '20px',
          width: '100%',
        }}
      >
        <button
  className="btn btn-dark-blue mb-2"
  onClick={toggleSidebar}
>
          {sidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>

        <Outlet />
      </div>
     
    </div>
  );
};

export default Layout;
