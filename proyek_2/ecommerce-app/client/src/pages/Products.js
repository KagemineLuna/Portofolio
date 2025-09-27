// client/src/pages/Products.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import { formatCurrency } from '../utils/helpers';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (categoryFilter) params.category = categoryFilter;
            
            const response = await api.products.getAll(params);
            setProducts(response.products || []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryFilter = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleSubmitSearch = (e) => {
        e.preventDefault();
        loadProducts();
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            try {
                await api.products.delete(product._id);
                loadProducts(); // Refresh the list
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product: ' + error.message);
            }
        }
    };

    const handleFormSave = () => {
        setShowForm(false);
        setEditingProduct(null);
        loadProducts(); // Refresh the list
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    const categories = [...new Set(products.map(p => p.category))];

    if (showForm) {
        return (
            <ProductForm 
                product={editingProduct}
                onSave={handleFormSave}
                onCancel={handleFormCancel}
            />
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Product Management</h2>
                <button className="btn btn-primary" onClick={handleAddProduct}>
                    <i className="fas fa-plus me-2"></i>Add Product
                </button>
            </div>

            {/* Search and Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmitSearch}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                            </div>
                            <div className="col-md-4">
                                <select 
                                    className="form-select"
                                    value={categoryFilter}
                                    onChange={handleCategoryFilter}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-outline-primary w-100">
                                    <i className="fas fa-search me-2"></i>Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="row mb-3">
                        <div className="col">
                            <p className="text-muted">
                                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    
                    {products.length > 0 ? (
                        <div className="row">
                            {products.map(product => (
                                <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 mb-4">
                                    <ProductCard 
                                        product={product}
                                        onEdit={handleEditProduct}
                                        onDelete={handleDeleteProduct}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-box fa-3x text-muted mb-3"></i>
                            <h4>No products found</h4>
                            <p className="text-muted">Try adjusting your search or add a new product.</p>
                            <button className="btn btn-primary" onClick={handleAddProduct}>
                                Add Your First Product
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;