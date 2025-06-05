document.addEventListener('DOMContentLoaded', function() {
    // Load cart items in order summary
    loadOrderSummary();
    
    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('creditCardForm').style.display = 
                this.value === 'creditCard' ? 'block' : 'none';
            document.getElementById('paypalForm').style.display = 
                this.value === 'paypal' ? 'block' : 'none';
        });
    });
    
    // Format card number input
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = this.value.replace(/\s+/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        this.value = value;
    });
    
    // Format expiry date input
    document.getElementById('expiry').addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            shipping: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value,
                phone: document.getElementById('phone').value
            },
            payment: {
                method: document.querySelector('input[name="paymentMethod"]:checked').value,
                cardNumber: document.getElementById('cardNumber').value,
                expiry: document.getElementById('expiry').value,
                cvc: document.getElementById('cvc').value,
                cardName: document.getElementById('cardName').value
            },
            items: JSON.parse(localStorage.getItem('cart')) || [],
            total: parseFloat(document.querySelector('.total-price').textContent.replace('$', ''))
        };
        
        // In a real app, you would send this to your backend
        console.log('Submitting order:', formData);
        
        // Simulate API call
        setTimeout(() => {
            // Create order confirmation
            const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to confirmation page
            window.location.href = `order-confirmation.html?order_id=${orderId}`;
        }, 1000);
    });
    
    function validateForm() {
        // Simple validation - in a real app you would do more thorough validation
        let isValid = true;
        
        // Check required fields
        document.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        // Validate credit card if selected
        if (document.getElementById('creditCard').checked) {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
            if (cardNumber.length !== 16) {
                alert('Please enter a valid 16-digit card number');
                isValid = false;
            }
            
            const expiry = document.getElementById('expiry').value;
            if (!expiry.match(/^\d{2}\/\d{2}$/)) {
                alert('Please enter a valid expiry date (MM/YY)');
                isValid = false;
            }
            
            const cvc = document.getElementById('cvc').value;
            if (cvc.length < 3) {
                alert('Please enter a valid CVC code');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    function loadOrderSummary() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItemsContainer = document.querySelector('.order-items');
        
        if (cart.length === 0) {
            // Shouldn't happen since checkout should only be accessible with items in cart
            window.location.href = 'cart.html';
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItemsContainer.appendChild(orderItem);
            
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
    }
});