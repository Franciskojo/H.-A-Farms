document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("User not authenticated.");
    window.location.href = "/auth/login.html";
    return;
  }

  if (!orderId || !/^[a-f\d]{24}$/i.test(orderId)) {
    alert("Invalid order ID.");
    return;
  }

  try {
    const res = await fetch(`https://h-a-farms-backend.onrender.com/order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to load order details. Server says: ${errText}`);
    }

    const order = await res.json();

    // 🔽 Populate order details...
    document.getElementById("orderNumber").textContent = order._id;
    document.querySelector(".order-date").textContent = `Placed on ${new Date(order.createdAt).toDateString()}`;
    document.querySelector(".status").textContent = order.status;

    const user = order.user || {};
    document.getElementById("userName").textContent = user.name || "User";
    document.getElementById("userEmail").textContent = user.email || "";

    // ✅ Define profileImg before using it
    const profileImg = document.getElementById('userProfilePicture');
    if (profileImg) {
      profileImg.src = user.profilePicture || '/asset/default-avatar.png';
      profileImg.alt = `${user.name}'s profile picture`;
    }

    const sa = order.shippingAddress;
    document.querySelector(".order-shipping address").innerHTML = `
      ${user.name || "Customer"}<br>
      ${sa.streetAddress}<br>
      ${sa.town}, ${sa.region}<br>
      ${sa.country}<br>
      ${sa.phone}
    `;

    const ba = order.billingAddress || sa;
    document.querySelector(".order-payment address").innerHTML = `
      ${user.name || "Customer"}<br>
      ${ba.streetAddress}<br>
      ${ba.town}, ${ba.region}<br>
      ${ba.country}<br>
      ${ba.phone}
    `;

    const pm = order.paymentMethod?.replace(/_/g, ' ').toUpperCase() || "UNKNOWN";
    document.querySelector(".order-payment p").textContent = pm;

    const tbody = document.querySelector(".items-table tbody");
    tbody.innerHTML = "";

    (order.items || []).forEach(item => {
      const product = item.product || {};
      const image = product.productImage || "/asset/no-image.png";
      const name = product.productName || item.nameAtPurchase || "Unnamed Product";
      const sku = product.sku || "N/A";
      const total = (item.priceAtPurchase * item.quantity).toFixed(2);

      tbody.innerHTML += `
        <tr>
          <td>
            <div class="product-info">
              <img src="${image}" alt="${name}">
              <div>
                <h4>${name}</h4>
                <p>SKU: ${sku}</p>
              </div>
            </div>
          </td>
          <td>₵${item.priceAtPurchase.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>₵${total}</td>
        </tr>
      `;
    });

    const summary = document.querySelector(".order-totals .totals-col:last-child");
    summary.innerHTML = `
      <div class="summary-row"><span>Subtotal:</span><span>₵${order.subtotal?.toFixed(2) || "0.00"}</span></div>
      <div class="summary-row"><span>Shipping:</span><span>₵${order.shippingCost?.toFixed(2) || "0.00"}</span></div>
      <div class="summary-row"><span>Tax:</span><span>₵${order.tax?.toFixed(2) || "0.00"}</span></div>
      <div class="summary-row total"><span>Total:</span><span>₵${order.total?.toFixed(2) || "0.00"}</span></div>
    `;
  } catch (err) {
    console.error("❌ Unable to load order details:", err);
    alert("Unable to load order details.");
  }
});
