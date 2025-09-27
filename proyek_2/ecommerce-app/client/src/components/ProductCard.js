// client/src/components/ProductCard.js
import React from 'react';
import { formatCurrency } from '../utils/helpers';

const ProductCard = ({ product, onEdit, onDelete }) => {
    const stockStatus = product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'in-stock';
    const statusLabels = {
        'out-of-stock': { text: 'Out of Stock', class: 'danger' },
        'low-stock': { text: 'Low Stock', class: 'warning' },
        'in-stock': { text: 'In Stock', class: 'success' }
    };
    
    const status = statusLabels[stockStatus];

    return (
        <div className="card h-100 product-card">
            <div className="position-relative">
                <img 
                    src={product.image} 
                    className="card-img-top" 
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                <span className={`position-absolute top-0 end-0 badge bg-${status.class} m-2`}>
                    {status.text}
                </span>
            </div>
            
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted small flex-grow-1">
                    {product.description || 'No description available'}
                </p>
                
                <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-primary mb-0">
                            {formatCurrency(product.price)}
                        </span>
                        <small className="text-muted">
                            Stock: {product.stock}
                        </small>
                    </div>
                    
                    <div className="d-flex gap-2">
                        <button 
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() => onEdit(product)}
                        >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                        </button>
                        <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => onDelete(product)}
                        >
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;