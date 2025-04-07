import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBoxes, FaChartBar, FaCubes } from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClass = (path) =>
    `d-flex align-items-center nav-link px-3 py-2 mb-2 rounded ${
      location.pathname === path
        ? 'bg-gradient text-white fw-bold'
        : 'text-light sidebar-link'
    }`;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div
      className="vh-100 p-3 d-flex flex-column justify-content-between sidebar-container"
      style={{
        width: isOpen ? '240px' : '0',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 1000,
        background: 'linear-gradient(to bottom, #1e1e2f, #2b2b40)',
      }}
    >
      {isOpen && (
        <>
          {/* Top: Brand and Nav Links */}
          <div>
            <h4 className="text-center text-white fw-bold mb-4">StockTrack</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>
                  <FaTachometerAlt className="me-2" />
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className={getLinkClass('/products')}>
                  <FaBoxes className="me-2" />
                  Manage Products
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/stock" className={getLinkClass('/stock')}>
                  <FaCubes className="me-2" />
                  Available Stock
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sales-summary" className={getLinkClass('/sales-summary')}>
                  <FaChartBar className="me-2" />
                  Sales Summary
                </Link>
              </li>
            </ul>
          </div>

          {/* Bottom: Logout Button */}
          <div className="mt-auto">
            <button
              className="btn btn-outline-danger w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
