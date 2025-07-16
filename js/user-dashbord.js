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
    // 1. Fetch profile
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

    document.getElementById('editFullName').value = user.name;
    document.getElementById('editEmail').value = user.email;

    // 2. Fetch orders
    const orderRes = await fetch('https://h-a-farms-backend.onrender.com/order/get', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orderData = await orderRes.json();
    const orders = Array.isArray(orderData) ? orderData : orderData.orders || [];
    document.getElementById('orderCount').textContent = orders.length;

    const tbody = document.querySelector('.orders-table tbody');
    tbody.innerHTML = '';

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">You have no recent orders.</td></tr>`;
    } else {
      orders.slice(0, 5).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${order.orderId || order.id}</td>
          <td>${new Date(order.createdAt).toLocaleDateString()}</td>
          <td><span class="status ${order.status?.toLowerCase() || 'pending'}">${order.status || 'Pending'}</span></td>
          <td>₵${order.total?.toFixed(2) || '0.00'}</td>
          <td><a href="order-detail.html?id=${order.id}" class="btn-action">View</a></td>
        `;
        tbody.appendChild(tr);
      });
    }

  } catch (err) {
    console.error('Dashboard error:', err);
    alert('Failed to load dashboard.');
  }

  // 3. Logout
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = '/login.html';
    });
  }

  // 4. Toggle Edit Profile form
  const editBtn = document.getElementById('editProfileBtn');
  const editForm = document.getElementById('editProfileForm');

  if (editBtn && editForm) {
    editBtn.addEventListener('click', () => {
      editForm.style.display = 'block';
      editBtn.style.display = 'none';
    });
  }

  // 5. Handle Edit Profile form submission
  if (editForm) {
    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const formData = new FormData();
      formData.append('name', document.getElementById('editFullName').value.trim());
      formData.append('email', document.getElementById('editEmail').value.trim());

      const fileInput = document.getElementById('editProfilePicture');
      if (fileInput && fileInput.files.length > 0) {
        formData.append('profilePicture', fileInput.files[0]);
      }

      try {
        const res = await fetch(`https://h-a-farms-backend.onrender.com/users/${user._id}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        const result = await res.json();
        if (!res.ok) {
          alert(result.message || 'Failed to update profile');
          return;
        }

        alert('Profile updated successfully!');
        location.reload();
      } catch (error) {
        console.error('Profile update error:', error);
        alert('An error occurred while updating profile.');
      }
    });
  }
});

function logout() {
  localStorage.removeItem('authToken');     
  sessionStorage.removeItem('authToken');    

  // Optional: clear cookies (if used)
  document.cookie = 'token=; Max-Age=0; path=/';

  // Redirect to login or homepage
  window.location.href = '/auth/login.html';
}

const sidebarToggle = document.getElementById('sidebarToggle');
  const userSidebar = document.querySelector('.user-sidebar');

  sidebarToggle.addEventListener('click', () => {
    userSidebar.classList.toggle('open'); 
  });


