document.addEventListener('DOMContentLoaded', function() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order_id');
    
    // Update order details
    if (orderId) {
        document.getElementById('orderNumber').textContent = orderId;
        
        // Set current date
        const today = new Date();
        document.getElementById('orderDate').textContent = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // In a real app, you would fetch order details from your backend
        // For now, we'll use the cart total from localStorage
        const cart = JSON.parse(localStorage.getItem('lastOrder')) || 
                     JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length > 0) {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = 0.00;
            const tax = subtotal * 0.00;
            const total = subtotal + shipping + tax;
            
            document.getElementById('orderTotal').textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Clear cart count
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
});