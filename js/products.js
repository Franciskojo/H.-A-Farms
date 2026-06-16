const API_URL = 'https://h-a-farms-backend.onrender.com/products';
const CART_API_URL = 'https://h-a-farms-backend.onrender.com/cart';

let currentPage = 1;
let pageSize = 6;
let currentSearch = "";
let currentCategory = "";

// Load and display products
async function loadProducts(page = 1, searchTerm = "", category = "") {
  const container = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');

  // Show skeletons while loading
  container.style.display = 'grid';
  emptyState.style.display = 'none';
  container.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join('');

  try {
    const skip = (page - 1) * pageSize;
    let url = `${API_URL}?search=${encodeURIComponent(searchTerm)}&limit=${pageSize}&skip=${skip}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    const response = await fetch(url);
    const data = await response.json();

    const products = data.products || [];
    const total = data.total || 0;

    container.innerHTML = '';

    // Update results count
    if (resultsCount) {
      resultsCount.textContent = total > 0
        ? `Showing ${products.length} of ${total} product${total !== 1 ? 's' : ''}`
        : '';
    }

    if (products.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      renderPagination(0, 1);
      return;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const imagePath = product.productImage || '';
      const imageUrl = imagePath || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop';
      const inStock = product.quantity > 0;
      const stockLabel = inStock ? `In Stock (${product.quantity})` : 'Out of Stock';
      const cartClass = inStock ? 'addtocart-btn' : 'addtocart-btn disabled';
      const cartDisabled = inStock ? '' : 'disabled';

      card.innerHTML = `
        <span class="stock-badge${inStock ? '' : ' out'}">${stockLabel}</span>
        <div class="product-image">
          <img src="${imageUrl}" alt="${product.productName}" loading="lazy">
        </div>
        <div class="product-info">
          <p class="product-category">${product.category || 'Farm Produce'}</p>
          <h3 class="product-title">${product.productName}</h3>
          <div class="product-price">GH&#8373;${product.price.toFixed(2)}</div>
          <div class="product-meta">
            <span class="meta-tag"><i class="fas fa-box"></i> ${product.quantity} available</span>
          </div>
          <div class="product-actions">
            <a href="/product-detail.html?id=${product.id}" class="action-btn view-btn">
              <i class="fas fa-eye"></i> View
            </a>
            <button class="action-btn ${cartClass}" ${cartDisabled}
               data-id="${product.id}"
               data-name="${product.productName}"
               data-price="${product.price}"
               data-image="${imageUrl}"
               data-stock="${product.quantity}">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    renderPagination(total, page);
    attachCartListeners();
  } catch (err) {
    console.error('Failed to load products:', err);
    container.innerHTML = '<p style="text-align:center;color:#e53e3e;padding:3rem;">Failed to load products. Please try again.</p>';
  }
}

// Render pagination links
function renderPagination(total, currentPage) {
  const pagination = document.querySelector('.pagination');
  pagination.innerHTML = '';

  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.textContent = i;
    if (i === currentPage) pageLink.classList.add('active');

    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadProducts(i, currentSearch);
    });

    pagination.appendChild(pageLink);
  }
}

// Attach cart buttons
function attachCartListeners() {
  const buttons = document.querySelectorAll('.addtocart-btn:not(.disabled)');
  buttons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      if (button.disabled) return;

      const product = {
        id: button.dataset.id,
        name: button.dataset.name,
        price: parseFloat(button.dataset.price),
        image: button.dataset.image,
        stock: parseInt(button.dataset.stock)
      };

      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding…';
      await handleAddToCart(product);
      setTimeout(() => {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
      }, 1500);
    });
  });
}

// Handle add to cart for guest and logged-in user
async function handleAddToCart(product) {
  const token = localStorage.getItem('authToken');
  const productId = product.id;

  if (!productId || productId === 'undefined') {
    console.error("Invalid product ID in handleAddToCart", product);
    Swal.fire('Error', 'Invalid product ID.', 'error');
    return;
  }

  if (!token) {
    // Guest cart using localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);

    if (index !== -1) {
      if (cart[index].quantity + 1 > product.stock) {
        return Swal.fire('Stock Limit', `Only ${product.stock} items available.`, 'warning');
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

    // SweetAlert2 toast success
    Swal.fire({
      icon: 'success',
      title: `${product.name} added to cart!`,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    });

    return;
  }

  // Logged-in user
  try {
    const response = await fetch(`${CART_API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Non-JSON response from backend:", text);
      Swal.fire('Error', 'Unexpected server response.', 'error');
      return;
    }

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: `${product.name} added to cart!`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    } else {
      Swal.fire('Error', data.message || 'Failed to add to cart.', 'error');
    }
  } catch (error) {
    console.error('💥 Add to cart failed:', error);
    Swal.fire('Error', 'Failed to add product to cart.', 'error');
  }
}


// DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  loadProducts(1, '', '');

  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchBtn');

  searchButton.addEventListener('click', () => {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadProducts(1, currentSearch, currentCategory);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentSearch = searchInput.value.trim();
      currentPage = 1;
      loadProducts(1, currentSearch, currentCategory);
    }
  });
});
