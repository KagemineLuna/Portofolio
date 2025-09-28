// client/src/services/api.js
const API_BASE = '/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };
        
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }
    
    // Product API methods
    products = {
        getAll: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return this.request(`/products?${queryString}`);
        },
        
        getById: (id) => this.request(`/products/${id}`),
        
        create: (productData) => this.request('/products', {
            method: 'POST',
            body: productData,
        }),
        
        update: (id, productData) => this.request(`/products/${id}`, {
            method: 'PUT',
            body: productData,
        }),
        
        delete: (id) => this.request(`/products/${id}`, {
            method: 'DELETE',
        }),
        
        getStats: () => this.request('/products/stats'),
    };
    
    // Order API methods
    orders = {
        getAll: () => this.request('/orders'),
        
        create: (orderData) => this.request('/orders', {
            method: 'POST',
            body: orderData,
        }),
        
        updateStatus: (id, status) => this.request(`/orders/${id}`, {
            method: 'PUT',
            body: { status },
        }),
        
        getStats: () => this.request('/orders/stats/overview'),
    };
}

export default new ApiService();
