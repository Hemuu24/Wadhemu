document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCartItems();
    
    // Initialize checkout button
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }
});

// Function to load cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummaryContainer = document.getElementById('cart-summary');
    
    if (!cartItemsContainer || !cartSummaryContainer) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        // Cart is empty
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any products to your cart yet.</p>
                <a href="index.html" class="btn">Continue Shopping</a>
            </div>
        `;
        
        cartSummaryContainer.style.display = 'none';
        return;
    }
    
    // Display cart items
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="cart-item-price">₹${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn decrease" data-product-id="${item.id}">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn increase" data-product-id="${item.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">
                ₹${(item.price * item.quantity).toLocaleString()}
            </div>
            <button class="remove-item-btn" data-product-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            updateCartItemQuantity(productId, 1);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            removeCartItem(productId);
        });
    });
    
    // Update cart summary
    updateCartSummary();
}

// Function to update cart item quantity
function updateCartItemQuantity(productId, change) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Find the item in the cart
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart items
        loadCartItems();
        
        // Update cart count in header
        updateCartCount();
    }
}

// Function to remove cart item
function removeCartItem(productId) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove the item from the cart
    cart = cart.filter(item => item.id !== productId);
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart items
    loadCartItems();
    
    // Update cart count in header
    updateCartCount();
    
    // Show notification
    showNotification('Item removed from cart!', 'success');
}

// Function to update cart summary
function updateCartSummary() {
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping (free for orders over ₹5000)
    const shipping = subtotal > 5000 ? 0 : 99;
    
    // Calculate tax (18% GST)
    const tax = subtotal * 0.18;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update elements
    subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
    shippingElement.textContent = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`;
    taxElement.textContent = `₹${tax.toLocaleString()}`;
    totalElement.textContent = `₹${total.toLocaleString()}`;
}

// Function to update cart count in header
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

// Mock OrdersAPI (replace with your actual API implementation)
const OrdersAPI = {
    create: async (orderData) => {
        // Simulate API call
        return new Promise(resolve => {
            setTimeout(() => {
                const order = {
                    id: Math.floor(Math.random() * 1000), // Generate a random ID
                    ...orderData
                };
                resolve(order);
            }, 500);
        });
    }
};

// Function to handle checkout
async function handleCheckout() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // User is not logged in, redirect to login page
        showNotification('Please login to checkout.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=cart.html';
        }, 1500);
        return;
    }
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showNotification('Your cart is empty.', 'error');
        return;
    }
    
    try {
        // Prepare order data
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 99;
        const tax = subtotal * 0.18;
        const total = subtotal + shipping + tax;
        
        const orderData = {
            userId: currentUser.id,
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            shipping,
            tax,
            total,
            status: 'pending',
            address: 'Default Address' // In a real app, you would get this from a form
        };
        
        // Create order in the API
        const order = await OrdersAPI.create(orderData);
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success notification
        showNotification('Order placed successfully!', 'success');
        
        // Redirect to order confirmation page
        setTimeout(() => {
            window.location.href = `order-confirmation.html?id=${order.id}`;
        }, 1500);
    } catch (error) {
        console.error('Checkout failed:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
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