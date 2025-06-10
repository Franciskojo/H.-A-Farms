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

      const imagePath = product.images?.[0]?.url || '';
      const imageUrl = imagePath
        ? (imagePath.startsWith('/')
            ? `https://h-a-farms-backend.onrender.com${imagePath}`
            : `https://h-a-farms-backend.onrender.com/${imagePath}`)
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
            <a href="/admin/edit-product.html?id=${product._id}" class="action-btn edit-btn">Add to cart</a>
            
          </div>
        </div>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load products:', err);
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert('Product deleted');
      loadProducts(); // Reload list
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
  } catch (err) {
    console.error('Delete failed:', err);
  }
}

window.addEventListener('DOMContentLoaded', loadProducts);
