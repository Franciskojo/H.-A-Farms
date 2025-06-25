const CART_API = 'https://h-a-farms-backend.onrender.com/cart';

document.addEventListener("DOMContentLoaded", async () => {
  await loadCart(); // Load cart before enabling checkout

  const checkoutBtn = document.querySelector(".checkout-btn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      sessionStorage.setItem("checkoutSubtotal", document.querySelector(".subtotal").textContent);
      sessionStorage.setItem("checkoutShipping", document.querySelector(".shipping").textContent);
      sessionStorage.setItem("checkoutTax", document.querySelector(".tax").textContent);
      sessionStorage.setItem("checkoutTotal", document.querySelector(".total").textContent);

      window.location.href = "checkout.html";
    });
  }
});

async function loadCart() {
  const token = localStorage.getItem('authToken');
  let cart = [];

  if (token) {
    try {
      const res = await fetch(`${CART_API}/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        console.error("Received non-JSON response:", text);
        alert("Unexpected server error. Please try again later.");
        return;
      }

      const data = await res.json();

      if (res.ok) {
        cart = data.items
          .filter(item => item.product && item.product.id)
          .map(item => ({
            id: item.product.id,
            name: item.product.productName || item.product.name || "Unnamed",
            image: item.product.productImage || 'https://via.placeholder.com/80',
            price: item.price,
            quantity: item.quantity
          }));

        localStorage.setItem('cart', JSON.stringify(cart));
      } else {
        console.error('API error loading cart:', data.message);
        alert(data.message || 'Failed to load cart.');
      }
    } catch (err) {
      console.error('Network error loading cart:', err);
      alert('Failed to load cart. Please try again.');
    }
  } else {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  }

  renderCart(cart);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = cart.length;
}

function renderCart(cart) {
  const container = document.querySelector('.cart-items');
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    updateSummary(0);
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');

    itemEl.innerHTML = `
      <img src="${item.image}" width="80" />
      <div>
        <h4>${item.name}</h4>
        <p>Price: GH₵${item.price.toFixed(2)}</p>
        <div class="qty-controls">
          <button data-id="${item.id}" class="minus">-</button>
          <span>${item.quantity}</span>
          <button data-id="${item.id}" class="plus">+</button>
        </div>
        <button class="remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    container.appendChild(itemEl);
    subtotal += item.price * item.quantity;
  });

  updateSummary(subtotal);
  attachQtyHandlers();
}

function updateSummary(subtotal) {
  const shipping = 0.00;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  document.querySelector('.subtotal').textContent = `GH₵${subtotal.toFixed(2)}`;
  document.querySelector('.shipping').textContent = `GH₵${shipping.toFixed(2)}`;
  document.querySelector('.tax').textContent = `GH₵${tax.toFixed(2)}`;
  document.querySelector('.total').textContent = `GH₵${total.toFixed(2)}`;
}

function attachQtyHandlers() {
  document.querySelectorAll('.plus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(btn.dataset.id, 1));
  });
  document.querySelectorAll('.minus').forEach(btn => {
    btn.addEventListener('click', () => updateQty(btn.dataset.id, -1));
  });
  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(btn.dataset.id));
  });
}

async function updateQty(productId, change) {
  const token = localStorage.getItem('authToken');
  const qtySpan = document.querySelector(`button[data-id="${productId}"].minus`)?.nextElementSibling;
  if (!qtySpan) return;

  let currentQty = parseInt(qtySpan.textContent);
  const newQty = currentQty + change;

  if (token) {
    if (newQty <= 0) {
      await removeFromBackend(productId);
    } else {
      await addOrUpdateInBackend(productId, newQty);
    }
  } else {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = newQty;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  loadCart();
}

function removeItem(productId) {
  updateQty(productId, -Infinity);
}

async function addOrUpdateInBackend(productId, quantity) {
  const token = localStorage.getItem('authToken');
  return safeFetch(`${CART_API}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
}

async function removeFromBackend(productId) {
  const token = localStorage.getItem('authToken');
  return safeFetch(`${CART_API}/items/${productId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      alert('Server error. Please try again later.');
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      console.error('API error:', data);
      alert(data.message || 'Something went wrong.');
    }

    return data;
  } catch (err) {
    console.error('Network error:', err);
    alert('Network error. Please try again.');
  }
}
