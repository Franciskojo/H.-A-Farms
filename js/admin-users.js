document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  initSidebar();
  fetchAdminProfile();
  setupFilters();
  setupPagination();
  setupLogout();
});

// Fetch users with optional pagination and role filter
async function fetchUsers(page = 1) {
  const role = document.getElementById('roleFilter')?.value || '';
  const token = localStorage.getItem('authToken');
  const query = new URLSearchParams({ role, page });

  try {
    const response = await fetch(`https://h-a-farms-backend.onrender.com/users/all?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch users.');

    const data = await response.json();
    renderUsers(data.users || []);
  } catch (err) {
    console.error(err);
    alert('Unable to load users.');
  }
}

// Render user rows
function renderUsers(users) {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6">No users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(user => {
    const roleOptions = `
      <option value="customer" ${user.role === 'user' ? 'selected' : ''}>User</option>
      <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
    `;

    return `
      <tr>
        <td>${user.id}</td>
        <td>
          <div class="user-info">
            <img src="${user.profilePicture || '/assets/images/user-avatar.jpg'}" alt="User">
            <span>${user.name || 'Unnamed'}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td>
          <select class="role-select" data-userid="${user.id}">
            ${roleOptions}
          </select>
        </td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        <td>

        </td>
      </tr>
    `;
  }).join('');
}

// Initialize sidebar toggle
function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

// Setup role filter listener
function setupFilters() {
  const roleFilter = document.getElementById('roleFilter');
  if (roleFilter) {
    roleFilter.addEventListener('change', () => fetchUsers(1));
  }
}

// Setup pagination buttons
function setupPagination() {
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.target.textContent;
      if (!isNaN(page)) fetchUsers(page);
    });
  });
}

// Fetch and display admin avatar and name
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

// Logout button event
function setupLogout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("authToken");
      window.location.href = "/auth/login.html";
    });
  }
}
