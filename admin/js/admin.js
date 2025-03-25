document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is admin
    const user = JSON.parse(localStorage.getItem('user')) || {};
    if (!user.id || user.role !== 'admin') {
        window.location.href = '../login.html';
        return;
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('user');
            window.location.href = '../login.html';
        });
    }
    
    // Mobile sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            document.querySelector('.main-content').classList.toggle('expanded');
        });
    }
    
    // Dropdown toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.nextElementSibling.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });
    
    // Initialize admin data
    initAdminData();
});

// Function to initialize admin data (for demo purposes)
function initAdminData() {
    // Sample data for admin panel
    const adminData = {
        products: [
            {
                id: '1',
                name: 'Quantum Healing Capsules',
                price: 2999,
                discountPrice: 2499,
                image: '../images/placeholder.jpg',
                category: 'nano-medicine',
                description: 'Advanced nano-technology capsules that target cellular repair at the quantum level.',
                stock: 150,
                sold: 75
            },
            {
                id: '2',
                name: 'Neuro-Enhancer Chip',
                price: 12999,
                discountPrice: 9999,
                image: '../images/placeholder.jpg',
                category: 'neural',
                description: 'Cutting-edge neural interface chip that enhances cognitive functions and memory.',
                stock: 50,
                sold: 30
            },
            {
                id: '3',
                name: 'Nano-Bot Immunity Boosters',
                price: 4999,
                image: '../images/placeholder.jpg',
                category: 'nano-medicine',
                description: 'Microscopic robots that patrol your bloodstream, eliminating pathogens and boosting immunity.',
                stock: 200,
                sold: 120
            },
            {
                id: '4',
                name: 'Genetic Repair Serum',
                price: 3999,
                discountPrice: 3499,
                image: '../images/placeholder.jpg',
                category: 'gene-therapy',
                description: 'Advanced serum that repairs damaged DNA and reverses genetic aging markers.',
                stock: 100,
                sold: 65
            }
        ],
        categories: [
            { id: 'nano-medicine', name: 'Nano Medicine', count: 25 },
            { id: 'gene-therapy', name: 'Gene Therapy', count: 18 },
            { id: 'bionic', name: 'Bionic Enhancements', count: 12 },
            { id: 'neural', name: 'Neural Implants', count: 15 },
            { id: 'cryogenics', name: 'Cryogenics', count: 8 },
            { id: 'anti-aging', name: 'Anti-Aging', count: 20 }
        ],
        orders: [
            { id: 'ORD001', customer: 'John Doe', date: '2023-06-15', amount: 4998, status: 'completed' },
            { id: 'ORD002', customer: 'Jane Smith', date: '2023-06-16', amount: 9999, status: 'processing' },
            { id: 'ORD003', customer: 'Robert Johnson', date: '2023-06-17', amount: 3499, status: 'pending' },
            { id: 'ORD004', customer: 'Emily Davis', date: '2023-06-18', amount: 7498, status: 'completed' },
            { id: 'ORD005', customer: 'Michael Brown', date: '2023-06-19', amount: 4999, status: 'cancelled' }
        ],
        prescriptions: [
            { id: 'PRE001', customer: 'John Doe', date: '2023-06-15', status: 'verified' },
            { id: 'PRE002', customer: 'Jane Smith', date: '2023-06-16', status: 'pending' },
            { id: 'PRE003', customer: 'Robert Johnson', date: '2023-06-17', status: 'processing' },
            { id: 'PRE004', customer: 'Emily Davis', date: '2023-06-18', status: 'verified' },
            { id: 'PRE005', customer: 'Michael Brown', date: '2023-06-19', status: 'rejected' }
        ],
        customers: [
            { id: 'CUS001', name: 'John Doe', email: 'john@example.com', orders: 5, totalSpent: 24990 },
            { id: 'CUS002', name: 'Jane Smith', email: 'jane@example.com', orders: 3, totalSpent: 15997 },
            { id: 'CUS003', name: 'Robert Johnson', email: 'robert@example.com', orders: 2, totalSpent: 6998 },
            { id: 'CUS004', name: 'Emily Davis', email: 'emily@example.com', orders: 4, totalSpent: 19996 },
            { id: 'CUS005', name: 'Michael Brown', email: 'michael@example.com', orders: 1, totalSpent: 4999 }
        ]
    };
    
    // Store admin data in localStorage (for demo purposes)
    if (!localStorage.getItem('adminData')) {
        localStorage.setItem('adminData', JSON.stringify(adminData));
    }
}

// Function to get admin data
function getAdminData() {
    return JSON.parse(localStorage.getItem('adminData')) || {};
}

// Function to update admin data
function updateAdminData(data) {
    localStorage.setItem('adminData', JSON.stringify(data));
}