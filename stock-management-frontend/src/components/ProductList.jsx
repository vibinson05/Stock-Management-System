import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import { CSVLink } from 'react-csv';
import axios from 'axios';
import { Layer } from 'recharts';
import Layout from '../pages/Layout';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('https://stock-management-system-mhsp.onrender.com/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching:', err));
  };

  const handleFormSubmit = (product) => {
    if (product === null) {
      setEditingProduct(null);
      return;
    }

    if (editingProduct) {
      axios.put(`https://stock-management-system-mhsp.onrender.com/products/${editingProduct.id}`, product)
        .then(fetchProducts)
        .finally(() => setEditingProduct(null));
    } else {
      axios.post('https://stock-management-system-mhsp.onrender.com/products', product)
        .then(fetchProducts);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleDelete = (id) => {
    axios.delete(`https://stock-management-system-mhsp.onrender.com/products/${id}`)
      .then(fetchProducts);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  return (
    <div className="d-flex">
    {/* Sidebar open by default */}
    <Layout isOpen={true} />


    <div className="container  mt-5 ">
      <div className="row">
        {/* Left Column - Product Form */}
        <div className="col-md-5">
          <ProductForm onSubmit={handleFormSubmit} initialData={editingProduct} />
        </div>

        {/* Right Column - Table with Sort & CSV */}
        <div className="col-md-7">
          <div className="d-flex mb-3 gap-2 align-items-center">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="name">Name (A-Z)</option>
              <option value="category">Category (A-Z)</option>
            </select>

            <CSVLink
              data={sortedProducts}
              filename="products.csv"
              className="btn btn-success"
            >
              Export CSV
            </CSVLink>
          </div>

          <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}</td>
                    <td>{product.stock_quantity}</td>
                    <td>{product.items_sold || 0}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sortedProducts.length === 0 && <p className="text-center mt-3">No products found</p>}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProductList;
