const CART_API = 'https://h-a-farms-backend.onrender.com/cart';
const CHECKOUT_API = 'https://h-a-farms-backend.onrender.com/cart/checkout';

let cartItems = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadCartItems();
  renderOrderSummary();
});

// Load cart from backend
async function loadCartItems() {
  const token = localStorage.getItem('authToken');
  try {
    const res = await fetch(`${CART_API}/get`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok || !data.items || data.items.length === 0) {
      throw new Error("Cart is empty or does not exist");
    }

    cartItems = data.items.map(item => ({
      productId: item.product._id || item.product.id,
      productName: item.product.productName,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount || 0
    }));
  } catch (err) {
    alert("Your cart is empty. Redirecting...");
    location.href = 'cart.html';
  }
}

// Render the order summary
function renderOrderSummary() {
  const container = document.querySelector('.order-items');
  container.innerHTML = '';

  let subtotal = 0;

  cartItems.forEach(item => {
    subtotal += (item.price - item.discount) * item.quantity;
    container.innerHTML += `
      <div class="order-item">
        <strong>${item.productName}</strong>
        <span>${item.quantity} × GH₵${item.price.toFixed(2)}</span>
      </div>
    `;
  });

  const shipping = 0;
  const tax = subtotal * 0.00;
  const total = subtotal + shipping + tax;

  document.querySelector('.subtotal').textContent = `GH₵${subtotal.toFixed(2)}`;
  document.querySelector('.shipping').textContent = `GH₵${shipping.toFixed(2)}`;
  document.querySelector('.tax').textContent = `GH₵${tax.toFixed(2)}`;
  document.querySelector('.total').textContent = `GH₵${total.toFixed(2)}`;
}

// Handle checkout form submission
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('authToken');
  if (!token) return alert("You must be logged in to place an order.");

  const shipping = {
    streetAddress: document.getElementById('address').value.trim(),
    town: document.getElementById('town').value.trim(),
    region: document.getElementById('region').value.trim(),
    digitalAddress: document.getElementById('digitalAddress').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    country: document.getElementById('country').value.trim()
  };

  const billing = { ...shipping };
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

  const subtotal = parseFloat(document.querySelector('.subtotal').textContent.replace('GH₵', '')) || 0;
  const shippingCost = 5;
  const tax = subtotal * 0.00;
  const total = subtotal + tax + shippingCost;

  // Convert to format backend expects
  const orderItems = cartItems.map(item => ({
    product: item.productId,
    quantity: item.quantity,
    priceAtPurchase: item.price,
    nameAtPurchase: item.productName
  }));

  try {
    const res = await fetch(CHECKOUT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        shippingAddress: shipping,
        billingAddress: billing,
        paymentMethod,
        items: orderItems,
        shippingCost,
        tax,
        subtotal,
        total
      })
    });

    const rawText = await res.text();
    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("Server responded with non-JSON:", rawText);
      throw new Error("Server sent unexpected response. Check the console.");
    }

    if (!res.ok) {
      console.error("Validation errors:", data?.errors);
      console.error("Server error:", data?.message);
      throw new Error(data?.message || "Order submission failed");
    }

    await clearCart(token);
    location.href = `confirmation.html?orderId=${data.order.id}`;

  } catch (err) {
    alert(`${err.message}`);
    console.error("Checkout failed:", err);
  }
});

// Clear cart on success
async function clearCart(token) {
  await fetch(`${CART_API}/clear`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

// 🛠️ Debug button to log backend cart
document.getElementById('debugCart')?.addEventListener('click', async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert("Login required to debug cart.");
    return;
  }

  try {
    const res = await fetch(`${CART_API}/get`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    console.log("Cart from backend:", data);
    alert("Cart logged to console.");
  } catch (err) {
    alert("Failed to fetch cart.");
    console.error("Cart fetch error:", err);
  }
});
