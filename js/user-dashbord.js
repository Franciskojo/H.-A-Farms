document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No auth token found');
        window.location.href = '/login.html'; // Redirect if not logged in
        return;
    }

    try {
        // 1. Fetch user profile
        const profileRes = await fetch('https://h-a-farms-backend.onrender.com/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!profileRes.ok) throw new Error('Failed to load user');
        const user = await profileRes.json();
        document.getElementById('userName').textContent = user.fullName;
        document.getElementById('userEmail').textContent = user.email;


        // Fetch user orders
        const orderRes = await fetch('https://h-a-farms-backend.onrender.com/order/get', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!orderRes.ok) throw new Error('Failed to load orders');

        const orderData = await orderRes.json();
        console.log('Order response:', orderData);

        // Safely get array from response
        const orders = Array.isArray(orderData)
            ? orderData
            : orderData.orders || orderData.data || [];

        document.getElementById('orderCount').textContent = orders.length;

        // Render order rows
        const tbody = document.querySelector('.orders-table tbody');
        tbody.innerHTML = '';

        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5">You have no recent orders.</td></tr>`;
        } else {
            orders.slice(0, 5).forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
            <td>${order.orderId || order._id}</td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td><span class="status ${order.status?.toLowerCase() || 'pending'}">${order.status || 'Pending'}</span></td>
            <td>₵${order.total?.toFixed(2) || '0.00'}</td>
            <td><a href="order-detail.html?id=${order._id}" class="btn-action">View</a></td>
        `;
                tbody.appendChild(tr);
            });
        }

        // Optional: address count if your backend supports it
        // const addressRes = await fetch('https://h-a-farms-backend.onrender.com/user/addresses', { headers: { Authorization: `Bearer ${token}` } });
        // const addresses = await addressRes.json();
        // document.getElementById('addressCount').textContent = addresses.length;

    } catch (error) {
        console.error('Dashboard error:', error);
    }

    // 3. Logout handler
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        });
    }
});
