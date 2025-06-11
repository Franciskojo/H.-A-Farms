const API_URL = 'https://h-a-farms-backend.onrender.com/products';

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    const products = await response.json();

    const container = document.querySelector('.product-grid');
    container.innerHTML = ''; // Clear static content

    products.forEach(product => {
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
      <div class="product-price">GH₵${product.price}</div>
      <div class="product-meta">
        <span>${product.category}</span>
        <span>In Stock: ${product.quantity}</span>
      </div>
      <div class="product-actions">
        <a href="product-detail.html?id=${product._id}" class="action-btn view-btn">View</a>
        <a href="/admin/edit-product.html?id=${product._id}" class="action-btn addtocart-btn">Add to cart</a>
      </div>
    </div>
  `;
  container.appendChild(card);
});

  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

const CART_API_URL = 'https://h-a-farms-backend.onrender.com/cart'; // Adjust if different

async function addToCart(productId) {
  try {
    const response = await fetch(CART_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication token if needed
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1, // Or allow dynamic quantity
      }),
    });

    if (response.ok) {
      alert('Product added to cart!');
    } else {
      const error = await response.json();
      alert(`Error adding to cart: ${error.message}`);
    }
  } catch (err) {
    console.error('Add to cart failed:', err);
    alert('An error occurred while adding the product to the cart.');
  }
}


window.addEventListener('DOMContentLoaded', loadProducts);
