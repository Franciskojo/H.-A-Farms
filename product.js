 // Simple cart functionality
        function addToCart(productName, price) {
            const notification = document.getElementById('cartNotification');
            notification.style.display = 'block';
            notification.textContent = `${productName} added to cart!`;
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
            
            // In a real implementation, you would add to a cart array or send to backend
            console.log(`Added to cart: ${productName} - ₵${price}`);
        }