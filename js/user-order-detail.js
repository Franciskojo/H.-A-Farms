document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');
    
    if (orderId) {
        document.getElementById('orderNumber').textContent = orderId;
    }
    
    // Load user data
    const user = JSON.parse(localStorage.getItem('currentUser')) || {
        name: 'John Doe',
        email: 'john@example.com'
    };
    
    // Update user info
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    
    // In a real app, you would fetch order details from your backend
    // and populate all the order information
});