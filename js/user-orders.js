document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (!token) return (window.location.href = '/login.html');

  let currentPage = 1;
  const limit = 5;

  const tbody = document.querySelector('.orders-table tbody');
  const paginationContainer = document.querySelector('.pagination');

  const statusFilter = document.getElementById('statusFilter');
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  function buildQueryParams() {
    const params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', limit);

    const status = statusFilter.value;
    const start = startDateInput.value;
    const end = endDateInput.value;

    if (status) params.append('status', status);
    if (start) params.append('startDate', start);
    if (end) params.append('endDate', end);

    return params;
  }

  async function fetchOrders() {
    const params = buildQueryParams();

    try {
      const res = await fetch(`https://h-a-farms-backend.onrender.com/order/get?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      renderOrders(data.orders);
      renderPagination(data.page, data.totalPages);
    } catch (err) {
      console.error('Failed to load orders:', err);
      tbody.innerHTML = `<tr><td colspan="5">Failed to load orders</td></tr>`;
    }
  }

  function renderOrders(orders) {
    tbody.innerHTML = '';

    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="5">No orders found</td></tr>`;
      return;
    }

    orders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order.orderId || order._id}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td>₵${order.total?.toFixed(2)}</td>
        <td><a href="order-detail.html?id=${order._id}" class="btn-action">View</a></td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderPagination(current, totalPages) {
    paginationContainer.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = current === 1;
    prevBtn.classList.add('page-btn');
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchOrders();
      }
    });
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.classList.add('page-btn');
      if (i === current) pageBtn.classList.add('active');

      pageBtn.addEventListener('click', () => {
        currentPage = i;
        fetchOrders();
      });

      paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = current === totalPages;
    nextBtn.classList.add('page-btn');
    nextBtn.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchOrders();
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  // Filter listeners
  [statusFilter, startDateInput, endDateInput].forEach(input =>
    input.addEventListener('change', () => {
      currentPage = 1;
      fetchOrders();
    })
  );

  fetchOrders();
});
