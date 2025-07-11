const API_URL = 'https://h-a-farms-backend.onrender.com/products';
const CART_API_URL = 'https://h-a-farms-backend.onrender.com/cart';

// Load and display products
async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    const container = document.querySelector('.product-grid');
    container.innerHTML = '';

    products.forEach(product => {
      console.log("Loaded product:", product);
      const card = document.createElement('div');
      card.classList.add('product-card');

      const imagePath = product.productImage || '';
      const imageUrl = imagePath
        ? imagePath
        : 'https://via.placeholder.com/300x200?text=No+Image';

      card.innerHTML = `
        <div class="product-image">
          <img src="${imageUrl}" alt="${product.productName}">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.productName}</h3>
          <div class="product-price">GH₵${product.price.toFixed(2)}</div>
          <div class="product-meta">
            <span>${product.category}</span>
            <span>In Stock: ${product.quantity}</span>
          </div>
          <div class="product-actions">
            <a href="product-detail.html?id=${product.id}" class="action-btn view-btn">View</a>
            <a href="#" class="action-btn addtocart-btn" 
               data-id="${product.id}" 
               data-name="${product.productName}" 
               data-price="${product.price}" 
               data-image="${imageUrl}" 
               data-stock="${product.quantity}">
              Add to cart
            </a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    attachCartListeners();
  } catch (err) {
    console.error('Failed to load products:', err);
    alert('Failed to load products. Please try again.');
  }
}

function attachCartListeners() {
  const buttons = document.querySelectorAll('.addtocart-btn');
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const product = {
        id: button.dataset.id, 
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
        stock: parseInt(button.dataset.stock)
      };

      await handleAddToCart(product);
    });
  });
}

// Handles both guest and authenticated add-to-cart
async function handleAddToCart(product) {
  const token = localStorage.getItem('authToken');

  const productId = product.id;
  if (!productId || productId === 'undefined') {
    console.error("🚨 Missing or invalid product ID in handleAddToCart", product);
    alert("Failed to add product: invalid product ID.");
    return;
  }

  if (!token) {
    // Guest user - store in localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
      if (cart[index].quantity + 1 > product.stock) {
        return alert(`Only ${product.stock} items available in stock.`);
      }
      cart[index].quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image || '',
        stock: product.stock,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart.`);
    return;
  }

  // Authenticated user - sync with backend
  try {
    console.log("✅ Adding to backend cart:", { productId, quantity: 1 });

    const response = await fetch(`${CART_API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        productId,
        quantity: 1
      })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Non-JSON response from backend:", text);
      alert("Unexpected server response. Please try again.");
      return;
    }

    if (response.ok) {
      alert(`${product.name} added to cart!`);
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (error) {
    console.error('💥 Add to cart failed:', error);
    alert('Failed to add product to cart.');
  }
}

window.addEventListener('DOMContentLoaded', loadProducts);
