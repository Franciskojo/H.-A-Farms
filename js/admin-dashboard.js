//    const hamburgerBtn = document.getElementById('hamburgerBtn');
//     const sidebar = document.querySelector('.admin-sidebar');

//     hamburgerBtn.addEventListener('click', () => {
//         sidebar.classList.toggle('show');
//     });

//     // Optional: Hide sidebar when clicking outside
//     document.addEventListener('click', function (e) {
//         if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
//             sidebar.classList.remove('show');
//         }
//     });


document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    
    // Sales chart (line chart)
    new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Monthly Sales',
                data: [2500, 3200, 2800, 4100, 3700, 4500],
                borderColor: '#4a6bff',
                tension: 0.1,
                fill: true,
                backgroundColor: 'rgba(74, 107, 255, 0.1)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Revenue chart (doughnut chart)
    new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
            labels: ['Electronics', 'Clothing', 'Home Goods', 'Other'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#4a6bff',
                    '#6c5ce7',
                    '#00b894',
                    '#fd79a8'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Notification button
    document.querySelector('.btn-notification').addEventListener('click', function() {
        alert('Notifications would appear here');
    });
    
    // View order buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.closest('tr').querySelector('td').textContent;
            window.location.href = `orders.html?order_id=${orderId}`;
        });
    });
});