document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get("id");
  const token = localStorage.getItem("authToken");

  if (!orderId || !token) {
    alert("Order not found or unauthorized.");
    return;
  }

  try {
    const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to load order details");
    const order = await res.json();

    document.getElementById("orderId").textContent = order._id;
    document.getElementById("orderDate").textContent = new Date(order.createdAt).toLocaleString();
    document.getElementById("orderStatus").textContent = order.status;
    document.getElementById("paymentMethod").textContent = order.paymentMethod;
    document.getElementById("orderTotal").textContent = `GHS ${order.total.toFixed(2)}`;

    document.getElementById("userName").textContent = order.user?.name || "Guest";
    document.getElementById("userEmail").textContent = order.user?.email || "";

    const addr = order.shippingAddress;
    document.getElementById("shippingAddress").textContent =
      `${addr.streetAddress}, ${addr.town}, ${addr.region}, ${addr.digitalAddress}, ${addr.country}. Tel: ${addr.phone}`;

    document.getElementById("orderItemsBody").innerHTML = order.items.map((item, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${item.nameAtPurchase}</td>
        <td>${item.quantity}</td>
        <td>GHS ${item.priceAtPurchase.toFixed(2)}</td>
        <td>GHS ${(item.priceAtPurchase * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error("Unable to load order details:", err);
    alert("Error loading order details.");
  }
});
