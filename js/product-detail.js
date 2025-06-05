document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // In a real app, you would fetch product details from an API
    // For now, we'll use mock data
    const mockProducts = {
        '1': {
            name: "Wireless Headphones",
            price: 199.99,
            description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
            category: "Electronics",
            images: [
                "assets/images/product1.jpg",
                "assets/images/product2.jpg",
                "assets/images/product3.jpg"
            ]
        }
    };
    
    const product = mockProducts[productId] || mockProducts['1'];
    
    // Populate product data
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = product.description;
    document.getElementById('productCategory').textContent = product.category;
    
    // Set main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = product.images[0];
    
    // Thumbnail click handler
    document.querySelectorAll('.thumbnail').forEach((thumb, index) => {
        thumb.src = product.images[index];
        thumb.addEventListener('click', function() {
            mainImage.src = this.src;
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Quantity selector
    const quantityElement = document.querySelector('.quantity');
    document.querySelector('.quantity-btn.minus').addEventListener('click', function() {
        let quantity = parseInt(quantityElement.textContent);
        if (quantity > 1) {
            quantityElement.textContent = quantity - 1;
        }
    });
    
    document.querySelector('.quantity-btn.plus').addEventListener('click', function() {
        let quantity = parseInt(quantityElement.textContent);
        quantityElement.textContent = quantity + 1;
    });
    
    // Add to cart button
    document.getElementById('addToCartBtn').addEventListener('click', function() {
        const quantity = parseInt(quantityElement.textContent);
        
        // In a real app, you would add the product to cart via API
        // For now, we'll use localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: quantity
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${quantity} ${product.name} added to cart!`);
        
        // Update cart count
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
    });
    
    // Tab functionality
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
});