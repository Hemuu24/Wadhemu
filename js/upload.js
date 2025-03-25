document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('upload-area');
    const previewArea = document.getElementById('preview-area');
    const prescriptionFile = document.getElementById('prescription-file');
    const browseBtn = document.getElementById('browse-btn');
    const removeBtn = document.getElementById('remove-btn');
    const previewImage = document.getElementById('preview-image');
    const previewDetails = document.getElementById('preview-details');
    const prescriptionForm = document.getElementById('prescription-form');
    
    if (!uploadArea || !prescriptionFile) return;
    
    // Handle browse button click
    browseBtn.addEventListener('click', function() {
        prescriptionFile.click();
    });
    
    // Handle file selection
    prescriptionFile.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Handle drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    // Handle remove button
    removeBtn.addEventListener('click', function() {
        prescriptionFile.value = '';
        previewArea.style.display = 'none';
        uploadArea.style.display = 'block';
        previewImage.innerHTML = '';
        previewDetails.innerHTML = '';
    });
    
    // Handle form submission
    prescriptionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!prescriptionFile.files.length) {
            showNotification('Please upload a prescription', 'error');
            return;
        }
        
        // In a real application, you would send the form data to a server
        // For demo purposes, we'll just show a success message
        
        showNotification('Prescription submitted successfully!', 'success');
        
        // Reset form after submission
        setTimeout(() => {
            prescriptionForm.reset();
            removeBtn.click();
        }, 2000);
    });
    
    // Function to handle files
    function handleFiles(files) {
        if (!files.length) return;
        
        const file = files[0];
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            showNotification('Please upload a valid file (JPG, PNG, PDF)', 'error');
            return;
        }
        
        // Display file preview
        uploadArea.style.display = 'none';
        previewArea.style.display = 'block';
        
        // Create preview
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            previewImage.innerHTML = '';
            previewImage.appendChild(img);
        } else {
            previewImage.innerHTML = '<i class="fas fa-file-pdf fa-3x"></i>';
        }
        
        // Display file details
        const fileSize = (file.size / 1024).toFixed(2) + ' KB';
        previewDetails.innerHTML = `
            <p><strong>File Name:</strong> ${file.name}</p>
            <p><strong>File Type:</strong> ${file.type}</p>
            <p><strong>File Size:</strong> ${fileSize}</p>
        `;
    }
    
    // Custom notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `upload-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        .upload-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .upload-notification.success {
            background: linear-gradient(135deg, #00F5A0, #00D9F5);
            color: #1A1A2E;
        }
        
        .upload-notification.error {
            background: linear-gradient(135deg, #FF4FCD, #FF758C);
            color: white;
        }
        
        .upload-notification.show {
            transform: translateX(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});