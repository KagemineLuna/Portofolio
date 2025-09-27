// client/src/App.js
import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Products />;
      case 'orders': return <Orders />;
      case 'analytics': return <Analytics />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 sidebar p-0">
            <div className="p-3 text-center">
              <h4 className="text-white mb-0">
                <i className="fas fa-store me-2"></i>
                Admin Panel
              </h4>
            </div>
            
            <nav className="nav flex-column p-2">
              <button 
                className={`nav-link btn btn-link text-decoration-none text-start ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <i className="fas fa-tachometer-alt me-2"></i>
                Dashboard
              </button>
              
              <button 
                className={`nav-link btn btn-link text-decoration-none text-start ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <i className="fas fa-box me-2"></i>
                Products
              </button>
              
              <button 
                className={`nav-link btn btn-link text-decoration-none text-start ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                Orders
              </button>
              
              <button 
                className={`nav-link btn btn-link text-decoration-none text-start ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <i className="fas fa-chart-bar me-2"></i>
                Analytics
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-md-9 col-lg-10 main-content">
            <header className="bg-white shadow-sm p-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0 text-capitalize text-primary">{activeTab}</h2>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-3">
                    <i className="fas fa-user me-1"></i>
                    Admin User
                  </span>
                  <button className="btn btn-outline-primary btn-sm">
                    <i className="fas fa-cog"></i>
                  </button>
                </div>
              </div>
            </header>

            <main className="p-4">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;