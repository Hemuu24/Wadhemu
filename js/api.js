// API base URL - JSON Server runs on port 3000 by default
const API_URL = 'http://localhost:3000';

// Generic fetch function with error handling
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        throw error;
    }
}

// Products API
const ProductsAPI = {
    // Get all products
    getAll: async () => {
        return await fetchAPI('products');
    },
    
    // Get product by ID
    getById: async (id) => {
        return await fetchAPI(`products/${id}`);
    },
    
    // Create new product
    create: async (product) => {
        return await fetchAPI('products', {
            method: 'POST',
            body: JSON.stringify(product)
        });
    },
    
    // Update product
    update: async (id, product) => {
        return await fetchAPI(`products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product)
        });
    },
    
    // Delete product
    delete: async (id) => {
        return await fetchAPI(`products/${id}`, {
            method: 'DELETE'
        });
    }
};

// Categories API
const CategoriesAPI = {
    // Get all categories
    getAll: async () => {
        return await fetchAPI('categories');
    },
    
    // Get category by ID
    getById: async (id) => {
        return await fetchAPI(`categories/${id}`);
    }
};

// Users API
const UsersAPI = {
    // Login
    login: async (email, password) => {
        try {
            const users = await fetchAPI(`users?email=${email}`);
            
            if (!users || users.length === 0) {
                throw new Error('User not found');
            }
            
            const user = users[0];
            
            if (user.password !== password) {
                throw new Error('Invalid password');
            }
            
            // Remove password before returning
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },
    
    // Register
    register: async (user) => {
        // Check if email already exists
        const existingUsers = await fetchAPI(`users?email=${user.email}`);
        
        if (existingUsers && existingUsers.length > 0) {
            throw new Error('Email already registered');
        }
        
        return await fetchAPI('users', {
            method: 'POST',
            body: JSON.stringify({
                ...user,
                createdAt: new Date().toISOString()
            })
        });
    }
};

// Orders API
const OrdersAPI = {
    // Get all orders
    getAll: async () => {
        return await fetchAPI('orders');
    },
    
    // Get order by ID
    getById: async (id) => {
        return await fetchAPI(`orders/${id}`);
    },
    
    // Get orders by user ID
    getByUserId: async (userId) => {
        return await fetchAPI(`orders?userId=${userId}`);
    },
    
    // Create new order
    create: async (order) => {
        return await fetchAPI('orders', {
            method: 'POST',
            body: JSON.stringify({
                ...order,
                date: new Date().toISOString()
            })
        });
    },
    
    // Update order status
    updateStatus: async (id, status) => {
        // First get the current order
        const order = await fetchAPI(`orders/${id}`);
        
        // Then update only the status
        return await fetchAPI(`orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};

// Prescriptions API
const PrescriptionsAPI = {
    // Get all prescriptions
    getAll: async () => {
        return await fetchAPI('prescriptions');
    },
    
    // Get prescription by ID
    getById: async (id) => {
        return await fetchAPI(`prescriptions/${id}`);
    },
    
    // Get prescriptions by user ID
    getByUserId: async (userId) => {
        return await fetchAPI(`prescriptions?userId=${userId}`);
    },
    
    // Create new prescription
    create: async (prescription) => {
        return await fetchAPI('prescriptions', {
            method: 'POST',
            body: JSON.stringify({
                ...prescription,
                date: new Date().toISOString()
            })
        });
    },
    
    // Update prescription status
    updateStatus: async (id, status) => {
        return await fetchAPI(`prescriptions/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status })
        });
    }
};

// Make APIs available globally
window.ProductsAPI = ProductsAPI;
window.CategoriesAPI = CategoriesAPI;
window.UsersAPI = UsersAPI;
window.OrdersAPI = OrdersAPI;
window.PrescriptionsAPI = PrescriptionsAPI;