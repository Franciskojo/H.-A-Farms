document.addEventListener('DOMContentLoaded', () => {
  const rangeSelect = document.getElementById('rangeSelect');
  const customFields = document.getElementById('customRangeFields');
  const applyFilterBtn = document.getElementById('applyFilter');

  // Load default (week) on page load
  fetchDashboardData({ range: 'week' });

  // Show/hide custom range fields
  rangeSelect.addEventListener('change', () => {
    if (rangeSelect.value === 'custom') {
      customFields.style.display = 'flex';
    } else {
      customFields.style.display = 'none';
      fetchDashboardData({ range: rangeSelect.value });
    }
  });

  // Handle custom date filter
  applyFilterBtn.addEventListener('click', () => {
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    if (!start || !end) {
      alert('Please select both start and end dates');
      return;
    }

    fetchDashboardData({ start, end });
  });
});

async function fetchDashboardData(params = {}) {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('Please log in as an admin.');
    window.location.href = '/login.html';
    return;
  }

  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`https://h-a-farms-backend.onrender.com/admin/summary?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('❌ Server returned non-JSON:', text);
      throw new Error('Invalid response from server');
    }

    updateStats(data);
    updateRecentOrders(data.recentOrders || []);
    renderChart('salesChart', 'Sales Overview', data.salesChartData);
    renderChart('revenueChart', 'Revenue Sources', data.revenueSources);

  } catch (err) {
    console.error('Dashboard error:', err);
    alert('Failed to load dashboard data.');
  }
}

function updateStats(data) {
  document.getElementById('revenue').textContent = `$${(data.totalRevenue ?? 0).toFixed(2)}`;
  document.getElementById('orders').textContent = data.totalOrders ?? 0;
  document.getElementById('products').textContent = data.totalProducts ?? 0;
  document.getElementById('users').textContent = data.totalUsers ?? 0;
}

function updateRecentOrders(orders) {
  const tbody = document.querySelector('.data-table tbody');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">No recent orders</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order._id}</td>
      <td>${order.customerName}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>$${(order.total ?? 0).toFixed(2)}</td>
      <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
      <td><button class="btn-edit">View</button></td>
    `;
    tbody.appendChild(row);
  });
}

function renderChart(canvasId, label, chartData) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');

  // Safeguard: Don't continue if chartData is missing or malformed
  if (!chartData || !Array.isArray(chartData.labels) || !Array.isArray(chartData.data)) {
    console.warn(`⚠️ Skipping chart "${canvasId}" due to missing or invalid data.`);
    return;
  }

  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  window[canvasId] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartData.labels,
      datasets: [{
        label,
        data: chartData.data,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
