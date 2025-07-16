document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  // Event listener for filters
  document.getElementById('roleFilter').addEventListener('change', fetchUsers);

  // Event listener for pagination (basic)
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = e.target.textContent;
      if (!isNaN(page)) fetchUsers(page);
    });
  });
});

async function fetchUsers(page = 1) {
  const role = document.getElementById('roleFilter').value;
  const token = localStorage.getItem('authToken');
  const tbody = document.querySelector('table tbody');
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
          <div class="table-actions">
            <button class="btn-edit" data-userid="${user.id}">Edit</button>
            <button class="btn-delete" data-userid="${user.id}">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
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
});
