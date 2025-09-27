// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: { total: 0, lowStock: 0, totalValue: 0 },
        orders: { total: 0, pending: 0, revenue: 0 }
    });
    const [recentProducts, setRecentProducts] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [productStats, orderStats, products, orders] = await Promise.all([
                api.products.getStats(),
                api.orders.getStats(),
                api.products.getAll({ limit: 5 }),
                api.orders.getAll()
            ]);
            
            setStats({
                products: productStats.overview,
                orders: orderStats.overview
            });
            
            setRecentProducts(products.products || []);
            setRecentOrders(orders.slice(0, 5) || []);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
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
            <h2 className="h3 mb-4">Dashboard Overview</h2>
            
            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Products
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {stats.products.totalProducts}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-box fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Total Revenue
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {formatCurrency(stats.orders.totalRevenue)}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-warning shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                        Pending Orders
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {stats.orders.pendingOrders}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-shopping-cart fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-info shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                        Low Stock Items
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {stats.products.lowStock}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-exclamation-triangle fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Recent Products and Orders */}
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Recent Products</h6>
                        </div>
                        <div className="card-body">
                            {recentProducts.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recentProducts.map(product => (
                                        <div key={product._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{product.name}</h6>
                                                <small className="text-muted">{product.category}</small>
                                            </div>
                                            <span className="badge bg-primary rounded-pill">
                                                {formatCurrency(product.price)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No products found</p>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Recent Orders</h6>
                        </div>
                        <div className="card-body">
                            {recentOrders.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {recentOrders.map(order => (
                                        <div key={order._id} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-1">Order #{order.orderNumber}</h6>
                                                <span className={`badge bg-${
                                                    order.status === 'completed' ? 'success' : 
                                                    order.status === 'pending' ? 'warning' : 'secondary'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <small className="text-muted">
                                                {order.customer?.name} • {formatCurrency(order.total)}
                                            </small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No orders found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;