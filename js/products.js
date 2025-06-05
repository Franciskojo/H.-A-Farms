document.addEventListener('DOMContentLoaded', function() {
    // Mock product data - in a real app, this would come from an API
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 199.99,
            category: "electronics",
            image: "assets/images/product1.jpg",
            description: "Premium noise-cancelling wireless headphones with 30-hour battery life.",
            featured: true
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 249.99,
            category: "electronics",
            image: "assets/images/product2.jpg",
            description: "Fitness tracking smartwatch with heart rate monitor and GPS.",
            featured: true
        },
        // More products...
    ];

    // Load products
    renderProducts(products);

    // Filter and sort functionality
    document.getElementById('categoryFilter').addEventListener('change', function() {
        filterAndSortProducts();
    });

    document.getElementById('sortBy').addEventListener('change', function() {
        filterAndSortProducts();
    });

    function filterAndSortProducts() {
        const category = document.getElementById('categoryFilter').value;
        const sortBy = document.getElementById('sortBy').value;

        let filteredProducts = [...products];

        // Filter by category
        if (category) {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // Assuming newer products have higher IDs
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'featured':
            default:
                filteredProducts.sort((a, b) => b.featured - a.featured);
        }

        renderProducts(filteredProducts);
    }

    function renderProducts(productsToRender) {
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = '';

        if (productsToRender.length === 0) {
            productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
            return;
        }

        productsToRender.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <a href="product-detail.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p class="price">$${product.price.toFixed(2)}</p>
                </a>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            `;
            productGrid.appendChild(productCard);
        });

        // Re-attach event listeners to new buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.dataset.productId;
                addToCart(productId);
            });
        });
    }

    function addToCart(productId) {
        // Reuse the function from main.js
        if (typeof window.addToCart === 'function') {
            window.addToCart(productId);
        } else {
            // Fallback
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const product = products.find(p => p.id.toString() === productId);
            
            if (product) {
                cart.push({
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Product added to cart!');
            }
        }
    }
});