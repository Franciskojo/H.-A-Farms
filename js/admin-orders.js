document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    document.getElementById('statusFilter').addEventListener('change', function() {
        applyFilters();
    });
    
    document.getElementById('startDate').addEventListener('change', function() {
        applyFilters();
    });
    
    document.getElementById('endDate').addEventListener('change', function() {
        applyFilters();
    });
    
    function applyFilters() {
        const status = document.getElementById('statusFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        console.log('Applying filters:', { status, startDate, endDate });
        // In a real app, you would filter orders or make an API call
    }
    
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
        // In a real app, you would filter orders or make an API call
    }
    
    // Status select changes
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', function() {
            const orderId = this.closest('tr').querySelector('td').textContent;
            const newStatus = this.value;
            
            console.log(`Updating order ${orderId} to status: ${newStatus}`);
            // In a real app, you would make an API call to update the status
        });
    });
    
    // View buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td').textContent;
            window.location.href = `order-detail.html?id=${orderId}`;
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