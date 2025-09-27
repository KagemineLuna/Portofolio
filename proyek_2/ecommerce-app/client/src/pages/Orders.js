// client/src/pages/Orders.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const ordersData = await api.orders.getAll();
            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await api.orders.updateStatus(orderId, newStatus);
            loadOrders(); // Refresh orders
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'processing': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Order Management</h2>
                <div className="btn-group">
                    <button className="btn btn-outline-primary">
                        <i className="fas fa-download me-2"></i>Export
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="card">
                <div className="card-body p-0">
                    {orders.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td>
                                                <strong>{order.orderNumber}</strong>
                                            </td>
                                            <td>
                                                <div>
                                                    <div>{order.customer?.name}</div>
                                                    <small className="text-muted">{order.customer?.email}</small>
                                                </div>
                                            </td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>{formatCurrency(order.total)}</td>
                                            <td>
                                                <span className={`badge bg-${getStatusBadgeClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm">
                                                    <button 
                                                        className="btn btn-outline-primary"
                                                        onClick={() => setSelectedOrder(order)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                    <div className="btn-group">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-outline-secondary dropdown-toggle"
                                                            data-bs-toggle="dropdown"
                                                        >
                                                            Status
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusUpdate(order._id, 'pending')}
                                                                >
                                                                    Pending
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusUpdate(order._id, 'processing')}
                                                                >
                                                                    Processing
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusUpdate(order._id, 'completed')}
                                                                >
                                                                    Completed
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button 
                                                                    className="dropdown-item"
                                                                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                                                >
                                                                    Cancelled
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                            <h4>No orders found</h4>
                            <p className="text-muted">Orders will appear here when customers make purchases.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order Details - {selectedOrder.orderNumber}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setSelectedOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Customer Information</h6>
                                        <p>
                                            <strong>Name:</strong> {selectedOrder.customer?.name}<br/>
                                            <strong>Email:</strong> {selectedOrder.customer?.email}<br/>
                                            <strong>Phone:</strong> {selectedOrder.customer?.phone || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Order Information</h6>
                                        <p>
                                            <strong>Date:</strong> {formatDate(selectedOrder.createdAt)}<br/>
                                            <strong>Status:</strong> 
                                            <span className={`badge bg-${getStatusBadgeClass(selectedOrder.status)} ms-2`}>
                                                {selectedOrder.status}
                                            </span><br/>
                                            <strong>Total:</strong> {formatCurrency(selectedOrder.total)}
                                        </p>
                                    </div>
                                </div>
                                
                                <h6>Order Items</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items?.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{formatCurrency(item.price)}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{formatCurrency(item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;