document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initOrderPage();
  fetchAdminProfile();

  document.getElementById("logoutBtn").addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("authToken");
    window.location.href = "/auth/login.html";
  });
});

function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

function initOrderPage() {
  fetchOrders();

  // Filter by status
  document.getElementById('statusFilter').addEventListener('change', () => fetchOrders(1));

  // Pagination
  document.querySelector('.pagination').addEventListener('click', (e) => {
    if (e.target.classList.contains('page-btn') && !e.target.disabled) {
      const page = parseInt(e.target.textContent);
      if (!isNaN(page)) {
        fetchOrders(page);
      }
    }
  });

  // Handle status change
  document.querySelector('table').addEventListener('change', async (e) => {
    if (e.target.classList.contains('status-select')) {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      if (!orderId) return;

      const token = localStorage.getItem('authToken');
      try {
        const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/orders/${orderId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status: newStatus })
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(`Failed to update status. ${error.message || res.statusText}`);
        }

        alert('Order status updated.');
      } catch (err) {
        console.error(err);
        alert(err.message || 'Failed to update order status.');
      }
    }
  });
}

async function fetchOrders(page = 1) {
  const token = localStorage.getItem('authToken');
  const status = document.getElementById('statusFilter').value;
  const params = new URLSearchParams({ page, limit: 10 });
  if (status) params.append('status', status);

  try {
    const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/all?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error(`Error ${res.status}: Unable to fetch orders`);
    const data = await res.json();

    renderOrders(data.orders || []);
    renderPagination(data.page, data.totalPages);
  } catch (err) {
    console.error(err);
    alert('Failed to load orders.');
  }
}

function renderOrders(orders) {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;

  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="6">No orders found.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled']
      .map(status => `<option value="${status}" ${order.status === status ? 'selected' : ''}>${status}</option>`)
      .join('');

    return `
      <tr>
        <td>${order.id}</td>
        <td>${order.user?.name || 'Guest'}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>GHS ${order.total?.toFixed(2) || '0.00'}</td>
        <td>
          <select class="status-select" data-id="${order.id}">
            ${statusOptions}
          </select>
        </td>
        <td>
          <div class="table-actions">
            <a href="/admin/order-detail.html?id=${order.id}" class="btn-edit">View</a>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderPagination(current, totalPages) {
  const container = document.querySelector('.pagination');
  if (!container) return;

  let buttons = '';

  // Previous
  buttons += `<button class="page-btn" ${current === 1 ? 'disabled' : ''}>Previous</button>`;

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    buttons += `<button class="page-btn ${i === current ? 'active' : ''}">${i}</button>`;
  }

  // Next
  buttons += `<button class="page-btn" ${current === totalPages ? 'disabled' : ''}>Next</button>`;

  container.innerHTML = buttons;
}

async function fetchAdminProfile() {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('https://h-a-farms-backend.onrender.com/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch admin profile');

    const data = await response.json();

    const avatarEl = document.getElementById('adminAvatar');
    if (data.profilePicture && avatarEl) {
      avatarEl.src = data.profilePicture;
    }

    const nameEl = document.getElementById('adminName');
    if (data.name && nameEl) {
      nameEl.textContent = data.name;
    }
  } catch (err) {
    console.error('Avatar load error:', err);
  }
}
