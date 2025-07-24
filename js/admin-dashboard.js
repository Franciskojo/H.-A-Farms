
function showLoader() {
  const loader = document.getElementById('loaderOverlay');
  if (loader) loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('loaderOverlay');
  if (loader) loader.style.display = 'none';
}

function showError(message) {
  console.error(message);
  alert(message);
}

function redirectToLogin() {
  window.location.href = '/login.html';
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS'
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}



async function fetchDashboardData(params = {}) {
  showLoader();

  try {
    const token = localStorage.getItem('authToken');
    if (!token) return redirectToLogin();

    const query = new URLSearchParams(params).toString();
    const response = await fetch(`https://h-a-farms-backend.onrender.com/admin/summary?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`Server returned ${response.status}`);

    const data = await response.json();
    updateDashboard(data);
  } catch (err) {
    console.error('Dashboard error:', err);
    showError('Failed to load dashboard data. Please try again.');
  } finally {
    hideLoader();
  }
}

function updateDashboard(data) {
  updateStats(data);
  updateRecentOrders(data.recentOrders || []);
  renderChart('salesChart', 'Sales Overview', data.salesChartData);
  renderChart('revenueChart', 'Revenue Sources', data.revenueSources);
}

function updateStats(data) {
  document.getElementById('revenue').textContent = formatCurrency(data.totalRevenue || 0);
  document.getElementById('orders').textContent = (data.totalOrders || 0).toLocaleString();
  document.getElementById('products').textContent = (data.totalProducts || 0).toLocaleString();
  document.getElementById('users').textContent = (data.totalUsers || 0).toLocaleString();
}

function updateRecentOrders(orders) {
  const container = document.getElementById('recentOrdersList');
  if (!container) return;

  container.innerHTML = orders.length
    ? orders.map(createOrderRow).join('')
    : `<tr><td colspan="6" class="no-orders">No recent orders found</td></tr>`;
}

function createOrderRow(order) {
  const status = order.status?.toLowerCase() || 'unknown';
  const statusClass = `status ${status}`;
  return `
    <tr>
      <td>${order._id || ''}</td>
      <td>${order.user?.name || 'User'}</td>
      <td>${formatDate(order.createdAt)}</td>
      <td>${formatCurrency(order.total || 0)}</td>
      <td><span class="${statusClass}">${status}</span></td>
      <td><a href="/admin/order-detail.html?id=${order._id}" class="action-link">View</a></td>
    </tr>
  `;
}


function renderChart(canvasId, label, chartData) {
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx || !isValidChartData(chartData)) {
    console.warn(`⚠️ Skipping chart "${canvasId}" due to missing or invalid data.`);
    return;
  }

  if (window[canvasId] instanceof Chart) {
    window[canvasId].destroy();
  }

  const type = canvasId === 'revenueChart' ? 'pie' : 'line';
  window[canvasId] = new Chart(ctx, createChartConfig(type, label, chartData));
}

function isValidChartData(data) {
  return Array.isArray(data?.labels) && Array.isArray(data?.data) && data.labels.length && data.data.length;
}

function createChartConfig(type, label, chartData) {
  const isPie = type === 'pie';
  const colors = ['#4a6bff', '#00b894', '#fd79a8', '#6c5ce7', '#ffa502', '#ff4757'];

  // Helper: Format YYYY-MM or YYYY-MM-DD
  function formatDateLabel(rawLabel) {
    // ✅ Monthly (YYYY-MM)
    if (/^\d{4}-\d{2}$/.test(rawLabel)) {
      const [year, month] = rawLabel.split('-');
      const date = new Date(`${year}-${month}-01`);
      const monthName = date.toLocaleString('default', { month: 'short' });
      return `${monthName} ${year}`; // e.g. Jul 2025
    }

    // ✅ Daily (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawLabel)) {
      const date = new Date(rawLabel);
      const day = date.getDate();
      const monthName = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${monthName} ${year}`; // e.g. 23 Jul 2025
    }

    // ✅ Otherwise, leave unchanged
    return rawLabel;
  }

  return {
    type,
    data: {
      labels: chartData.labels,
      datasets: [{
        label,
        data: chartData.data,
        backgroundColor: isPie ? colors : 'rgba(76, 175, 80, 0.1)',
        borderColor: isPie ? undefined : '#4CAF50',
        borderWidth: isPie ? 1 : 2,
        fill: !isPie,
        tension: isPie ? 0 : 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => {
              const raw = tooltipItems[0].label;
              return formatDateLabel(raw);
            },
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.raw || 0;
              return `${label}: ${formatCurrency(value)}`;
            }
          }
        }
      },
      scales: isPie ? {} : {
        x: {
          ticks: {
            callback: (val) => formatDateLabel(chartData.labels[val])
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => formatCurrency(value)
          }
        }
      }
    }
  };
}

function initDashboard() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const startInput = document.getElementById('startDate');
  const endInput = document.getElementById('endDate');
  if (startInput && endInput) {
    startInput.valueAsDate = lastWeek;
    endInput.valueAsDate = today;
  }

  const rangeSelect = document.getElementById('rangeSelect');
  const filterBtn = document.getElementById('applyFilter');
  if (rangeSelect) rangeSelect.addEventListener('change', handleRangeChange);
  if (filterBtn) filterBtn.addEventListener('click', handleCustomFilter);

  fetchDashboardData({ range: 'week' });
}

function handleRangeChange() {
  const range = document.getElementById('rangeSelect').value;
  const customFields = document.getElementById('customRangeFields');

  customFields.style.display = range === 'user' ? 'flex' : 'none';

  if (range !== 'user') {
    fetchDashboardData({ range });
  }
}

function handleCustomFilter() {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  if (!start || !end) return showError('Please select both start and end dates');
  if (new Date(start) > new Date(end)) return showError('Start date cannot be after end date');

  fetchDashboardData({ start, end });
}

function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initDashboard();
});
