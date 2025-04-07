import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { CSVLink } from 'react-csv';
import Sidebar from '../components/Sidebar'; // make sure this path is correct
import Layout from './Layout';

const SalesSummary = () => {
  const [products, setProducts] = useState([]);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    axios.get('https://stock-management-system-mhsp.onrender.com/products')
      .then(res => {
        setProducts(res.data);

        let totalItems = 0;
        let totalRev = 0;

        res.data.forEach(product => {
          totalItems += product.items_sold || 0;
          totalRev += (product.items_sold || 0) * product.price;
        });

        setTotalItemsSold(totalItems);
        setTotalRevenue(totalRev);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const filtered = products.filter(prod =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prod.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'sold') return b.items_sold - a.items_sold;
    if (sortBy === 'revenue') return (b.items_sold * b.price) - (a.items_sold * a.price);
    return 0;
  });

  const chartData = sorted.map(prod => ({
    name: prod.name,
    itemsSold: prod.items_sold || 0,
    revenue: (prod.items_sold || 0) * prod.price,
  }));

  const selectedDataKey = sortBy === 'revenue' ? 'revenue' : 'itemsSold';
  const selectedLabel = sortBy === 'revenue' ? 'Revenue' : 'Items Sold';
  const selectedColor = sortBy === 'revenue' ? '#82ca9d' : '#8884d8';

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Layout isOpen={true} />

      {/* Main Content */}
      <div className="container-fluid p-4" style={{ marginLeft: '5px' }}>
        <h3 className="mb-3 text-center">💰 Sales Summary</h3>

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
              <option value="sold">Items Sold</option>
              <option value="revenue">Revenue</option>
            </select>
          </div>
          <div className="col-md-3 mb-2">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => setChartType(prev => (prev === 'bar' ? 'line' : 'bar'))}
            >
              Toggle to {chartType === 'bar' ? 'Line' : 'Bar'} Chart
            </button>
          </div>
          <div className="col-md-3 mb-2">
            <CSVLink data={sorted} filename="sales_summary.csv" className="btn btn-success w-100">
              Export CSV
            </CSVLink>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="card text-white bg-success mb-3">
              <div className="card-header text-center">Total Items Sold</div>
              <div className="card-body">
                <h5 className="card-title text-center">{totalItemsSold}</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card text-white bg-primary mb-3">
              <div className="card-header text-center">Total Revenue</div>
              <div className="card-body">
                <h5 className="card-title text-center">₹{totalRevenue.toFixed(2)}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Table */}
        <div className="row">
          {/* Chart */}
          <div className="col-md-6 mb-4" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={selectedDataKey} fill={selectedColor} name={selectedLabel} />
                </BarChart>
              ) : (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={selectedDataKey} stroke={selectedColor} name={selectedLabel} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="col-md-6 mb-4" style={{ height: '400px' }}>
            <div className="table-responsive h-100 overflow-auto">
              <table className="table table-bordered table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Total Stock</th>
                    <th>Items Sold</th>
                    <th>Price</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map(prod => (
                    <tr key={prod.id}>
                      <td>{prod.name}</td>
                      <td>{prod.category}</td>
                      <td>{prod.stock_quantity}</td>
                      <td>{prod.items_sold || 0}</td>
                      <td>₹{prod.price}</td>
                      <td>₹{((prod.items_sold || 0) * prod.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {sorted.length === 0 && <p className="text-center mt-3">No products available</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSummary;
