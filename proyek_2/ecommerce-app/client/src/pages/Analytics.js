// client/src/pages/Analytics.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Analytics = () => {
    const [productStats, setProductStats] = useState(null);
    const [orderStats, setOrderStats] = useState(null);
    const [timeRange, setTimeRange] = useState('7days');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAnalyticsData();
    }, [timeRange]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            const [productData, orderData] = await Promise.all([
                api.products.getStats(),
                api.orders.getStats()
            ]);
            
            setProductStats(productData);
            setOrderStats(orderData);
        } catch (error) {
            console.error('Error loading analytics data:', error);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Sales Analytics</h2>
                <select 
                    className="form-select w-auto"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                </select>
            </div>

            {/* Analytics Overview */}
            <div className="row mb-4">
                <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-left-primary shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                        Total Revenue
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {formatCurrency(orderStats?.overview?.totalRevenue || 0)}
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
                    <div className="card border-left-success shadow h-100 py-2">
                        <div className="card-body">
                            <div className="row no-gutters align-items-center">
                                <div className="col mr-2">
                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                        Total Orders
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {orderStats?.overview?.totalOrders || 0}
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
                                        Avg. Order Value
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {formatCurrency(
                                            (orderStats?.overview?.totalRevenue || 0) / 
                                            Math.max(orderStats?.overview?.totalOrders || 1, 1)
                                        )}
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-chart-line fa-2x text-gray-300"></i>
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
                                        Conversion Rate
                                    </div>
                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                        {(((orderStats?.overview?.totalOrders || 0) / 100) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="col-auto">
                                    <i className="fas fa-percentage fa-2x text-gray-300"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Detailed Analytics */}
            <div className="row">
                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Product Categories</h6>
                        </div>
                        <div className="card-body">
                            {productStats?.categories && productStats.categories.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {productStats.categories.map(category => (
                                        <div key={category._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <span>{category._id || 'Uncategorized'}</span>
                                            <span className="badge bg-primary rounded-pill">{category.count}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No category data available</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 mb-4">
                    <div className="card shadow">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-primary">Recent Sales Activity</h6>
                        </div>
                        <div className="card-body">
                            {orderStats?.daily && orderStats.daily.length > 0 ? (
                                <div className="list-group list-group-flush">
                                    {orderStats.daily.map(day => (
                                        <div key={day._id} className="list-group-item">
                                            <div className="d-flex justify-content-between">
                                                <strong>{day._id}</strong>
                                                <span>{formatCurrency(day.revenue)}</span>
                                            </div>
                                            <small className="text-muted">{day.orders} orders</small>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted">No recent sales data</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Overview */}
            <div className="card shadow mb-4">
                <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Inventory Overview</h6>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <div className="border rounded p-3">
                                <h3 className="text-primary">{productStats?.overview?.totalProducts || 0}</h3>
                                <p className="mb-0">Total Products</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="border rounded p-3">
                                <h3 className="text-warning">{productStats?.overview?.lowStock || 0}</h3>
                                <p className="mb-0">Low Stock Items</p>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <div className="border rounded p-3">
                                <h3 className="text-success">
                                    {formatCurrency(productStats?.overview?.totalValue || 0)}
                                </h3>
                                <p className="mb-0">Total Inventory Value</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;