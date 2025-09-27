// client/src/components/ProductForm.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '',
        image: '',
        stock: '',
        tags: '',
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                price: product.price || '',
                description: product.description || '',
                category: product.category || '',
                image: product.image || '',
                stock: product.stock || '',
                tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            };
            
            if (product) {
                await api.products.update(product._id, productData);
            } else {
                await api.products.create(productData);
            }
            
            onSave();
        } catch (error) {
            console.error('Error saving product:', error);
            setErrors({ submit: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h5>
            </div>
            <div className="card-body">
                {errors.submit && (
                    <div className="alert alert-danger">{errors.submit}</div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Product Name *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Price ($) *</label>
                            <input
                                type="number"
                                step="0.01"
                                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                            />
                            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Product description"
                        />
                    </div>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Category *</label>
                            <input
                                type="text"
                                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g., Electronics, Clothing"
                            />
                            {errors.category && <div className="invalid-feedback">{errors.category}</div>}
                        </div>
                        
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Stock Quantity *</label>
                            <input
                                type="number"
                                className={`form-control ${errors.stock ? 'is-invalid' : ''}`}
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="0"
                            />
                            {errors.stock && <div className="invalid-feedback">{errors.stock}</div>}
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Image URL</label>
                        <input
                            type="url"
                            className="form-control"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="tag1, tag2, tag3"
                        />
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;