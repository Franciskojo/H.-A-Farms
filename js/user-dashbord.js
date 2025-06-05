document.addEventListener('DOMContentLoaded', function() {
    // Load user data
    const user = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'John Doe',
        email: 'john@example.com'
    };
    
    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // In a real app, you would fetch order data from your backend
    const mockOrders = [
        {
            id: 'ORD-123456',
            date: '2023-06-20',
            status: 'shipped',
            total: 219.98
        }
    ];
    
    document.getElementById('orderCount').textContent = mockOrders.length;
    
    // Initialize any other dashboard functionality
});