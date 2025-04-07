import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { CSVLink } from 'react-csv';
import Layout from './Layout';

const StockPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    axios.get('http://localhost:5000/products')
      .then(res => {
        const updated = res.data.map(prod => ({
          ...prod,
          available_stock: prod.stock_quantity - (prod.items_sold || 0),
        }));
        setProducts(updated);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'stock') return b.stock_quantity - a.stock_quantity;
    if (sortBy === 'sold') return b.items_sold - a.items_sold;
    if (sortBy === 'available') return b.available_stock - a.available_stock;
    return 0;
  });

  return (
    <div className="d-flex">
        
        
      <Layout isOpen={true} />
    <div className="container-fluid mt-4">
      <h3 className="mb-4 text-center">📊 Stock Overview</h3>

      {/* Controls */}
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or category"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="stock">Total Stock</option>
            <option value="sold">Items Sold</option>
            <option value="available">Available Stock</option>
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <button className="btn btn-outline-primary w-100 text-blue" onClick={() => setChartType(prev => prev === 'line' ? 'bar' : 'line')}>
            Toggle to {chartType === 'line' ? 'Bar' : 'Line'} Chart
          </button>
        </div>
        <div className="col-md-3 mb-2">
          <CSVLink data={sorted} filename="stock_data.csv" className="btn btn-success w-100">
            Export CSV
          </CSVLink>
        </div>
      </div>

      <div className="row">
        {/* Chart */}
        <div className="col-md-6 mb-4" style={{ height: '500px' }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={sorted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {sortBy === 'stock' && <Line type="monotone" dataKey="stock_quantity" stroke="#007bff" name="Total Stock" />}
                {sortBy === 'sold' && <Line type="monotone" dataKey="items_sold" stroke="#ffc107" name="Items Sold" />}
                {(sortBy === 'available' || sortBy === '') && (
                  <Line type="monotone" dataKey="available_stock" stroke="#28a745" name="Available Stock" />
                )}
              </LineChart>
            ) : (
              <BarChart data={sorted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {sortBy === 'stock' && <Bar dataKey="stock_quantity" fill="#007bff" name="Total Stock" />}
                {sortBy === 'sold' && <Bar dataKey="items_sold" fill="#ffc107" name="Items Sold" />}
                {(sortBy === 'available' || sortBy === '') && (
                  <Bar dataKey="available_stock" fill="#28a745" name="Available Stock" />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="col-md-6">
          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Total Stock</th>
                  <th>Items Sold</th>
                  <th>Available Stock</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.name}</td>
                    <td>{prod.category}</td>
                    <td>{prod.stock_quantity}</td>
                    <td>{prod.items_sold || 0}</td>
                    <td>{prod.available_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sorted.length === 0 && <p className="text-center mt-3">No products found</p>}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StockPage;
