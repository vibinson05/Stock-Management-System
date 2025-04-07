import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock_quantity, setStockQuantity] = useState('');
  const [items_sold, setItemsSold] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || '');
      setPrice(initialData.price || '');
      setStockQuantity(initialData.stock_quantity || '');
      setItemsSold(initialData.items_sold || '');
      setDescription(initialData.description || '');
    } else {
      setName('');
      setCategory('');
      setPrice('');
      setStockQuantity('');
      setItemsSold('');
      setDescription('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const product = {
      name,
      category,
      price,
      stock_quantity,
      items_sold,
      description
    };

    onSubmit(product);

    // Clear form after submission if not editing
    if (!initialData) {
      setName('');
      setCategory('');
      setPrice('');
      setStockQuantity('');
      setItemsSold('');
      setDescription('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-sm bg-light"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <h5 className="mb-2 text-primary">{initialData ? '✏️ Edit Product' : '➕ Add Product'}</h5>

        <div className="mb-3">
          <label className="form-label fw-semibold">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Category</label>
          <input
            type="text"
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Stock Quantity</label>
          <input
            type="number"
            className="form-control"
            value={stock_quantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Items Sold</label>
          <input
            type="number"
            className="form-control"
            value={items_sold}
            onChange={(e) => setItemsSold(e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-2">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            className="form-control"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)"
          ></textarea>
        </div>
      </div>

      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-success px-4">
          {initialData ? 'Update' : 'Add'}
        </button>
        {initialData && (
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={() => onSubmit(null)}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm; 