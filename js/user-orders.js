document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    const user = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'John Doe',
        email: 'john@example.com'
    };
    
    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // Filter functionality
    document.getElementById('statusFilter').addEventListener('change', function() {
        filterOrders();
    });
    
    document.getElementById('startDate').addEventListener('change', function() {
        filterOrders();
    });
    
    document.getElementById('endDate').addEventListener('change', function() {
        filterOrders();
    });
    
    function filterOrders() {
        const status = document.getElementById('statusFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        console.log('Filtering orders by:', { status, startDate, endDate });
        // In a real app, you would fetch filtered orders from your backend
    }
    
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