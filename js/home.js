// Import necessary modules (assuming these are defined elsewhere)
// For example:
// import { ProductsAPI } from './products-api.js';
// import { CategoriesAPI } from './categories-api.js';

// If the above imports are not used, you can define placeholder objects:
const ProductsAPI = {
    getAll: async () => {
        // Replace with actual API call or mock data
        return [];
    },
    getById: async (id) => {
        // Replace with actual API call or mock data
        return {};
    }
};

const CategoriesAPI = {
    getAll: async () => {
        // Replace with actual API call or mock data
        return [];
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load products from API
        await loadFeaturedProducts();
        await loadCategories();
        
        // Initialize cart functionality
        initCartButtons();
        updateCartCount();
        
        // Initialize search functionality
        initSearch();
    } catch (error) {
        console.error('Error initializing home page:', error);
    }
});

// Function to load featured products
async function loadFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (!featuredProductsContainer) return;
    
    try {
        // Show loading state
        featuredProductsContainer.innerHTML = '<div class="loading">Loading products...</div>';
        
        // Fetch products from API
        const products = await ProductsAPI.getAll();
        
        // Clear loading state
        featuredProductsContainer.innerHTML = '';
        
        // Display products
        products.forEach(product => {
            const productCard = createProductCard(product);
            featuredProductsContainer.appendChild(productCard);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        featuredProductsContainer.innerHTML = '<div class="error">Failed to load products. Please try again later.</div>';
    }
}

// Function to create a product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Calculate discount percentage if applicable
    let discountBadge = '';
    if (product.discountPrice && product.price > product.discountPrice) {
        const discountPercentage = Math.round((product.price - product.discountPrice) / product.price * 100);
        discountBadge = `<div class="discount-badge">-${discountPercentage}%</div>`;
    }
    
    // Format price display
    const priceDisplay = product.discountPrice 
        ? `<span class="original-price">₹${product.price.toLocaleString()}</span> ₹${product.discountPrice.toLocaleString()}`
        : `₹${product.price.toLocaleString()}`;
    
    card.innerHTML = `
        ${discountBadge}
        <div class="product-image">
            <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${priceDisplay}</p>
            <div class="product-actions">
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="view-details-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Function to load categories
async function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;
    
    try {
        // Show loading state
        categoriesContainer.innerHTML = '<div class="loading">Loading categories...</div>';
        
        // Fetch categories from API
        const categories = await CategoriesAPI.getAll();
        
        // Clear loading state
        categoriesContainer.innerHTML = '';
        
        // Display categories
        categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-icon">
                    <i class="fas fa-capsules"></i>
                </div>
                <h3>${category.name}</h3>
                <p>${category.count} Products</p>
            `;
            
            categoriesContainer.appendChild(categoryCard);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesContainer.innerHTML = '<div class="error">Failed to load categories. Please try again later.</div>';
    }
}

// Function to initialize cart buttons
function initCartButtons() {
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
    
    // Add event listeners to "View Details" buttons
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            window.location.href = `product-details.html?id=${productId}`;
        });
    });
}

// Function to add a product to the cart
async function addToCart(productId) {
    try {
        // Get product details from API
        const product = await ProductsAPI.getById(productId);
        
        // Get current cart from localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product is already in cart
        const existingProductIndex = cart.findIndex(item => item.id === productId);
        
        if (existingProductIndex !== -1) {
            // Product already in cart, increase quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // Add new product to cart
            cart.push({
                id: productId,
                name: product.name,
                price: product.discountPrice || product.price,
                image: product.image || 'images/placeholder.jpg',
                quantity: 1
            });
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show success notification
        showNotification('Product added to cart!', 'success');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        showNotification('Failed to add product to cart. Please try again.', 'error');
    }
}

// Function to update cart count
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElement.textContent = totalItems;
    
    // Show/hide the count based on whether there are items in the cart
    if (totalItems > 0) {
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// Function to initialize search functionality
function initSearch() {
    const searchForm = document.getElementById('search-form');
    if (!searchForm) return;
    
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const searchInput = document.getElementById('search-input');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            window.location.href = `search-results.html?q=${encodeURIComponent(searchTerm)}`;
        }
    });
}

// Function to show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add event listener to close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.remove();
    });
    
    // Automatically remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}