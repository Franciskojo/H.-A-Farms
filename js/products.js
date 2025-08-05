const API_URL = 'https://h-a-farms-backend.onrender.com/products';
const CART_API_URL = 'https://h-a-farms-backend.onrender.com/cart';

let currentPage = 1;
let pageSize = 6;
let currentSearch = "";

// Load and display products
async function loadProducts(page = 1, searchTerm = "") {
  try {
    const skip = (page - 1) * pageSize;
    const url = `${API_URL}?search=${encodeURIComponent(searchTerm)}&limit=${pageSize}&skip=${skip}`;

    const response = await fetch(url);
    const data = await response.json();

    const products = data.products || [];
    const total = data.total || 0;

    const container = document.querySelector('.product-grid');
    container.innerHTML = '';

    if (products.length === 0) {
      container.innerHTML = `<p>No products found.</p>`;
    }

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      const imagePath = product.productImage || '';
      const imageUrl = imagePath ? imagePath : 'https://via.placeholder.com/300x200?text=No+Image';

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

    renderPagination(total, page);
    attachCartListeners();
  } catch (err) {
    console.error('Failed to load products:', err);
    alert('Failed to load products. Please try again.');
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
  loadProducts();

  const searchInput = document.querySelector('.search-bar input');
  const searchButton = document.querySelector('.search-bar button');

  searchButton.addEventListener('click', () => {
    currentSearch = searchInput.value.trim();
    loadProducts(1, currentSearch);
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      currentSearch = searchInput.value.trim();
      loadProducts(1, currentSearch);
    }
  });
});
