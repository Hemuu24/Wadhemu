import { UsersAPI } from './users_api.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Initialize registration form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    // Check if user is already logged in
    checkAuthStatus();
});

// Function to handle login form submission
async function handleLogin(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const loginButton = document.querySelector('#login-form button[type="submit"]');
    
    // Validate inputs
    if (!emailInput.value.trim() || !passwordInput.value.trim()) {
        showNotification('Please enter both email and password.', 'error');
        return;
    }
    
    try {
        // Disable login button and show loading state
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        
        // Call login API
        const user = await UsersAPI.login(emailInput.value.trim(), passwordInput.value);
        
        // Save user data to localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Show success notification
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect based on user role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } catch (error) {
        console.error('Login failed:', error);
        showNotification(error.message || 'Login failed. Please check your credentials.', 'error');
        
        // Reset login button
        loginButton.disabled = false;
        loginButton.innerHTML = 'Login';
    }
}

// Function to handle registration form submission
async function handleRegistration(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById('register-name');
    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const registerButton = document.querySelector('#register-form button[type="submit"]');
    
    // Validate inputs
    if (!nameInput.value.trim() || !emailInput.value.trim() || !passwordInput.value || !confirmPasswordInput.value) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }
    
    if (passwordInput.value !== confirmPasswordInput.value) {
        showNotification('Passwords do not match.', 'error');
        return;
    }
    
    try {
        // Disable register button and show loading state
        registerButton.disabled = true;
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
        
        // Call register API
        await UsersAPI.register({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            role: 'customer'
        });
        
        // Show success notification
        showNotification('Registration successful! Please login.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        console.error('Registration failed:', error);
        showNotification(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
        // Reset register button
        registerButton.disabled = false;
        registerButton.innerHTML = 'Register';
    }
}

// Function to check authentication status
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update UI based on authentication status
    const authLinks = document.getElementById('auth-links');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (authLinks && userDropdown) {
        if (currentUser) {
            // User is logged in
            authLinks.style.display = 'none';
            userDropdown.style.display = 'flex';
            
            // Set user name
            const userNameElement = document.getElementById('user-name');
            if (userNameElement) {
                userNameElement.textContent = currentUser.name;
            }
            
            // Add logout event listener
            const logoutButton = document.getElementById('logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }
        } else {
            // User is not logged in
            authLinks.style.display = 'flex';
            userDropdown.style.display = 'none';
        }
    }
}

// Function to handle logout
function handleLogout() {
    // Clear user data from localStorage
    localStorage.removeItem('currentUser');
    
    // Show notification
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
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