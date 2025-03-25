document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is admin
    checkAdminAuth();
    
    try {
        // Load data from API
        await Promise.all([
            loadRecentOrders(),
            loadRecentPrescriptions()
        ]);
        
        // Initialize charts
        initSalesChart();
        initCategoriesChart();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
});

// Function to check if user is admin
function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.role !== 'admin') {
        // Redirect to login page if not admin
        window.location.href = '../login.html';
    }
}

// Mock APIs (replace with actual API calls)
const OrdersAPI = {
    getAll: async () => {
        // Replace with actual API endpoint
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, userId: 101, date: '2024-07-20', total: 150, status: 'pending' },
                    { id: 2, userId: 102, date: '2024-07-21', total: 200, status: 'processing' },
                    { id: 3, userId: 101, date: '2024-07-22', total: 75, status: 'completed' },
                    { id: 4, userId: 103, date: '2024-07-23', total: 300, status: 'pending' },
                    { id: 5, userId: 102, date: '2024-07-24', total: 120, status: 'processing' },
                    { id: 6, userId: 104, date: '2024-07-25', total: 400, status: 'completed' }
                ]);
            }, 500);
        });
    }
};

const PrescriptionsAPI = {
    getAll: async () => {
        // Replace with actual API endpoint
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { id: 1, userId: 201, date: '2024-07-20', status: 'pending' },
                    { id: 2, userId: 202, date: '2024-07-21', status: 'processing' },
                    { id: 3, userId: 201, date: '2024-07-22', status: 'completed' },
                    { id: 4, userId: 203, date: '2024-07-23', status: 'pending' },
                    { id: 5, userId: 202, date: '2024-07-24', status: 'processing' }
                ]);
            }, 500);
        });
    }
};

const CategoriesAPI = {
    getAll: async () => {
        // Replace with actual API endpoint
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    { name: 'Category A', count: 30 },
                    { name: 'Category B', count: 20 },
                    { name: 'Category C', count: 15 },
                    { name: 'Category D', count: 25 },
                    { name: 'Category E', count: 10 }
                ]);
            }, 500);
        });
    }
};

// Function to load recent orders
async function loadRecentOrders() {
    const recentOrdersTable = document.getElementById('recent-orders-table');
    if (!recentOrdersTable) return;

    try {
        // Show loading state
        recentOrdersTable.innerHTML = '<tr><td colspan="6">Loading orders...</td></tr>';
        
        // Fetch orders from API
        const orders = await OrdersAPI.getAll();
        
        // Display only the 5 most recent orders
        const recentOrders = orders.slice(0, 5);
        
        recentOrdersTable.innerHTML = '';
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.userId}</td>
                <td>${formatDate(order.date)}</td>
                <td>₹${order.total.toLocaleString()}</td>
                <td><span class="status ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
                <td>
                    <button class="action-btn view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            recentOrdersTable.appendChild(row);
        });
        
        // Add event listeners to action buttons
        addOrderActionListeners();
    } catch (error) {
        console.error('Error loading orders:', error);
        recentOrdersTable.innerHTML = '<tr><td colspan="6">Error loading orders. Please try again later.</td></tr>';
    }
}

// Function to add event listeners to order action buttons
function addOrderActionListeners() {
    // View order
    document.querySelectorAll('.action-btn.view').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td:first-child').textContent;
            // In a real app, you would show order details in a modal or redirect to order details page
            alert(`View order ${orderId}`);
        });
    });
    
    // Edit order
    document.querySelectorAll('.action-btn.edit').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td:first-child').textContent;
            // In a real app, you would show edit form in a modal or redirect to edit page
            alert(`Edit order ${orderId}`);
        });
    });
    
    // Delete order
    document.querySelectorAll('.action-btn.delete').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td:first-child').textContent;
            // In a real app, you would show confirmation dialog and delete the order
            if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
                alert(`Order ${orderId} deleted`);
            }
        });
    });
}

// Function to load recent prescriptions
async function loadRecentPrescriptions() {
    const recentPrescriptionsTable = document.getElementById('recent-prescriptions-table');
    if (!recentPrescriptionsTable) return;

    try {
        // Show loading state
        recentPrescriptionsTable.innerHTML = '<tr><td colspan="5">Loading prescriptions...</td></tr>';
        
        // Fetch prescriptions from API
        const prescriptions = await PrescriptionsAPI.getAll();
        
        // Display only the 5 most recent prescriptions
        const recentPrescriptions = prescriptions.slice(0, 5);
        
        recentPrescriptionsTable.innerHTML = '';
        
        recentPrescriptions.forEach(prescription => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${prescription.id}</td>
                <td>${prescription.userId}</td>
                <td>${formatDate(prescription.date)}</td>
                <td><span class="status ${prescription.status}">${capitalizeFirstLetter(prescription.status)}</span></td>
                <td>
                    <button class="action-btn view" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" title="Delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            recentPrescriptionsTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading prescriptions:', error);
        recentPrescriptionsTable.innerHTML = '<tr><td colspan="5">Error loading prescriptions. Please try again later.</td></tr>';
    }
}

// Function to initialize sales chart
function initSalesChart() {
    const salesChartCanvas = document.getElementById('sales-chart');
    if (!salesChartCanvas) return;

    // Sample data for the sales chart
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Sales',
                data: [12500, 19250, 15000, 22500, 18750, 24000],
                borderColor: '#00F5A0',
                backgroundColor: 'rgba(0, 245, 160, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Chart configuration
    const config = {
        type: 'line',
        data: salesData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };

    // Create the chart
    new Chart(salesChartCanvas, config);
}

// Function to initialize categories chart
async function initCategoriesChart() {
    const categoriesChartCanvas = document.getElementById('categories-chart');
    if (!categoriesChartCanvas) return;

    try {
        // Fetch categories from API
        const categories = await CategoriesAPI.getAll();
        
        // Prepare data for the chart
        const labels = categories.map(category => category.name);
        const data = categories.map(category => category.count);
        
        // Chart data
        const chartData = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        '#00F5A0',
                        '#00D9F5',
                        '#FF4FCD',
                        '#FFC107',
                        '#9C27B0',
                        '#3F51B5'
                    ],
                    borderWidth: 0
                }
            ]
        };
        
        // Chart configuration
        const config = {
            type: 'doughnut',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            padding: 10,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        };
        
        // Create the chart
        new Chart(categoriesChartCanvas, config);
    } catch (error) {
        console.error('Error loading categories for chart:', error);
    }
}

// Helper function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}