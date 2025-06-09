document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch('https://h-a-farms-backend.onrender.com/me');
        if (!response.ok) throw new Error('Failed to load user');

        const user = await response.json();

        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;

        // Fetch orders too
        const orderRes = await fetch('/api/orders');
        const orders = await orderRes.json();

        document.getElementById('orderCount').textContent = orders.length;
    } catch (error) {
        console.error('Dashboard error:', error);
    }
});
