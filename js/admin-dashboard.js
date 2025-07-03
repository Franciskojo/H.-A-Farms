document.addEventListener('DOMContentLoaded', () => {
  const rangeSelect = document.getElementById('rangeSelect');
  const customFields = document.getElementById('customRangeFields');
  const applyBtn = document.getElementById('applyFilter');

  fetchDashboardData('week');

  rangeSelect.addEventListener('change', () => {
    const val = rangeSelect.value;
    customFields.style.display = val === 'custom' ? 'flex' : 'none';
    if (val !== 'custom') fetchDashboardData(val);
  });

  applyBtn.addEventListener('click', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;
    if (!start || !end) return alert('Select both start and end dates.');
    fetchDashboardData('custom', start, end);
  });
});

async function fetchDashboardData(range, start = null, end = null) {
  const token = localStorage.getItem('authToken');
  let url = `https://h-a-farms-backend.onrender.com/admin/summary`;
  if (range === 'custom') url += `?start=${start}&end=${end}`;
  else url += `?range=${range}`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    const [revenueEl, ordersEl, productsEl, usersEl] = document.querySelectorAll('.stat-card p');
    revenueEl.textContent = `$${data.totalRevenue.toFixed(2)}`;
    ordersEl.textContent = data.totalOrders;
    productsEl.textContent = data.totalProducts;
    usersEl.textContent = data.totalUsers;

    const tbody = document.querySelector('.data-table tbody');
    tbody.innerHTML = '';
    data.recentOrders.forEach(order => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${order._id}</td>
        <td>${order.customerName}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td><button class="btn-edit" onclick="location.href='/admin/order-detail.html?id=${order._id}'">View</button></td>
      `;
      tbody.appendChild(tr);
    });

    renderSalesChart(data.salesChartData);
    renderRevenueChart(data.revenueSources);

  } catch (err) {
    console.error(err);
    alert('Failed to load dashboard data.');
  }
}

function renderSalesChart(chartData) {
  const ctx = document.getElementById('salesChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Sales ($)',
        data: chartData.data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

function renderRevenueChart(chartData) {
  const ctx = document.getElementById('revenueChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: chartData.labels,
      datasets: [{
        label: 'Revenue Sources',
        data: chartData.data,
        backgroundColor: ['#66BB6A', '#FFA726', '#42A5F5']
      }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}
