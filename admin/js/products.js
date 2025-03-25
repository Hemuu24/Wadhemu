document.addEventListener('DOMContentLoaded', function() {
    // Load products
    loadProducts();
    
    // Load categories for filters and form
    loadCategories();
    
    // Add event listeners
    setupEventListeners();
});

// Function to load products
function loadProducts() {
    const productsTable = document.getElementById('products-table');
    if (!productsTable) return;
    
    const adminData = getAdminData();
    const products = adminData.products || [];
    
    productsTable.innerHTML = '';
    
    products.forEach(product => {
        const row = document.createElement('tr');
        
        // Determine stock status
        let stockStatus = 'in-stock';
        if (product.stock === 0) {
            stockStatus = 'out-of-stock';
        } else if (product.stock < 20) {
            stockStatus = 'low-stock';
        }
        
        row.innerHTML = `
            <td>
                <input type="checkbox" class="product-checkbox" data-id="${product.id}">
            </td>
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td class="product-price">
                ${product.discountPrice ? 
                    `<span class="discount-price">₹${product.discountPrice}</span>
                     <span class="original-price">₹${product.price}</span>` : 
                    `<span class="discount-price">₹${product.price}</span>`
                }
            </td>
            <td>
                <div class="stock-status ${stockStatus}">
                    <span class="stock-indicator"></span>
                    ${product.stock}
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" data-id="${product.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn view" data-id="${product.id}" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete" data-id="${product.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        productsTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addActionButtonListeners();
}

// Function to load categories
function loadCategories() {
    const categoryFilter = document.getElementById('category-filter');
    const productCategory = document.getElementById('product-category');
    
    if (!categoryFilter && !productCategory) return;
    
    const adminData = getAdminData();
    const categories = adminData.categories || [];
    
    // Populate category filter
    if (categoryFilter) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    // Populate product category select
    if (productCategory) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            productCategory.appendChild(option);
        });
    }
}

// Function to get category name by id
function getCategoryName(categoryId) {
    const adminData = getAdminData();
    const categories = adminData.categories || [];
    
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
}

// Function to setup event listeners
function setupEventListeners() {
    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', openAddProductModal);
    }
    
    // Select all checkbox
    const selectAll = document.getElementById('select-all');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.product-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Filter change events
    const filters = document.querySelectorAll('.filters select');
    filters.forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });
    
    // Cancel buttons
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModals);
    }
    
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeModals);
    }
    
    // Product form submission
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
    
    // Image upload
    const uploadBtn = document.getElementById('upload-btn');
    const productImage = document.getElementById('product-image');
    const imagePreview = document.getElementById('image-preview');
    
    if (uploadBtn && productImage) {
        uploadBtn.addEventListener('click', function() {
            productImage.click();
        });
        
        imagePreview.addEventListener('click', function() {
            productImage.click();
        });
        
        productImage.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Image">`;
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Confirm delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', deleteProduct);
    }
}

// Function to add event listeners to action buttons
function addActionButtonListeners() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.action-btn.edit');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            openEditProductModal(productId);
        });
    });
    
    // View buttons
    const viewButtons = document.querySelectorAll('.action-btn.view');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            // In a real application, this would open a product details view
            alert(`View product details for ID: ${productId}`);
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            openDeleteConfirmation(productId);
        });
    });
}

// Function to open add product modal
function openAddProductModal() {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const productForm = document.getElementById('product-form');
    const imagePreview = document.getElementById('image-preview');
    
    // Reset form
    productForm.reset();
    document.getElementById('product-id').value = '';
    modalTitle.textContent = 'Add New Product';
    imagePreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>Upload Image</p>';
    
    // Show modal
    modal.style.display = 'block';
}

// Function to open edit product modal
function openEditProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const productForm = document.getElementById('product-form');
    const imagePreview = document.getElementById('image-preview');
    
    // Get product data
    const adminData = getAdminData();
    const products = adminData.products || [];
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-discount-price').value = product.discountPrice || '';
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description;
    
    // Set image preview
    imagePreview.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
    
    // Update modal title
    modalTitle.textContent = 'Edit Product';
    
    // Show modal
    modal.style.display = 'block';
}

// Function to open delete confirmation
function openDeleteConfirmation(productId) {
    const modal = document.getElementById('delete-modal');
    
    // Store product ID to be deleted
    modal.setAttribute('data-product-id', productId);
    
    // Show modal
    modal.style.display = 'block';
}

// Function to close all modals
function closeModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Function to save product
function saveProduct(e) {
    e.preventDefault();
    
    // Get form data
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const discountPrice = document.getElementById('product-discount-price').value ? 
                          parseFloat(document.getElementById('product-discount-price').value) : null;
    const category = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    
    // Get image (in a real application, this would be uploaded to a server)
    const imagePreview = document.getElementById('image-preview');
    const imageElement = imagePreview.querySelector('img');
    const image = imageElement ? imageElement.src : '../images/placeholder.jpg';
    
    // Get admin data
    const adminData = getAdminData();
    const products = adminData.products || [];
    
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                discountPrice,
                category,
                stock,
                description,
                image
            };
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            discountPrice,
            category,
            stock,
            description,
            image,
            sold: 0
        };
        
        products.push(newProduct);
    }
    
    // Update admin data
    adminData.products = products;
    updateAdminData(adminData);
    
    // Reload products
    loadProducts();
    
    // Close modal
    closeModals();
    
    // Show success message
    alert(productId ? 'Product updated successfully!' : 'Product added successfully!');
}

// Function to delete product
function deleteProduct() {
    const deleteModal = document.getElementById('delete-modal');
    const productId = deleteModal.getAttribute('data-product-id');
    
    if (!productId) return;
    
    // Get admin data
    const adminData = getAdminData();
    const products = adminData.products || [];
    
    // Remove product
    const updatedProducts = products.filter(p => p.id !== productId);
    
    // Update admin data
    adminData.products = updatedProducts;
    updateAdminData(adminData);
    
    // Reload products
    loadProducts();
    
    // Close modal
    closeModals();
    
    // Show success message
    alert('Product deleted successfully!');
}

// Function to apply filters
function applyFilters() {
    // In a real application, this would filter the products based on the selected filters
    // For this demo, we'll just reload all products
    loadProducts();
}