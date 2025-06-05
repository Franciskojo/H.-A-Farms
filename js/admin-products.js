document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    function performSearch(query) {
        console.log('Searching for:', query);
        // In a real app, you would filter products or make an API call
    }
    
    // Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.closest('tr').querySelector('td').textContent;
            window.location.href = `product-edit.html?id=${productId}`;
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this product?')) {
                const row = this.closest('tr');
                console.log('Deleting product:', row.querySelector('td').textContent);
                // In a real app, you would make an API call to delete
                row.remove();
            }
        });
    });
    
    // Pagination
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            
            document.querySelectorAll('.page-btn').forEach(b => {
                b.classList.remove('active');
                b.disabled = false;
            });
            
            if (this.textContent === 'Previous' || this.textContent === 'Next') {
                // Handle previous/next
            } else {
                this.classList.add('active');
            }
            
            // In a real app, you would fetch the page from your backend
            console.log('Loading page:', this.textContent);
        });
    });
});