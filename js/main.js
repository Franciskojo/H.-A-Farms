document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuthStatus();
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            addToCart(productId);
        });
    });
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            checkAuthStatus();
            window.location.href = 'index.html';
        });
    }
});

function checkAuthStatus() {
    const authToken = localStorage.getItem('authToken');
    const userActions = document.querySelector('.user-actions');
    
    if (authToken) {
        // User is logged in
        userActions.querySelector('a:not(.logged-in a)').style.display = 'none';
        userActions.querySelector('.logged-in').style.display = 'block';
    } else {
        // User is logged out
        userActions.querySelector('a:not(.logged-in a)').style.display = 'inline-block';
        userActions.querySelector('.logged-in').style.display = 'none';
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show feedback
    alert('Product added to cart!');
    
    // Update cart count in header
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    } else {
        // Create cart count element if it doesn't exist
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            const countEl = document.createElement('span');
            countEl.className = 'cart-count';
            countEl.textContent = totalItems;
            cartLink.appendChild(countEl);
        }
    }
}

// Initialize cart count on page load
updateCartCount();