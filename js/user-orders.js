document.addEventListener('DOMContentLoaded', async function () {
  // const params = new URLSearchParams(window.location.search);
  // const orderId = params.get("id");
  const token = localStorage.getItem('authToken');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  let user = null;

  try {
    const profileRes = await fetch('https://h-a-farms-backend.onrender.com/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok) throw new Error('Failed to load user');
    user = await profileRes.json();

    document.getElementById('userName').textContent = user.name || 'User';
    document.getElementById('userEmail').textContent = user.email;

    const profileImg = document.getElementById('userProfilePicture');
    if (profileImg) {
      profileImg.src = user.profilePicture || '/asset/default-avatar.png';
      profileImg.alt = `${user.name}'s profile picture`;
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    return;
  }

  // Order listing logic
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
    if (statusFilter.value) params.append('status', statusFilter.value);
    if (startDateInput.value) params.append('startDate', startDateInput.value);
    if (endDateInput.value) params.append('endDate', endDateInput.value);
    return params;
  }

  async function fetchOrders() {
    const params = buildQueryParams();

    try {
      const res = await fetch(`https://h-a-farms-backend.onrender.com/order/get?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('authToken');
          return (window.location.href = '/login.html');
        }
        throw new Error(`Server responded with ${res.status}`);
      }

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
        <td>${order.id}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td><span class="status ${order.status?.toLowerCase()}">${order.status}</span></td>
        <td>₵${order.total.toFixed(2)}</td>
        <td><a href="order-detail.html?id=${order.id}" class="btn-action">View</a></td>
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


  document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".user-sidebar");
  const toggleBtn = document.querySelector(".sidebar-toggle");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
});

