document.addEventListener('DOMContentLoaded', function() {
    // Load cart items
    loadCart();
    
    // Checkout button
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Check if user is logged in
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            if (confirm('You need to login to proceed to checkout. Go to login page?')) {
                window.location.href = 'auth/login.html?redirect=checkout.html';
            }
            return;
        }
        
        window.location.href = 'checkout.html';
    });
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartDiv = document.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        emptyCartDiv.style.display = 'block';
        document.querySelector('.checkout-btn').disabled = true;
        return;
    }
    
    emptyCartDiv.style.display = 'none';
    
    // Clear existing items (except empty cart message)
    const existingItems = document.querySelectorAll('.cart-item');
    existingItems.forEach(item => item.remove());
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="item-quantity">
                    <button class="quantity-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <button class="remove-item" data-product-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.insertBefore(cartItem, emptyCartDiv);
        
        subtotal += item.price * item.quantity;
    });
    
    // Calculate totals
    const shipping = 5.99;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    // Update summary
    document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.total-price').textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(this.closest('.cart-item'), -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            updateQuantity(this.closest('.cart-item'), 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            removeItem(this.closest('.cart-item'), this.dataset.productId);
        });
    });
}

function updateQuantity(itemElement, change) {
    const productId = itemElement.querySelector('.remove-item').dataset.productId;
    const quantityElement = itemElement.querySelector('.quantity');
    let quantity = parseInt(quantityElement.textContent);
    
    quantity += change;
    
    if (quantity < 1) {
        removeItem(itemElement, productId);
        return;
    }
    
    quantityElement.textContent = quantity;
    
    // Update cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id.toString() === productId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Refresh cart to update totals
    }
}

function removeItem(itemElement, productId) {
    if (confirm('Remove this item from your cart?')) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const updatedCart = cart.filter(item => item.id.toString() !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        // Update UI
        itemElement.remove();
        
        // Check if cart is now empty
        if (updatedCart.length === 0) {
            document.querySelector('.empty-cart').style.display = 'block';
            document.querySelector('.checkout-btn').disabled = true;
        }
        
        // Update totals
        loadCart();
        
        // Update cart count in header
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    }
}